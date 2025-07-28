import express from "express";
import validate from "../middlewares/validate.js";
import verifyToken from "../middlewares/verifyToken.js";
import verifyRole from "../middlewares/verifyRole.js";
import {
  clientRegister,
  getProfile,
  getAllClients,
  clientVerifyEmail,
  resendVerificationEmail,
  refreshToken,
  login,
  logout,
  changeName,
  deleteAccount,
} from "../controllers/user.controller.js";
import {
  ClientRegisterValidation,
  ProfileValidation,
  ResendVerificationEmailValidation,
  LoginValidation,
  ChangeNameValidation,
} from "../middlewares/validation/UserValidation.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints
 */

/**
 * @swagger
 * /api/users/client/register:
 *   post:
 *     summary: Register a new client
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 pattern: '^[A-Za-z\\s]+$'
 *                 description: Full name (letters and spaces only)
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address for the account
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]'
 *                 description: Password (must contain at least one uppercase letter, one lowercase letter, and one number)
 *                 example: "Password123"
 *               confirmPassword:
 *                 type: string
 *                 description: Password confirmation (must match password)
 *                 example: "Password123"
 *     responses:
 *       201:
 *         description: Client registered successfully
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
 *                   example: "Client registered successfully. Please check your email for verification."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       description: Full name of the user
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       description: Email address of the user
 *                       example: "john@example.com"
 *                     role:
 *                       type: string
 *                       description: User role
 *                       example: "client"
 *                     isEmailVerified:
 *                       type: boolean
 *                       description: Whether the email has been verified
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the account was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the account was last updated
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
 *                   example: ["Invalid email format"]
 *       500:
 *         description: Server error
 */
router.post(
  "/client/register",
  ClientRegisterValidation,
  validate,
  clientRegister
);

/**
 * @swagger
 * /api/users/client/verify-email:
 *   get:
 *     summary: Verify client email
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Email verification token received via email
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                   example: "Email verified successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "60d21b4667d0d8992e610c85"
 *                     isEmailVerified:
 *                       type: boolean
 *                       description: Whether the email has been verified
 *                       example: true
 *       401:
 *         description: Token expired
 *       500:
 *         description: Server error
 */
router.get("/client/verify-email", clientVerifyEmail);

/**
 * @swagger
 * /api/users/client/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Users]
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
 *                 description: Email address of the unverified account
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
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
 *                   example: "Verification email sent successfully"
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
 *                   example: ["Invalid email format"]
 *       500:
 *         description: Server error
 */
router.post(
  "/client/resend-verification",
  ResendVerificationEmailValidation,
  validate,
  resendVerificationEmail
);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in a user (admin or client)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
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
 *                   example: "Login successful"
 *                 token:
 *                   type: string
 *                   description: Access token (JWT)
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       example: "john@example.com"
 *                     role:
 *                       type: string
 *                       example: "admin"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Invalid email or password
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
 *                   example: "Invalid credentials"
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
 *                   example: "Internal server error"
 */
router.post("/login", LoginValidation, validate, login);

/**
 * @swagger
 * /api/users/refresh-token:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Users]
 *     description: Obtains a new JWT access token by providing a valid refresh token. The refresh token should be sent as an `httpOnly` cookie named 'refreshToken'.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully.
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
 *                   example: "Token refreshed successfully"
 *                 token:
 *                   type: string
 *                   description: A new JWT access token.
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Unauthorized. Refresh token is missing.
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
 *                   example: "Refresh token not found. Please log in."
 *       403:
 *         description: Forbidden. The refresh token is invalid or expired.
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
 *                   example: "Invalid or expired refresh token. Please log in again."
 *       500:
 *         description: Internal server error.
 */
router.post("/refresh-token", refreshToken);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: "Logout successful"
 *       500:
 *         description: Server error
 */
router.post("/logout", verifyToken, logout);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User ID
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       description: Full name of the user
 *                       example: "John Doe"
 *                     email:
 *                       type: string
 *                       description: Email address of the user
 *                       example: "john@example.com"
 *                     role:
 *                       type: string
 *                       description: User role
 *                       example: "client"
 *                     isEmailVerified:
 *                       type: boolean
 *                       description: Whether the email has been verified
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the account was created
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: When the account was last updated
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/profile", verifyToken, ProfileValidation, validate, getProfile);

/**
 * @swagger
 * /api/users/admin/clients:
 *   get:
 *     summary: Get all clients (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clients retrieved successfully
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
 *                   description: Array of client users
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: User ID
 *                         example: "60d21b4667d0d8992e610c85"
 *                       name:
 *                         type: string
 *                         description: Full name of the client
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         description: Email address of the client
 *                         example: "john@example.com"
 *                       role:
 *                         type: string
 *                         description: User role
 *                         example: "client"
 *                       isEmailVerified:
 *                         type: boolean
 *                         description: Whether the email has been verified
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the account was created
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: When the account was last updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get("/admin/clients", verifyToken, verifyRole(["admin"]), getAllClients);

/**
 * @swagger
 * /api/users/change-name:
 *   patch:
 *     summary: Change the authenticated user's name
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 50
 *                 pattern: '^[A-Za-z\\s]+$'
 *                 description: New full name (letters and spaces only)
 *                 example: "Jane Smith"
 *     responses:
 *       200:
 *         description: Name updated successfully
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
 *                   example: "Name updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d21b4667d0d8992e610c85"
 *                     name:
 *                       type: string
 *                       example: "Jane Smith"
 *                     email:
 *                       type: string
 *                       example: "jane@example.com"
 *                     role:
 *                       type: string
 *                       example: "client"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch(
  "/change-name",
  verifyToken,
  ChangeNameValidation,
  validate,
  changeName
);

/**
 * @swagger
 * /api/users/delete-account:
 *   delete:
 *     summary: Delete the authenticated user's account
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully
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
 *                   example: "Account deleted successfully"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/delete-account", verifyToken, deleteAccount);

export default router;
