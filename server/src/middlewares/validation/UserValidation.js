import { body, query, param } from "express-validator";
import User from "../../models/User.js";
import bcrypt from "bcrypt";

// Validation rules for client registration
const ClientRegisterValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword")
    .trim()
    .notEmpty()
    .withMessage("Confirm Password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  body("role")
    .trim()
    .default("client")
    .custom((value) => {
      if (value !== "client") {
        throw new Error("Invalid role for registration");
      }
      return true;
    }),
];

// Validation rules for login
const LoginValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body().custom(async (_, { req }) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    if (!user.isEmailVerified) {
      throw new Error("Email not verified");
    }

    req.user = user;
    return true;
  }),
];

// Unified validation rules for any user profile
const ProfileValidation = [
  body().custom(async (_, { req }) => {
    if (!req.user || !req.user.userId) {
      throw new Error("Authentication required");
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    return true;
  }),
];

// Validation rules for getting all clients with pagination
const GetAllClientsWithPaginationValidation = [
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
];

const UpdateAdminClientProfileValidation = [
  param("userId")
    .trim()
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID")
    .custom(async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      return true;
    }),
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail()
    .custom(async (email, { req }) => {
      const userId = req.params.userId;
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser && existingUser._id.toString() !== userId) {
        throw new Error("Email is already in use");
      }
      return true;
    }),
];

// Validation rules for resending verification email
const ResendVerificationEmailValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail()
    .custom(async (email, { req }) => {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("No account found with this email");
      }

      // Check if email is already verified
      if (user.isEmailVerified) {
        throw new Error("Email is already verified");
      }

      req.user = user;
      // Add user to request for controller use
      return true;
    }),
];

// Validation rules for changing user name
const ChangeNameValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name must contain only letters")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),
  body().custom(async (_, { req }) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    return true;
  }),
];

export {
  ClientRegisterValidation,
  LoginValidation,
  ProfileValidation,
  ResendVerificationEmailValidation,
  ChangeNameValidation,
  GetAllClientsWithPaginationValidation,
  UpdateAdminClientProfileValidation,
};
