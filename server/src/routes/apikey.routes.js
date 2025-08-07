import express from "express";
import validate from "../middlewares/validate.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyRole.js";
import {
  generateApiKey,
  updateApiKeyLabel,
  deleteApiKey,
  getAllApiKeysForCurrentClient,
  getApiKeySummaryForCurrentClient,
  getAllClientsApiKeyStats,
} from "../controllers/apikey.controller.js";
import {
  generateApiKeyValidation,
  updateApiKeyLabelValidation,
  deleteApiKeyValidation,
  getAllClientsApiKeyStatsValidation,
} from "../middlewares/validation/ApiKeyValidation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: API Keys
 *   description: API key management endpoints
 */

/**
 * @swagger
 * /api/apikey/generate-key:
 *   post:
 *     summary: Generate a new API key for the authenticated client
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Generate a new API key for the authenticated client. Multiple API keys can be created per client with different labels. The API key is returned immediately for use.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: A descriptive label for the API key (letters, numbers, spaces, hyphens, and underscores only)
 *                 example: "Production API Key"
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
 *                     label:
 *                       type: string
 *                       description: The label given to this API key
 *                       example: "Production API Key"
 *                     key:
 *                       type: string
 *                       description: The generated API key (returned only once)
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     revoked:
 *                       type: boolean
 *                       description: Whether the API key is revoked
 *                       example: false
 *                     usageCount:
 *                       type: number
 *                       description: Number of times this API key has been used
 *                       example: 0
 *                     lastUsedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was last used (null if never used)
 *                       nullable: true
 *                       example: null
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was created
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was last updated
 *                       example: "2024-01-01T00:00:00.000Z"
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
 *                   example: ["Label is required", "Label must be between 3 and 100 characters"]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Client role required
 *       500:
 *         description: Server error
 */
router.post(
  "/generate-key",
  verifyToken,
  verifyRole(["client"]),
  generateApiKeyValidation,
  validate,
  generateApiKey
);

/**
 * @swagger
 * /api/apikey/{apiKeyId}/label:
 *   patch:
 *     summary: Update the label of an API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Update the label of an API key owned by the authenticated client. The label must be unique among the client's API keys.
 *     parameters:
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the API key to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - label
 *             properties:
 *               label:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 100
 *                 description: New label for the API key (letters, numbers, spaces, hyphens, and underscores only)
 *                 example: "Updated Production Key"
 *     responses:
 *       200:
 *         description: API key label updated successfully
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
 *                   example: "API key label updated successfully"
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
 *                     label:
 *                       type: string
 *                       description: The updated label for this API key
 *                       example: "Updated Production Key"
 *                     revoked:
 *                       type: boolean
 *                       description: Whether the API key is revoked
 *                       example: false
 *                     usageCount:
 *                       type: number
 *                       description: Number of times this API key has been used
 *                       example: 5
 *                     lastUsedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was last used
 *                       example: "2024-01-15T10:30:00.000Z"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was created
 *                       example: "2024-01-01T00:00:00.000Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the API key was last updated
 *                       example: "2024-01-15T11:00:00.000Z"
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
 *                   example: ["Label is required", "An API key with this label already exists for this client"]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Client role required
 *       404:
 *         description: API key not found or access denied
 *       500:
 *         description: Server error
 */
router.patch(
  "/:apiKeyId/label",
  verifyToken,
  verifyRole(["client"]),
  updateApiKeyLabelValidation,
  validate,
  updateApiKeyLabel
);

/**
 * @swagger
 * /api/apikey/{apiKeyId}:
 *   delete:
 *     summary: Delete an API key
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Delete an API key owned by the authenticated client. This action cannot be undone.
 *     parameters:
 *       - in: path
 *         name: apiKeyId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the API key to delete
 *     responses:
 *       200:
 *         description: API key deleted successfully
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
 *                   example: "API key deleted successfully"
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
 *                   example: ["API key not found or access denied"]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Client role required
 *       404:
 *         description: API key not found or access denied
 *       500:
 *         description: Server error
 */
router.delete(
  "/:apiKeyId",
  verifyToken,
  verifyRole(["client"]),
  deleteApiKeyValidation,
  validate,
  deleteApiKey
);

/**
 * @swagger
 * /api/apikey/client:
 *   get:
 *     summary: Get all API keys for the authenticated client
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve all API keys owned by the authenticated client user.
 *     responses:
 *       200:
 *         description: API keys retrieved successfully
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
 *                   example: "API keys retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: API key ID
 *                         example: "60d21b4667d0d8992e610c85"
 *                       clientId:
 *                         type: string
 *                         description: ID of the client who owns this API key
 *                         example: "60d21b4667d0d8992e610c85"
 *                       label:
 *                         type: string
 *                         description: The label for this API key
 *                         example: "Production API Key"
 *                       revoked:
 *                         type: boolean
 *                         description: Whether the API key is revoked
 *                         example: false
 *                       usageCount:
 *                         type: number
 *                         description: Number of times this API key has been used
 *                         example: 0
 *                       lastUsedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the API key was last used (null if never used)
 *                         nullable: true
 *                         example: null
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the API key was created
 *                         example: "2024-01-01T00:00:00.000Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the API key was last updated
 *                         example: "2024-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Client role required
 *       500:
 *         description: Server error
 */
router.get(
  "/client",
  verifyToken,
  verifyRole(["client"]),
  getAllApiKeysForCurrentClient
);

/**
 * @swagger
 * /api/apikey/client/summary:
 *   get:
 *     summary: Get API key summary for the authenticated client
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Returns statistics about the authenticated client's API keys.
 *     responses:
 *       200:
 *         description: API key summary retrieved successfully
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
 *                   example: "API key summary retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalApiKeys:
 *                       type: number
 *                       description: Total number of API keys
 *                       example: 5
 *                     activeKeys:
 *                       type: number
 *                       description: Number of active (not revoked) API keys
 *                       example: 3
 *                     revokedKeys:
 *                       type: number
 *                       description: Number of revoked API keys
 *                       example: 2
 *                     totalUsage:
 *                       type: number
 *                       description: Total usage count across all API keys
 *                       example: 42
 *                     lastKeyCreated:
 *                       type: string
 *                       format: date-time
 *                       nullable: true
 *                       description: Date/time the most recent API key was created (null if none)
 *                       example: "2024-01-20T12:34:56.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Client role required
 *       500:
 *         description: Server error
 */
router.get(
  "/client/summary",
  verifyToken,
  verifyRole(["client"]),
  getApiKeySummaryForCurrentClient
);

/**
 * @swagger
 * /api/apikey/admin/clients:
 *   get:
 *     summary: Get all clients with their API key statistics (Admin only)
 *     tags: [API Keys]
 *     security:
 *       - bearerAuth: []
 *     description: Retrieve statistics about all clients' API keys with filtering and pagination. This endpoint is restricted to admin users only.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 8
 *         description: Number of items per page
 *         example: 8
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Search term to filter by client name or email (case-insensitive)
 *         example: "john"
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, revoked]
 *         description: Filter by API key status
 *         example: "active"
 *       - in: query
 *         name: totalusagecount_min
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum total usage count filter
 *         example: 100
 *       - in: query
 *         name: totalusagecount_max
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum total usage count filter
 *         example: 1000
 *       - in: query
 *         name: totalkeysnumber_min
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Minimum total API keys number filter
 *         example: 2
 *       - in: query
 *         name: totalkeysnumber_max
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Maximum total API keys number filter
 *         example: 10
 *     responses:
 *       200:
 *         description: Client API key statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       clientName:
 *                         type: string
 *                         description: Name of the client
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         format: email
 *                         description: Email address of the client
 *                         example: "john.doe@example.com"
 *                       totalApiKeys:
 *                         type: integer
 *                         description: Total number of API keys owned by the client
 *                         example: 3
 *                       activeKeys:
 *                         type: integer
 *                         description: Number of active (not revoked) API keys
 *                         example: 2
 *                       revokedKeys:
 *                         type: integer
 *                         description: Number of revoked API keys
 *                         example: 1
 *                       totalUsageCount:
 *                         type: integer
 *                         description: Total usage count across all API keys
 *                         example: 1250
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                       description: Current page number
 *                       example: 1
 *                     totalPages:
 *                       type: integer
 *                       description: Total number of pages
 *                       example: 3
 *                     totalItems:
 *                       type: integer
 *                       description: Total number of items
 *                       example: 25
 *                     itemsPerPage:
 *                       type: integer
 *                       description: Number of items per page
 *                       example: 8
 *                     hasNextPage:
 *                       type: boolean
 *                       description: Whether there is a next page
 *                       example: true
 *                     hasPrevPage:
 *                       type: boolean
 *                       description: Whether there is a previous page
 *                       example: false
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
 *                   example: ["Page must be a positive integer", "Total usage count minimum cannot be greater than maximum"]
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Admin role required
 *       500:
 *         description: Server error
 */
router.get(
  "/admin/clients",
  verifyToken,
  verifyRole(["admin"]),
  getAllClientsApiKeyStatsValidation,
  validate,
  getAllClientsApiKeyStats
);

export default router;
