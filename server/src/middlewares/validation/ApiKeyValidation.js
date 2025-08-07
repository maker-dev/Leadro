import { body, param } from "express-validator";
import ApiKey from "../../models/ApiKey.js";

const generateApiKeyValidation = [
  body("label")
    .trim()
    .notEmpty()
    .withMessage("Label is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Label must be between 3 and 100 characters")
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
    .isLength({ min: 3, max: 100 })
    .withMessage("Label must be between 3 and 100 characters")
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

export {
  generateApiKeyValidation,
  updateApiKeyLabelValidation,
  deleteApiKeyValidation,
};
