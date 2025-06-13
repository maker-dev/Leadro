import express from 'express';
import { createLead, getClientLeads, updateLead, deleteLead } from '../controllers/lead.controller.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import validate from '../middlewares/validate.js';
import { CreateLeadValidation, UpdateLeadValidation, DeleteLeadValidation } from '../middlewares/validation/LeadValidation.js';

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

export default router;