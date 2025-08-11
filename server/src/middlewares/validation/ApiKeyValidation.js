import { body, param, query } from "express-validator";
import ApiKey from "../../models/ApiKey.js";

const generateApiKeyValidation = [
  body("label")
    .trim()
    .notEmpty()
    .withMessage("Label is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Label must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage(
      "Label can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .custom(async (label, { req }) => {
      try {
        // Get client ID from authenticated user
        const clientId = req.user.userId;

        // Check if the client already has an API key with this label
        const existingApiKey = await ApiKey.findOne({
          clientId: clientId,
          label: label,
        });

        if (existingApiKey) {
          throw new Error(
            "An API key with this label already exists for this client"
          );
        }

        // Store client ID in request for controller use
        req.clientId = clientId;
        return true;
      } catch (error) {
        throw error;
      }
    }),
];

const updateApiKeyLabelValidation = [
  param("apiKeyId")
    .trim()
    .notEmpty()
    .withMessage("API Key ID is required")
    .custom(async (apiKeyId, { req }) => {
      try {
        const clientId = req.user.userId;

        // Find the API key and ensure it belongs to the authenticated client
        const apiKey = await ApiKey.findOne({
          _id: apiKeyId,
          clientId: clientId,
        });

        if (!apiKey) {
          throw new Error("API key not found or access denied");
        }

        req.apiKey = apiKey;
        return true;
      } catch (error) {
        if (error.name === "CastError") {
          throw new Error("Invalid API key ID format");
        }
        throw error;
      }
    }),
  body("label")
    .trim()
    .notEmpty()
    .withMessage("Label is required")
    .isLength({ min: 3, max: 20 })
    .withMessage("Label must be between 3 and 20 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage(
      "Label can only contain letters, numbers, spaces, hyphens, and underscores"
    )
    .custom(async (label, { req }) => {
      try {
        const clientId = req.user.userId;
        const apiKeyId = req.params.apiKeyId;

        // Check if the client already has another API key with this label
        const existingApiKey = await ApiKey.findOne({
          clientId: clientId,
          label: label,
          _id: { $ne: apiKeyId }, // Exclude the current API key being updated
        });

        if (existingApiKey) {
          throw new Error(
            "An API key with this label already exists for this client"
          );
        }

        return true;
      } catch (error) {
        throw error;
      }
    }),
];

const deleteApiKeyValidation = [
  param("apiKeyId")
    .trim()
    .notEmpty()
    .withMessage("API Key ID is required")
    .custom(async (apiKeyId, { req }) => {
      try {
        const clientId = req.user.userId;
        // Find the API key and ensure it belongs to the authenticated client
        const apiKey = await ApiKey.findOne({
          _id: apiKeyId,
          clientId: clientId,
        });
        if (!apiKey) {
          throw new Error("API key not found or access denied");
        }
        req.apiKey = apiKey;
        return true;
      } catch (error) {
        if (error.name === "CastError") {
          throw new Error("Invalid API key ID format");
        }
        throw error;
      }
    }),
];

const getAllClientsApiKeyStatsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer")
    .toInt(),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100")
    .toInt(),
  query("search")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Search term must be less than 100 characters"),
  query("status")
    .optional()
    .isIn(["active", "revoked"])
    .withMessage("Status must be either 'active' or 'revoked'"),
  query("totalusagecount_min")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total usage count minimum must be a non-negative integer")
    .toInt(),
  query("totalusagecount_max")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total usage count maximum must be a non-negative integer")
    .toInt(),
  query("totalkeysnumber_min")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total keys number minimum must be a non-negative integer")
    .toInt(),
  query("totalkeysnumber_max")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Total keys number maximum must be a non-negative integer")
    .toInt(),
  // Custom validation to ensure min <= max for ranges
  query().custom((query) => {
    if (
      query.totalusagecount_min !== undefined &&
      query.totalusagecount_max !== undefined
    ) {
      if (query.totalusagecount_min > query.totalusagecount_max) {
        throw new Error(
          "Total usage count minimum cannot be greater than maximum"
        );
      }
    }
    if (
      query.totalkeysnumber_min !== undefined &&
      query.totalkeysnumber_max !== undefined
    ) {
      if (query.totalkeysnumber_min > query.totalkeysnumber_max) {
        throw new Error(
          "Total keys number minimum cannot be greater than maximum"
        );
      }
    }
    return true;
  }),
];

const deleteApiKeyByAdminValidation = [
  param("clientId")
    .trim()
    .notEmpty()
    .withMessage("Client ID is required")
    .isMongoId()
    .withMessage("Invalid client ID format"),
  param("apiKeyId")
    .trim()
    .notEmpty()
    .withMessage("API Key ID is required")
    .isMongoId()
    .withMessage("Invalid API key ID format"),
];

const updateApiKeyRevokedStatusByAdminValidation = [
  param("clientId")
    .trim()
    .notEmpty()
    .withMessage("Client ID is required")
    .isMongoId()
    .withMessage("Invalid client ID format"),
  param("apiKeyId")
    .trim()
    .notEmpty()
    .withMessage("API Key ID is required")
    .isMongoId()
    .withMessage("Invalid API key ID format"),
  body("revoked")
    .isBoolean()
    .withMessage("Revoked status must be a boolean value (true/false)"),
];

export {
  generateApiKeyValidation,
  updateApiKeyLabelValidation,
  deleteApiKeyValidation,
  getAllClientsApiKeyStatsValidation,
  deleteApiKeyByAdminValidation,
  updateApiKeyRevokedStatusByAdminValidation,
};
