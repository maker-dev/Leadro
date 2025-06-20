import express from 'express';
import { shareAccess, getSharedWithMe, getSharedByMe, updateSharingPermissions, removeSharingAccess, getSharingDetails } from '../controllers/clientaccess.controller.js';
import { ShareAccessValidation, UpdateSharingPermissionsValidation, RemoveSharingAccessValidation, GetSharingDetailsValidation } from '../middlewares/validation/clientAccessValidation.js';
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ClientAccess
 *   description: Endpoints for managing client access sharing, permissions, and relationships.
 */

/**
 * @swagger
 * /api/client-access/share:
 *   post:
 *     summary: Share access with another client
 *     tags: [ClientAccess]
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
 *                 example: "client2@example.com"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [read, update, delete]
 *                 example: ["read", "update"]
 *     responses:
 *       201:
 *         description: Access shared successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.post('/share', verifyToken, verifyRole(['client']), ShareAccessValidation, validate, shareAccess);

/**
 * @swagger
 * /api/client-access/shared-with-me:
 *   get:
 *     summary: Get all accesses shared with the authenticated client
 *     tags: [ClientAccess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accesses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.get('/shared-with-me', verifyToken, verifyRole(['client']), getSharedWithMe);

/**
 * @swagger
 * /api/client-access/shared-by-me:
 *   get:
 *     summary: Get all accesses shared by the authenticated client
 *     tags: [ClientAccess]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accesses retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.get('/shared-by-me', verifyToken, verifyRole(['client']), getSharedByMe);

/**
 * @swagger
 * /api/client-access/update-permission/{accessId}:
 *   put:
 *     summary: Update sharing permissions for a specific access
 *     tags: [ClientAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accessId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sharing access
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissions
 *             properties:
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [read, update, delete]
 *                 example: ["read", "update"]
 *     responses:
 *       200:
 *         description: Permissions updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       404:
 *         description: Sharing not found
 *       500:
 *         description: Server error
 */
router.put('/update-permission/:accessId', verifyToken, verifyRole(['client']), UpdateSharingPermissionsValidation, validate, updateSharingPermissions);

/**
 * @swagger
 * /api/client-access/remove-sharing/{accessId}:
 *   delete:
 *     summary: Remove a specific sharing access
 *     tags: [ClientAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accessId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sharing access
 *     responses:
 *       200:
 *         description: Sharing removed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not owner of this sharing
 *       404:
 *         description: Sharing not found
 *       500:
 *         description: Server error
 */
router.delete('/remove-sharing/:accessId', verifyToken, verifyRole(['client']), RemoveSharingAccessValidation, validate, removeSharingAccess);

/**
 * @swagger
 * /api/client-access/sharing-details/{accessId}:
 *   get:
 *     summary: Get details of a specific sharing relationship
 *     tags: [ClientAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accessId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sharing access
 *     responses:
 *       200:
 *         description: Sharing details retrieved successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not involved in this sharing
 *       404:
 *         description: Sharing not found
 *       500:
 *         description: Server error
 */
router.get('/sharing-details/:accessId', verifyToken, verifyRole(['client']), GetSharingDetailsValidation, validate, getSharingDetails);

export default router;