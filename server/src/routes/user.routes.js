import express from 'express'
import validate from '../middlewares/validate.js';
import verifyToken from '../middlewares/verifyToken.js';
import verifyRole from '../middlewares/verifyRole.js';
import { clientRegister, clientLogin, adminLogin, getProfile, getAllClients, clientVerifyEmail, resendVerificationEmail } from '../controllers/user.controller.js';
import { ClientRegisterValidation, ClientLoginValidation, AdminLoginValidation, ProfileValidation, ResendVerificationEmailValidation } from '../middlewares/validation/UserValidation.js';

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
router.post('/client/register', ClientRegisterValidation, validate, clientRegister);

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
router.get('/client/verify-email', clientVerifyEmail);

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
router.post('/client/resend-verification', ResendVerificationEmailValidation, validate, resendVerificationEmail);

/**
 * @swagger
 * /api/users/client/login:
 *   post:
 *     summary: Client login
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
 *                 description: Email address of the account
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 description: Account password
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: User ID
 *                           example: "60d21b4667d0d8992e610c85"
 *                         name:
 *                           type: string
 *                           description: Full name of the user
 *                           example: "John Doe"
 *                         email:
 *                           type: string
 *                           description: Email address of the user
 *                           example: "john@example.com"
 *                         role:
 *                           type: string
 *                           description: User role
 *                           example: "client"
 *                         isEmailVerified:
 *                           type: boolean
 *                           description: Whether the email has been verified
 *                           example: true
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
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/client/login', ClientLoginValidation, validate, clientLogin);

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
router.get('/profile', verifyToken, ProfileValidation, validate, getProfile);

/**
 * @swagger
 * /api/users/admin/login:
 *   post:
 *     summary: Admin login
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
 *                 description: Admin email address
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 description: Admin password
 *                 example: "AdminPass123"
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
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: JWT authentication token
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           description: User ID
 *                           example: "60d21b4667d0d8992e610c85"
 *                         name:
 *                           type: string
 *                           description: Full name of the admin
 *                           example: "Admin User"
 *                         email:
 *                           type: string
 *                           description: Email address of the admin
 *                           example: "admin@example.com"
 *                         role:
 *                           type: string
 *                           description: User role
 *                           example: "admin"
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
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/admin/login', AdminLoginValidation, validate, adminLogin);

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
router.get('/admin/clients', verifyToken, verifyRole(['admin']), getAllClients);

export default router;