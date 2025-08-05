import express from "express";
import {
  getSharedWithMe,
  getSharedByMe,
  updateSharingPermissions,
  removeSharingAccess,
  respondToSharingInvitation,
  inviteClient,
} from "../controllers/clientaccess.controller.js";
import {
  UpdateSharingPermissionsValidation,
  RemoveSharingAccessValidation,
  RespondToSharingInvitationValidation,
  InviteClientValidation,
} from "../middlewares/validation/clientAccessValidation.js";
import validate from "../middlewares/validate.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyRole.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ClientAccess
 *   description: Endpoints for managing client access sharing, permissions, and relationships.
 */

/**
 * @swagger
 * /api/client-access/invite:
 *   post:
 *     summary: Invite a client to share access (creates pending invitation)
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
 *                 description: Email of the client to invite
 *                 example: "client2@example.com"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [read, update, delete]
 *                 description: Permissions to grant to the invited client (optional, defaults to read)
 *                 example: ["read", "update"]
 *     responses:
 *       201:
 *         description: Client invitation sent successfully
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
 *                   example: "Client invitation sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Invitation ID
 *                     owner:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     invitedClient:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["read", "update"]
 *                     status:
 *                       type: string
 *                       enum: [pending, active, rejected]
 *                       example: "pending"
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.post(
  "/invite",
  verifyToken,
  verifyRole(["client"]),
  InviteClientValidation,
  validate,
  inviteClient
);

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
 *                   description: Number of shared accesses
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Access ID
 *                         example: "507f1f77bcf86cd799439011"
 *                       owner:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "507f1f77bcf86cd799439012"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "john@example.com"
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum: [read, update, delete]
 *                         example: ["read", "update"]
 *                       sharedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the access was shared
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       status:
 *                         type: string
 *                         enum: [pending, active]
 *                         description: Status of the shared access
 *                         example: "active"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.get(
  "/shared-with-me",
  verifyToken,
  verifyRole(["client"]),
  getSharedWithMe
);

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
 *                   description: Number of shared accesses
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Access ID
 *                         example: "507f1f77bcf86cd799439011"
 *                       sharedWith:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "507f1f77bcf86cd799439012"
 *                           name:
 *                             type: string
 *                             example: "Jane Smith"
 *                           email:
 *                             type: string
 *                             format: email
 *                             example: "jane@example.com"
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *                           enum: [read, update, delete]
 *                         example: ["read", "update"]
 *                       sharedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the access was shared
 *                         example: "2024-01-15T10:30:00.000Z"
 *                       status:
 *                         type: string
 *                         enum: [pending, active]
 *                         description: Status of the shared access
 *                         example: "pending"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       500:
 *         description: Server error
 */
router.get("/shared-by-me", verifyToken, verifyRole(["client"]), getSharedByMe);

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
router.put(
  "/update-permission/:accessId",
  verifyToken,
  verifyRole(["client"]),
  UpdateSharingPermissionsValidation,
  validate,
  updateSharingPermissions
);

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
router.delete(
  "/remove-sharing/:accessId",
  verifyToken,
  verifyRole(["client"]),
  RemoveSharingAccessValidation,
  validate,
  removeSharingAccess
);

/**
 * @swagger
 * /api/client-access/respond-invitation/{accessId}:
 *   put:
 *     summary: Accept or reject a sharing invitation
 *     tags: [ClientAccess]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accessId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the sharing access invitation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [accept, reject]
 *                 description: Whether to accept or reject the invitation
 *                 example: "accept"
 *     responses:
 *       200:
 *         description: Invitation responded to successfully
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
 *                   example: "Sharing invitation accepted successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Access ID (for accept) or removed access ID (for reject)
 *                     status:
 *                       type: string
 *                       enum: [active]
 *                       description: New status (only for accept)
 *                       example: "active"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the access was updated (only for accept)
 *                     removedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the access was removed (only for reject)
 *       400:
 *         description: Validation error or invalid action
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Client access required
 *       404:
 *         description: Invitation not found
 *       500:
 *         description: Server error
 */
router.put(
  "/respond-invitation/:accessId",
  verifyToken,
  verifyRole(["client"]),
  RespondToSharingInvitationValidation,
  validate,
  respondToSharingInvitation
);

export default router;
