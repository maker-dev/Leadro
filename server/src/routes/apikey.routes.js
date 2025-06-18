import express from 'express';
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import { generateApiKey, toggleApiKeyStatus, regenerateApiKey, getClientApiKey, getAllApiKeysWithClients, getApiKeyByClientId } from '../controllers/apikey.controller.js';
import { generateApiKeyValidation, toggleApiKeyStatusValidation, regenerateApiKeyValidation, getClientApiKeyValidation, getApiKeyByClientIdValidation } from '../middlewares/validation/ApiKeyValidation.js';

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

/**
 * @swagger
 * /api/apikey/client:
 *   get:
 *     summary: Get the current user's API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve the active API key for the authenticated client user. Returns the API key details if found, or null if no active key exists.
 *     responses:
 *       200:
 *         description: API key retrieved successfully
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
 *                   example: "API key retrieved successfully"
 *                 data:
 *                   oneOf:
 *                     - type: object
 *                       properties:
 *                         key:
 *                           type: string
 *                           description: The API key for making authenticated requests
 *                           example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
 *                         expiresAt:
 *                           type: string
 *                           format: date-time
 *                           description: When the API key expires
 *                           example: "2024-12-31T23:59:59.999Z"
 *                         revoked:
 *                           type: boolean
 *                           description: Whether the API key is revoked
 *                           example: false
 *                     - type: null
 *                       description: No active API key found
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
 *                   example: "No active API key found for this user"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
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
 *                   example: "Authorization token is required"
 *       403:
 *         description: Forbidden - Client role required
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
 *                   example: "Access denied. Client role required."
 *       500:
 *         description: Server error
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
 *                   example: "Failed to retrieve API key"
 */
router.get('/client', verifyToken, verifyRole(['client']), getClientApiKeyValidation, validate, getClientApiKey);

/**
 * @swagger
 * /api/apikey/admin/clients:
 *   get:
 *     summary: Get all verified clients with their API keys (Admin only)
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all verified clients and their API key information. Returns clients with their API keys if they have them, or null if they don't.
 *     responses:
 *       200:
 *         description: Clients and API keys retrieved successfully
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
 *                   example: "Clients and API keys retrieved successfully"
 *                 data:
 *                   type: array
 *                   description: Array of clients with their API key information
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
 *                       clientCreatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the client was created
 *                         example: "2024-01-01T00:00:00.000Z"
 *                       hasApiKey:
 *                         type: boolean
 *                         description: Whether the client has an API key
 *                         example: true
 *                       apiKey:
 *                         oneOf:
 *                           - type: object
 *                             description: API key information if client has one
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 description: API key ID
 *                                 example: "60d21b4667d0d8992e610c85"
 *                               key:
 *                                 type: string
 *                                 description: The actual API key
 *                                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                               revoked:
 *                                 type: boolean
 *                                 description: Whether the API key is revoked
 *                                 example: false
 *                               expiresAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: When the API key expires
 *                                 example: "2024-12-31T23:59:59.999Z"
 *                               createdAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: When the API key was created
 *                               updatedAt:
 *                                 type: string
 *                                 format: date-time
 *                                 description: When the API key was last updated
 *                               isExpired:
 *                                 type: boolean
 *                                 description: Whether the API key has expired
 *                                 example: false
 *                               isActive:
 *                                 type: boolean
 *                                 description: Whether the API key is active (not revoked and not expired)
 *                                 example: true
 *                           - type: null
 *                             description: No API key found for this client
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
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
 *                   example: "Authorization token is required"
 *       403:
 *         description: Forbidden - Admin access required
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
 *                   example: "Access denied. Admin role required."
 *       500:
 *         description: Server error
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
 *                   example: "Failed to retrieve clients and API keys"
 */
router.get('/admin/clients', verifyToken, verifyRole(['admin']), getAllApiKeysWithClients);

/**
 * @swagger
 * /api/apikey/admin/clients/{clientId}:
 *   get:
 *     summary: Get API key for a specific client (Admin only)
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
 *     description: Retrieve API key information for a specific verified client. Returns the client's API key if they have one, or null if they don't.
 *     responses:
 *       200:
 *         description: Client and API key retrieved successfully
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
 *                   example: "API key retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Client ID
 *                       example: "60d21b4667d0d8992e610c85"
 *                     clientName:
 *                       type: string
 *                       description: Name of the client
 *                       example: "John Doe"
 *                     clientEmail:
 *                       type: string
 *                       description: Email of the client
 *                       example: "john@example.com"
 *                     clientCreatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the client was created
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     hasApiKey:
 *                       type: boolean
 *                       description: Whether the client has an API key
 *                       example: true
 *                     apiKey:
 *                       oneOf:
 *                         - type: object
 *                           description: API key information if client has one
 *                           properties:
 *                             _id:
 *                               type: string
 *                               description: API key ID
 *                               example: "60d21b4667d0d8992e610c85"
 *                             key:
 *                               type: string
 *                               description: The actual API key
 *                               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                             revoked:
 *                               type: boolean
 *                               description: Whether the API key is revoked
 *                               example: false
 *                             expiresAt:
 *                               type: string
 *                               format: date-time
 *                               description: When the API key expires
 *                               example: "2024-12-31T23:59:59.999Z"
 *                             createdAt:
 *                               type: string
 *                               format: date-time
 *                               description: When the API key was created
 *                             updatedAt:
 *                               type: string
 *                               format: date-time
 *                               description: When the API key was last updated
 *                             isExpired:
 *                               type: boolean
 *                               description: Whether the API key has expired
 *                               example: false
 *                             isActive:
 *                               type: boolean
 *                               description: Whether the API key is active (not revoked and not expired)
 *                               example: true
 *                         - type: null
 *                           description: No API key found for this client
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
 *                   example: ["Client not found or not verified"]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
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
 *                   example: "Authorization token is required"
 *       403:
 *         description: Forbidden - Admin access required
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
 *                   example: "Access denied. Admin role required."
 *       500:
 *         description: Server error
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
 *                   example: "Failed to retrieve API key"
 */
router.get('/admin/clients/:clientId', verifyToken, verifyRole(['admin']), getApiKeyByClientIdValidation, validate, getApiKeyByClientId);

export default router;