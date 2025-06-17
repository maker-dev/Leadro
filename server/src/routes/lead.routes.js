import express from 'express';
import { createLead, getClientLeads, updateLead, deleteLead, filterLeads, getAllLeadsGroupedByClients, getClientLeadsById, createLeadFromWebhook } from '../controllers/lead.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyPublicApisToken from '../middlewares/verifyPublicApisToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import validate from '../middlewares/validate.js';
import { CreateLeadValidation, UpdateLeadValidation, DeleteLeadValidation, FilterLeadsValidation, GetClientLeadsByIdValidation } from '../middlewares/validation/LeadValidation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Leads
 *   description: Lead management endpoints
 */

/**
 * @swagger
 * /api/leads:
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
router.post('/', verifyToken, verifyRole(['client']), CreateLeadValidation, validate, createLead);

/**
 * @swagger
 * /api/leads:
 *   get:
 *     summary: Get all leads for the authenticated client
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
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
 *                   description: Number of leads found
 *                   example: 5
 *                 data:
 *                   type: array
 *                   description: Array of leads
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Lead ID
 *                         example: "60d21b4667d0d8992e610c85"
 *                       email:
 *                         type: string
 *                         description: Email of the lead
 *                         example: "lead@example.com"
 *                       name:
 *                         type: string
 *                         description: Name of the lead
 *                         example: "John Doe"
 *                       phone:
 *                         type: string
 *                         description: Phone number of the lead
 *                         example: "+1234567890"
 *                       source:
 *                         type: string
 *                         description: Source of the lead
 *                         example: "Website"
 *                       status:
 *                         type: string
 *                         enum: [new, contacted, converted, lost]
 *                         description: Current status of the lead
 *                         example: "new"
 *                       message:
 *                         type: string
 *                         description: Message from the lead
 *                         example: "Interested in your services"
 *                       extraFields:
 *                         type: object
 *                         description: Additional custom fields for the lead
 *                         additionalProperties: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the lead was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the lead was last updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.get('/', verifyToken, verifyRole(['client']), getClientLeads);

/**
 * @swagger
 * /api/leads/{id}:
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
router.put('/:id', verifyToken, verifyRole(['client']), UpdateLeadValidation, validate, updateLead);

/**
 * @swagger
 * /api/leads/{id}:
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
router.delete('/:id', verifyToken, verifyRole(['client']), DeleteLeadValidation, validate, deleteLead);

/**
 * @swagger
 * /api/leads/filter:
 *   get:
 *     summary: Filter and search leads
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
 *         description: Search term for name, email, or phone
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
 *     responses:
 *       200:
 *         description: Leads filtered successfully
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
 *                   description: Number of leads found
 *                   example: 5
 *                 data:
 *                   type: array
 *                   description: Array of filtered leads
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Lead ID
 *                         example: "60d21b4667d0d8992e610c85"
 *                       email:
 *                         type: string
 *                         description: Email of the lead
 *                         example: "lead@example.com"
 *                       name:
 *                         type: string
 *                         description: Name of the lead
 *                         example: "John Doe"
 *                       phone:
 *                         type: string
 *                         description: Phone number of the lead
 *                         example: "+1234567890"
 *                       source:
 *                         type: string
 *                         description: Source of the lead
 *                         example: "Website"
 *                       status:
 *                         type: string
 *                         enum: [new, contacted, converted, lost]
 *                         description: Current status of the lead
 *                         example: "new"
 *                       message:
 *                         type: string
 *                         description: Message from the lead
 *                         example: "Interested in your services"
 *                       extraFields:
 *                         type: object
 *                         description: Additional custom fields for the lead
 *                         additionalProperties: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the lead was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the lead was last updated
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
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.get('/filter', verifyToken, verifyRole(['client']), FilterLeadsValidation, validate, filterLeads);

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
router.get('/admin/grouped', verifyToken, verifyRole(['admin']), getAllLeadsGroupedByClients);

/**
 * @swagger
 * /api/leads/admin/clients/{clientId}/leads:
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
router.get('/admin/clients/:clientId/leads', verifyToken, verifyRole(['admin']), GetClientLeadsByIdValidation, validate, getClientLeadsById);

router.post("/webhook", verifyPublicApisToken, CreateLeadValidation, validate, createLeadFromWebhook);

export default router;