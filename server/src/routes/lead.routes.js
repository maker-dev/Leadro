import express from "express";
import {
  createLead,
  getClientLeads,
  updateLead,
  deleteLead,
  getAllLeadsGroupedByClients,
  getClientLeadsById,
  createLeadFromWebhook,
  getLeadById,
} from "../controllers/lead.controller.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyRole.js";
import validate from "../middlewares/validate.js";
import checkApiKeyOrRateLimitByIP from "../middlewares/rateLimit/checkApiKeyOrRateLimitByIP.js";
import apiKeyRateLimiter from "../middlewares/rateLimit/rateLimitByApiKey.js";
import {
  CreateLeadValidation,
  UpdateLeadValidation,
  DeleteLeadValidation,
  GetClientLeadsValidation,
  GetClientLeadsByIdValidation,
} from "../middlewares/validation/LeadValidation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management endpoints
 */

//CLIENT API

/**
 * @swagger
 * /api/leads/client:
 *   post:
 *     summary: Create a new lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "lead@example.com"
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 pattern: '^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$'
 *                 example: "+1234567890"
 *               source:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Website"
 *               message:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Interested in your services"
 *               company:
 *                 type: string
 *                 example: "Acme Inc"
 *               jobTitle:
 *                 type: string
 *                 example: "CEO"
 *               industry:
 *                 type: string
 *                 example: "Technology"
 *
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     email:
 *                       type: string
 *                       example: "lead@example.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     source:
 *                       type: string
 *                       example: "Website"
 *                     status:
 *                       type: string
 *                       enum: [new, contacted, converted, lost]
 *                       example: "new"
 *                     message:
 *                       type: string
 *                       example: "Interested in your services"
 *                     extraFields:
 *                       type: object
 *                       description: Additional custom fields for the lead
 *                       additionalProperties: true
 *                       example:
 *                         company: "Acme Inc"
 *                         jobTitle: "CEO"
 *                         industry: "Technology"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.post(
  "/client",
  verifyToken,
  verifyRole(["client"]),
  CreateLeadValidation,
  validate,
  createLead
);

/**
 * @swagger
 * /api/leads/client:
 *   get:
 *     summary: Get all leads for the authenticated client with pagination and filtering
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 8
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: Search term for name, email, or phone
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, new, contacted, converted, lost]
 *           default: all
 *         description: Filter by lead status
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 50
 *         description: Filter by lead source
 *       - in: query
 *         name: owner
 *         schema:
 *           type: string
 *           enum: [me, anyone]
 *           default: anyone
 *         description: Filter by ownership (me = owned by user, anyone = owned + shared)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created after this date (ISO 8601 format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created before this date (ISO 8601 format)
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     leads:
 *                       type: array
 *                       description: Array of leads
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: Lead ID
 *                             example: "60d21b4667d0d8992e610c85"
 *                           email:
 *                             type: string
 *                             description: Email of the lead
 *                             example: "lead@example.com"
 *                           name:
 *                             type: string
 *                             description: Name of the lead
 *                             example: "John Doe"
 *                           phone:
 *                             type: string
 *                             description: Phone number of the lead
 *                             example: "+1234567890"
 *                           source:
 *                             type: string
 *                             description: Source of the lead
 *                             example: "Website"
 *                           status:
 *                             type: string
 *                             enum: [new, contacted, converted, lost]
 *                             description: Current status of the lead
 *                             example: "new"
 *                           message:
 *                             type: string
 *                             description: Message from the lead
 *                             example: "Interested in your services"
 *                           extraFields:
 *                             type: object
 *                             description: Additional custom fields for the lead
 *                             additionalProperties: true
 *                             example:
 *                               company: "Acme Inc"
 *                               jobTitle: "CEO"
 *                               industry: "Technology"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             description: When the lead was created
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             description: When the lead was last updated
 *                           owner:
 *                             type: string
 *                             enum: [me, shared]
 *                             description: Ownership status
 *                             example: "me"
 *                           sharedBy:
 *                             type: string
 *                             description: Owner ID if shared (null if owned by user)
 *                             example: "60d21b4667d0d8992e610c86"
 *                     pagination:
 *                       type: object
 *                       description: Pagination information
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           description: Current page number
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           description: Total number of pages
 *                           example: 5
 *                         totalItems:
 *                           type: integer
 *                           description: Total number of items
 *                           example: 40
 *                         itemsPerPage:
 *                           type: integer
 *                           description: Number of items per page
 *                           example: 8
 *                         hasNextPage:
 *                           type: boolean
 *                           description: Whether there is a next page
 *                           example: true
 *                         hasPrevPage:
 *                           type: boolean
 *                           description: Whether there is a previous page
 *                           example: false
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Page must be a positive integer"]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.get(
  "/client",
  verifyToken,
  verifyRole(["client"]),
  GetClientLeadsValidation,
  validate,
  getClientLeads
);

/**
 * @swagger
 * /api/leads/client/{id}:
 *   get:
 *     summary: Get a lead by ID for the authenticated client
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: Lead retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     email:
 *                       type: string
 *                       example: "lead@example.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     source:
 *                       type: string
 *                       example: "Website"
 *                     status:
 *                       type: string
 *                       enum: [new, contacted, converted, lost]
 *                       example: "new"
 *                     message:
 *                       type: string
 *                       example: "Interested in your services"
 *                     extraFields:
 *                       type: object
 *                       description: Additional custom fields for the lead
 *                       additionalProperties: true
 *                       example:
 *                         company: "Acme Inc"
 *                         jobTitle: "CEO"
 *                         industry: "Technology"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid lead ID format
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.get("/client/:id", verifyToken, verifyRole(["client"]), getLeadById);

/**
 * @swagger
 * /api/leads/client/{id}:
 *   put:
 *     summary: Update a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lead
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "updated@example.com"
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "Updated Name"
 *               phone:
 *                 type: string
 *                 pattern: '^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$'
 *                 example: "+1987654321"
 *               source:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Referral"
 *               status:
 *                 type: string
 *                 enum: [new, contacted, converted, lost]
 *                 example: "contacted"
 *               message:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Updated message"
 *     responses:
 *       200:
 *         description: Lead updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     email:
 *                       type: string
 *                       example: "updated@example.com"
 *                     name:
 *                       type: string
 *                       example: "Updated Name"
 *                     phone:
 *                       type: string
 *                       example: "+1987654321"
 *                     source:
 *                       type: string
 *                       example: "Referral"
 *                     status:
 *                       type: string
 *                       enum: [new, contacted, converted, lost]
 *                       example: "contacted"
 *                     message:
 *                       type: string
 *                       example: "Updated message"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.put(
  "/client/:id",
  verifyToken,
  verifyRole(["client"]),
  UpdateLeadValidation,
  validate,
  updateLead
);

/**
 * @swagger
 * /api/leads/client/{id}:
 *   delete:
 *     summary: Delete a lead
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the lead
 *     responses:
 *       200:
 *         description: Lead deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead deleted successfully"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.delete(
  "/client/:id",
  verifyToken,
  verifyRole(["client"]),
  DeleteLeadValidation,
  validate,
  deleteLead
);

//ADMIN API

/**
 * @swagger
 * /api/leads/admin/grouped:
 *   get:
 *     summary: Get all leads grouped by clients (Admin only)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         description: Search term for lead name, email, or phone
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         description: Filter by lead source
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, contacted, converted, lost]
 *         description: Filter by lead status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created after this date (ISO 8601 format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created before this date (ISO 8601 format)
 *       - in: query
 *         name: clientName
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 50
 *         description: Filter by client name
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   description: Number of client groups
 *                   example: 2
 *                 data:
 *                   type: array
 *                   description: Array of client groups with their leads
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Client ID
 *                         example: "60d21b4667d0d8992e610c85"
 *                       clientName:
 *                         type: string
 *                         description: Name of the client
 *                         example: "John Doe"
 *                       clientEmail:
 *                         type: string
 *                         description: Email of the client
 *                         example: "john@example.com"
 *                       totalLeads:
 *                         type: integer
 *                         description: Total number of leads for this client
 *                         example: 5
 *                       leads:
 *                         type: array
 *                         description: Array of leads belonging to this client
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: Lead ID
 *                               example: "60d21b4667d0d8992e610c85"
 *                             name:
 *                               type: string
 *                               description: Name of the lead
 *                               example: "Lead Name"
 *                             email:
 *                               type: string
 *                               description: Email of the lead
 *                               example: "lead@example.com"
 *                             phone:
 *                               type: string
 *                               description: Phone number of the lead
 *                               example: "+1234567890"
 *                             source:
 *                               type: string
 *                               description: Source of the lead
 *                               example: "Website"
 *                             status:
 *                               type: string
 *                               enum: [new, contacted, converted, lost]
 *                               description: Current status of the lead
 *                               example: "new"
 *                             message:
 *                               type: string
 *                               description: Message from the lead
 *                               example: "Interested in services"
 *                             extraFields:
 *                               type: object
 *                               description: Additional custom fields for the lead
 *                               additionalProperties: true
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               description: When the lead was created
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               description: When the lead was last updated
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Search term must be between 2 and 100 characters"]
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get(
  "/admin/grouped",
  verifyToken,
  verifyRole(["admin"]),
  getAllLeadsGroupedByClients
);

/**
 * @swagger
 * /api/leads/admin/clients/{clientId}:
 *   get:
 *     summary: Get all leads for a specific client (Admin only)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the client
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, email, or phone
 *       - in: query
 *         name: source
 *         schema:
 *           type: string
 *         description: Filter by lead source
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, contacted, converted, lost]
 *         description: Filter by lead status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter leads created before this date
 *     responses:
 *       200:
 *         description: Leads retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60d21b4667d0d8992e610c85"
 *                       name:
 *                         type: string
 *                         example: "Lead Name"
 *                       email:
 *                         type: string
 *                         example: "lead@example.com"
 *                       phone:
 *                         type: string
 *                         example: "+1234567890"
 *                       source:
 *                         type: string
 *                         example: "Website"
 *                       status:
 *                         type: string
 *                         enum: [new, contacted, converted, lost]
 *                         example: "new"
 *                       message:
 *                         type: string
 *                         example: "Interested in services"
 *                       extraFields:
 *                         type: object
 *                         additionalProperties: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get(
  "/admin/clients/:clientId",
  verifyToken,
  verifyRole(["admin"]),
  GetClientLeadsByIdValidation,
  validate,
  getClientLeadsById
);

//PUBLIC API

/**
 * @swagger
 * /api/leads/client/webhook:
 *   post:
 *     summary: Create a new lead through webhook (Public API)
 *     tags: [Leads]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "lead@example.com"
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 pattern: '^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$'
 *                 example: "+1234567890"
 *               source:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Website"
 *               message:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Interested in your services"
 *               extraFields:
 *                 type: object
 *                 description: Additional custom fields for the lead
 *                 additionalProperties: true
 *                 example:
 *                   company: "Acme Inc"
 *                   jobTitle: "CEO"
 *                   industry: "Technology"
 *     responses:
 *       201:
 *         description: Lead created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Lead created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     email:
 *                       type: string
 *                       example: "lead@example.com"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     phone:
 *                       type: string
 *                       example: "+1234567890"
 *                     source:
 *                       type: string
 *                       example: "Website"
 *                     status:
 *                       type: string
 *                       enum: [new, contacted, converted, lost]
 *                       example: "new"
 *                     message:
 *                       type: string
 *                       example: "Interested in your services"
 *                     extraFields:
 *                       type: object
 *                       description: Additional custom fields for the lead
 *                       additionalProperties: true
 *                       example:
 *                         company: "Acme Inc"
 *                         jobTitle: "CEO"
 *                         industry: "Technology"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Validation error"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Email is required"]
 *       401:
 *         description: Unauthorized - Invalid or missing API key
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "API key is required"
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Too many requests, please try again later"
 *       500:
 *         description: Server error
 */
router.post(
  "/client/webhook",
  checkApiKeyOrRateLimitByIP,
  apiKeyRateLimiter,
  CreateLeadValidation,
  validate,
  createLeadFromWebhook
);

export default router;
