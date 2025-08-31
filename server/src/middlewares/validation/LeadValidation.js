import { body, param, query } from "express-validator";
import Lead from "../../models/Lead.js";
import LeadSourceValues from "../../data/LeadSourceOptions.js";
/* CLIENT API */

const CreateLeadValidation = [
  // Required fields
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  // Optional fields with validation if provided
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-'.]+$/)
    .withMessage(
      "Name can only contain letters, numbers, spaces, and basic punctuation"
    ),

  body("phone")
    .optional()
    .trim()
    .matches(/^\+[1-9]\d{0,3}[-\s.]?\d{2,14}$/)
    .withMessage("Please provide a valid phone number"),

  body("source")
    .optional()
    .trim()
    .isIn(LeadSourceValues)
    .withMessage("Source is invalid"),

  body("status")
    .trim()
    .isIn(["new", "contacted", "converted", "lost"])
    .withMessage("status must be one of: new, contacted, converted, lost"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),

  // Validate any extra fields
  body().custom((data) => {
    const allowedFields = [
      "email",
      "name",
      "phone",
      "source",
      "status",
      "message",
    ];
    const extraFields = Object.keys(data).filter(
      (key) => !allowedFields.includes(key)
    );

    // Validate each extra field
    for (const field of extraFields) {
      const value = data[field];

      // Check if value is not null or undefined
      if (value === null || value === undefined) {
        throw new Error(`Extra field '${field}' cannot be null or undefined`);
      }

      // Check if value is not an object or array (to keep extra fields simple)
      if (typeof value === "object") {
        throw new Error(
          `Extra field '${field}' must be a simple value, not an object or array`
        );
      }

      // Check field name format
      if (!/^[a-zA-Z0-9_]+$/.test(field)) {
        throw new Error(
          `Extra field name '${field}' can only contain letters, numbers, and underscores`
        );
      }

      // Check value length if it's a string
      if (typeof value === "string" && value.length > 500) {
        throw new Error(
          `Extra field '${field}' value cannot exceed 500 characters`
        );
      }
    }

    return true;
  }),
];

const GetClientLeadsValidation = [
  // Validate pagination parameters
  query("page")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .trim()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  // Validate search parameter
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  // Validate status parameter
  query("status")
    .optional()
    .trim()
    .isIn(["all", "new", "contacted", "converted", "lost"])
    .withMessage("Status must be one of: all, new, contacted, converted, lost"),

  // Validate source parameter
  query("source")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Source must be between 1 and 50 characters"),

  // Validate owner parameter
  query("owner")
    .optional()
    .trim()
    .isIn(["me", "anyone"])
    .withMessage("Owner must be either 'me' or 'anyone'"),

  // Validate date parameters
  query("startDate")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .custom((endDate, { req }) => {
      if (
        endDate &&
        req.query.startDate &&
        new Date(endDate) < new Date(req.query.startDate)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

const UpdateLeadBodyValidation = [
  // Optional fields with validation if provided
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-'.]+$/)
    .withMessage(
      "Name can only contain letters, numbers, spaces, and basic punctuation"
    ),
  body("phone")
    .optional()
    .trim()
    .matches(/^\+[1-9]\d{0,3}[-\s.]?\d{2,14}$/)
    .withMessage("Please provide a valid phone number"),
  body("source")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Source must be between 2 and 50 characters"),
  body("status")
    .optional()
    .trim()
    .isIn(["new", "contacted", "converted", "lost"])
    .withMessage("Status must be one of: new, contacted, converted, lost"),
  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),
  // Validate any extra fields
  body().custom((data) => {
    const allowedFields = [
      "email",
      "name",
      "phone",
      "source",
      "status",
      "message",
    ];
    const extraFields = Object.keys(data).filter(
      (key) => !allowedFields.includes(key)
    );
    for (const field of extraFields) {
      const value = data[field];
      if (value === null || value === undefined) {
        throw new Error(`Extra field '${field}' cannot be null or undefined`);
      }
      if (typeof value === "object") {
        throw new Error(
          `Extra field '${field}' must be a simple value, not an object or array`
        );
      }
      if (!/^[a-zA-Z0-9_]+$/.test(field)) {
        throw new Error(
          `Extra field name '${field}' can only contain letters, numbers, and underscores`
        );
      }
      if (typeof value === "string" && value.length > 500) {
        throw new Error(
          `Extra field '${field}' value cannot exceed 500 characters`
        );
      }
    }
    return true;
  }),
];

const UpdateLeadValidation = [
  // Validate ID parameter
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Lead ID is required")
    .isMongoId()
    .withMessage("Invalid lead ID format"),
  ...UpdateLeadBodyValidation,
];

const DeleteLeadValidation = [
  // Validate ID parameter
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Lead ID is required")
    .isMongoId()
    .withMessage("Invalid lead ID format"),
];

/* ADMIN API */

const GetAllClientsLeadsValidation = [
  // Validate pagination parameters
  query("page")
    .optional()
    .trim()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .trim()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  // Validate search parameter
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search term must be between 1 and 100 characters"),

  // Validate status parameter
  query("status")
    .optional()
    .trim()
    .isIn(["all", "new", "contacted", "converted", "lost"])
    .withMessage("Status must be one of: all, new, contacted, converted, lost"),

  // Validate source parameter
  query("source")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Source must be between 1 and 50 characters"),

  // Validate date parameters
  query("startDate")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  query("endDate")
    .optional()
    .trim()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date")
    .custom((endDate, { req }) => {
      if (
        endDate &&
        req.query.startDate &&
        new Date(endDate) < new Date(req.query.startDate)
      ) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
];

const CreateLeadForClientValidation = [
  // Required fields
  body("clientEmail")
    .trim()
    .notEmpty()
    .withMessage("Client email is required")
    .isEmail()
    .withMessage("Please provide a valid client email")
    .normalizeEmail(),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  // Optional fields with validation if provided
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9\s\-'.]+$/)
    .withMessage(
      "Name can only contain letters, numbers, spaces, and basic punctuation"
    ),

  body("phone")
    .optional()
    .trim()
    .matches(/^\+[1-9]\d{0,3}[-\s.]?\d{2,14}$/)
    .withMessage("Please provide a valid phone number"),

  body("source")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Source must be between 2 and 50 characters"),

  body("status")
    .trim()
    .isIn(["new", "contacted", "converted", "lost"])
    .withMessage("Status must be one of: new, contacted, converted, lost"),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),

  // Validate any extra fields
  body().custom((data) => {
    const allowedFields = [
      "clientEmail",
      "email",
      "name",
      "phone",
      "source",
      "status",
      "message",
    ];
    const extraFields = Object.keys(data).filter(
      (key) => !allowedFields.includes(key)
    );

    // Validate each extra field
    for (const field of extraFields) {
      const value = data[field];

      // Check if value is not null or undefined
      if (value === null || value === undefined) {
        throw new Error(`Extra field '${field}' cannot be null or undefined`);
      }

      // Check if value is not an object or array (to keep extra fields simple)
      if (typeof value === "object") {
        throw new Error(
          `Extra field '${field}' must be a simple value, not an object or array`
        );
      }

      // Check field name format
      if (!/^[a-zA-Z0-9_]+$/.test(field)) {
        throw new Error(
          `Extra field name '${field}' can only contain letters, numbers, and underscores`
        );
      }

      // Check value length if it's a string
      if (typeof value === "string" && value.length > 500) {
        throw new Error(
          `Extra field '${field}' value cannot exceed 500 characters`
        );
      }
    }

    return true;
  }),
];

const DeleteAdminLeadValidation = [
  // Validate ID parameter
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Lead ID is required")
    .isMongoId()
    .withMessage("Invalid lead ID format")
    .custom(async (id, { req }) => {
      try {
        // Find lead without ownership restriction (admin can delete any lead)
        const lead = await Lead.findById(id);

        if (!lead) {
          throw new Error("Lead not found");
        }

        // Store lead in request for controller use
        req.lead = lead;
        return true;
      } catch (error) {
        if (error.name === "CastError") {
          throw new Error("Invalid lead ID format");
        }
        throw error;
      }
    }),
];

const UpdateAdminLeadValidation = [
  // Validate ID parameter
  param("id")
    .trim()
    .notEmpty()
    .withMessage("Lead ID is required")
    .isMongoId()
    .withMessage("Invalid lead ID format")
    .custom(async (id, { req }) => {
      try {
        // Find lead without ownership restriction (admin can update any lead)
        const lead = await Lead.findById(id);

        if (!lead) {
          throw new Error("Lead not found");
        }

        // Store lead in request for controller use
        req.lead = lead;
        return true;
      } catch (error) {
        if (error.name === "CastError") {
          throw new Error("Invalid lead ID format");
        }
        throw error;
      }
    }),
  ...UpdateLeadBodyValidation,
];

export {
  CreateLeadValidation,
  UpdateLeadValidation,
  UpdateAdminLeadValidation,
  DeleteLeadValidation,
  GetClientLeadsValidation,
  GetAllClientsLeadsValidation,
  CreateLeadForClientValidation,
  DeleteAdminLeadValidation,
};
