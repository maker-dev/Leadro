import express from 'express';
import { createLead, getClientLeads, updateLead, deleteLead, filterLeads, getAllLeadsGroupedByClients, getClientLeadsById, createLeadFromWebhook, getLeadsSharedWithMe, getLeadsSharedByClient, updateSharedLead, deleteSharedLead } from '../controllers/lead.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import validate from '../middlewares/validate.js';
import checkApiKeyOrRateLimitByIP from '../middlewares/rateLimit/checkApiKeyOrRateLimitByIP.js';
import apiKeyRateLimiter from '../middlewares/rateLimit/rateLimitByApiKey.js';
import { CreateLeadValidation, UpdateLeadValidation, DeleteLeadValidation, FilterLeadsValidation, GetClientLeadsByIdValidation, GetLeadsSharedByClientValidation, UpdateSharedLeadValidation, DeleteSharedLeadValidation } from '../middlewares/validation/LeadValidation.js';

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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.post('/client', verifyToken, verifyRole(['client']), CreateLeadValidation, validate, createLead);

/**
 * @swagger
 * /api/leads/client:
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
router.get('/client', verifyToken, verifyRole(['client']), getClientLeads);

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
router.put('/client/:id', verifyToken, verifyRole(['client']), UpdateLeadValidation, validate, updateLead);

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
router.delete('/client/:id', verifyToken, verifyRole(['client']), DeleteLeadValidation, validate, deleteLead);

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
router.get('/client/filter', verifyToken, verifyRole(['client']), FilterLeadsValidation, validate, filterLeads);

/**
 * @swagger
 * /api/leads/client/shared-with-me:
 *   get:
 *     summary: Get all leads shared with the authenticated client
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Leads shared with the client, grouped by owner
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
 *                   example: 2
 *                 data:
 *                   type: array
 *                   description: Array of groups by owner
 *                   items:
 *                     type: object
 *                     properties:
 *                       owner:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60d21b4667d0d8992e610c85"
 *                           name:
 *                             type: string
 *                             example: "Alice"
 *                           email:
 *                             type: string
 *                             example: "alice@example.com"
 *                       leads:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/client/shared-with-me', verifyToken, verifyRole(['client']), getLeadsSharedWithMe);

/**
 * @swagger
 * /api/leads/client/shared-by-client/{clientAccessId}:
 *   get:
 *     summary: Get all leads for a specific client (owner) if shared with the authenticated client
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientAccessId
 *         required: true
 *         schema:
 *           type: string
 *         description: The _id of the ClientAccess sharing relationship
 *     responses:
 *       200:
 *         description: Leads for the specified client (owner) if shared with the authenticated client
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
 *                     $ref: '#/components/schemas/Lead'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - You do not have access to this client's leads
 *       404:
 *         description: ClientAccess not found
 *       500:
 *         description: Server error
 */
router.get('/client/shared-by-client/:clientAccessId', verifyToken, verifyRole(['client']), GetLeadsSharedByClientValidation, validate, getLeadsSharedByClient);

/**
 * @swagger
 * /api/leads/client/shared-lead/{leadId}:
 *   put:
 *     summary: Update a shared lead (with permission)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lead to update
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
 *                 example: "+1987654321"
 *               source:
 *                 type: string
 *                 example: "Referral"
 *               status:
 *                 type: string
 *                 enum: [new, contacted, converted, lost]
 *                 example: "contacted"
 *               message:
 *                 type: string
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
 *                   $ref: '#/components/schemas/Lead'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - You do not have update permission for this lead
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.put('/client/shared-lead/:leadId', verifyToken, verifyRole(['client']), UpdateSharedLeadValidation, validate, updateSharedLead);

/**
 * @swagger
 * /api/leads/client/shared-lead/{leadId}:
 *   delete:
 *     summary: Delete a shared lead (with permission)
 *     tags: [Leads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: leadId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the lead to delete
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
 *         description: Forbidden - You do not have delete permission for this lead
 *       404:
 *         description: Lead not found
 *       500:
 *         description: Server error
 */
router.delete('/client/shared-lead/:leadId', verifyToken, verifyRole(['client']), DeleteSharedLeadValidation, validate, deleteSharedLead);

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
router.get('/admin/grouped', verifyToken, verifyRole(['admin']), getAllLeadsGroupedByClients);

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
router.get('/admin/clients/:clientId', verifyToken, verifyRole(['admin']), GetClientLeadsByIdValidation, validate, getClientLeadsById);

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
router.post("/client/webhook", checkApiKeyOrRateLimitByIP, apiKeyRateLimiter, CreateLeadValidation, validate, createLeadFromWebhook);

export default router;