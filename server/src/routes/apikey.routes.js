import express from 'express';
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import { generateApiKey, toggleApiKeyStatus, regenerateApiKey } from '../controllers/apikey.controller.js';
import { generateApiKeyValidation, toggleApiKeyStatusValidation, regenerateApiKeyValidation } from '../middlewares/validation/ApiKeyValidation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: API key management endpoints
 */

/**
 * @swagger
 * /api/apikey/{clientId}:
 *   post:
 *     summary: Generate a new API key for a client
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expiresAt
 *             properties:
 *               expiresAt:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: API key generated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.post('/:clientId', verifyToken, verifyRole(['admin']), generateApiKeyValidation, validate, generateApiKey);

/**
 * @swagger
 * /api/apikey/{apiKeyId}:
 *   patch:
 *     summary: Toggle API key status (activate/revoke)
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the API key
 *     responses:
 *       200:
 *         description: API key status toggled successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: API key not found
 *       500:
 *         description: Server error
 */
router.patch('/:apiKeyId', verifyToken, verifyRole(['admin']), toggleApiKeyStatusValidation, validate, toggleApiKeyStatus);

/**
 * @swagger
 * /api/apikey/{apiKeyId}/regenerate:
 *   patch:
 *     summary: Regenerate an existing API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the API key
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expiresAt
 *             properties:
 *               expiresAt:
 *                 type: string
 *                 format: date
 *                 example: "2024-12-31"
 *     responses:
 *       200:
 *         description: API key regenerated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: API key not found
 *       500:
 *         description: Server error
 */
router.patch('/:apiKeyId/regenerate', verifyToken, verifyRole(['admin']), regenerateApiKeyValidation, validate, regenerateApiKey);

export default router;
