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
 *                 description: Expiration date for the API key (ISO 8601 format)
 *                 example: "2024-12-31"
 *     responses:
 *       201:
 *         description: API key generated successfully
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
 *                   example: "API key generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: API key ID
 *                       example: "60d21b4667d0d8992e610c85"
 *                     clientId:
 *                       type: string
 *                       description: ID of the client who owns this API key
 *                       example: "60d21b4667d0d8992e610c85"
 *                     key:
 *                       type: string
 *                       description: The generated API key
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key expires
 *                       example: "2024-12-31T23:59:59.999Z"
 *                     revoked:
 *                       type: boolean
 *                       description: Whether the API key is revoked
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was last updated
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
 *                   example: ["Expiration date is required"]
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
 *                   example: "API key revoked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: API key ID
 *                       example: "60d21b4667d0d8992e610c85"
 *                     clientId:
 *                       type: string
 *                       description: ID of the client who owns this API key
 *                       example: "60d21b4667d0d8992e610c85"
 *                     key:
 *                       type: string
 *                       description: The API key
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key expires
 *                       example: "2024-12-31T23:59:59.999Z"
 *                     revoked:
 *                       type: boolean
 *                       description: Whether the API key is revoked
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was last updated
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
 *                   example: ["Invalid API key ID format"]
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
 *                 description: New expiration date for the API key (ISO 8601 format)
 *                 example: "2024-12-31"
 *     responses:
 *       200:
 *         description: API key regenerated successfully
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
 *                   example: "API key regenerated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: API key ID
 *                       example: "60d21b4667d0d8992e610c85"
 *                     clientId:
 *                       type: string
 *                       description: ID of the client who owns this API key
 *                       example: "60d21b4667d0d8992e610c85"
 *                     key:
 *                       type: string
 *                       description: The newly generated API key
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     expiresAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key expires
 *                       example: "2024-12-31T23:59:59.999Z"
 *                     revoked:
 *                       type: boolean
 *                       description: Whether the API key is revoked
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was last updated
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
 *                   example: ["Expiration date is required"]
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
