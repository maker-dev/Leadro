import { body, param } from "express-validator";
import User from "../../models/User.js";
import ClientAccess from "../../models/ClientAccess.js";

const InviteClientValidation = [
  // Validate email of client to invite
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email of client to invite is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail() // Normalize email format
    .custom(async (email, { req }) => {
      try {
        // Fetch current user's email from DB
        const currentUser = await User.findById(req.user.userId);
        if (!currentUser) {
          throw new Error("Current user not found");
        }
        // Check if trying to invite self
        if (email.toLowerCase() === currentUser.email.toLowerCase()) {
          throw new Error("Cannot invite yourself");
        }

        // Check if target client exists and is verified
        const targetClient = await User.findOne({
          email: email,
          isEmailVerified: true,
          role: "client",
        });

        if (!targetClient) {
          throw new Error("Target client not found or not verified");
        }

        // Check if invitation already exists (pending or active)
        const existingInvitation = await ClientAccess.findOne({
          ownerId: req.user.userId,
          sharedWithId: targetClient._id,
          status: { $in: ["pending", "active"] },
        });

        if (existingInvitation) {
          throw new Error(
            "You have already invited this client or access is already shared"
          );
        }

        // Store target client in request for controller use
        req.targetClient = targetClient;
        return true;
      } catch (error) {
        throw error;
      }
    }),

  // Validate permissions array (optional since it has a default value)
  body("permissions")
    .optional()
    .isArray()
    .withMessage("Permissions must be an array")
    .custom((permissions) => {
      const allowedPermissions = ["read", "update", "delete"];

      // Check if all provided permissions are valid
      const isValid = permissions.every((permission) =>
        allowedPermissions.includes(permission)
      );

      if (!isValid) {
        throw new Error(
          "Invalid permissions. Allowed values: read, update, delete"
        );
      }

      // Check for duplicate permissions
      if (new Set(permissions).size !== permissions.length) {
        throw new Error("Duplicate permissions are not allowed");
      }

      return true;
    }),
];

const UpdateSharingPermissionsValidation = [
  // Validate accessId param
  param("accessId")
    .notEmpty()
    .withMessage("Access ID is required")
    .isMongoId()
    .withMessage("Invalid access ID format")
    .custom(async (accessId, { req }) => {
      // Ensure the sharing relationship exists and the current user is the owner
      const access = await ClientAccess.findOne({
        _id: accessId,
        ownerId: req.user.userId,
      });
      if (!access) {
        throw new Error("Not owner of this sharing or sharing not found.");
      }

      // Only allow updating permissions for active sharing relationships
      if (access.status !== "active") {
        throw new Error(
          "Can only update permissions for active sharing relationships."
        );
      }

      req.access = access;
      return true;
    }),

  // Validate permissions array
  body("permissions")
    .isArray({ min: 1 })
    .withMessage("Permissions must be a non-empty array")
    .custom((permissions) => {
      const allowedPermissions = ["read", "update", "delete"];
      // Check if all provided permissions are valid
      const isValid = permissions.every((permission) =>
        allowedPermissions.includes(permission)
      );
      if (!isValid) {
        throw new Error(
          "Invalid permissions. Allowed values: read, update, delete"
        );
      }
      // Check for duplicate permissions
      if (new Set(permissions).size !== permissions.length) {
        throw new Error("Duplicate permissions are not allowed");
      }
      return true;
    }),
];

const RemoveSharingAccessValidation = [
  param("accessId")
    .notEmpty()
    .withMessage("Access ID is required")
    .isMongoId()
    .withMessage("Invalid access ID format")
    .custom(async (accessId, { req }) => {
      // Ensure the sharing relationship exists and the current user is the owner
      const access = await ClientAccess.findOne({
        _id: accessId,
        ownerId: req.user.userId,
      });
      if (!access) {
        throw new Error("Not owner of this sharing or sharing not found.");
      }
      req.access = access;
      return true;
    }),
];

const RespondToSharingInvitationValidation = [
  // Validate accessId param
  param("accessId")
    .notEmpty()
    .withMessage("Access ID is required")
    .isMongoId()
    .withMessage("Invalid access ID format")
    .custom(async (accessId, { req }) => {
      // Find the sharing relationship where the current user is the sharedWith (invited client)
      const access = await ClientAccess.findOne({
        _id: accessId,
        sharedWithId: req.user.userId,
      });
      if (!access) {
        throw new Error(
          "Sharing invitation not found or you are not the invited client."
        );
      }

      // Only allow responding to pending invitations
      if (access.status !== "pending") {
        throw new Error("Can only respond to pending sharing invitations.");
      }

      req.access = access;
      return true;
    }),

  // Validate action
  body("action")
    .notEmpty()
    .withMessage("Action is required")
    .isIn(["accept", "reject"])
    .withMessage("Action must be either 'accept' or 'reject'"),
];

export {
  InviteClientValidation,
  UpdateSharingPermissionsValidation,
  RemoveSharingAccessValidation,
  RespondToSharingInvitationValidation,
};
