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
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]'
 *                 example: "Password123"
 *               confirmPassword:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       201:
 *         description: Client registered successfully
 *       400:
 *         description: Validation error
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
 *         description: Email verification token
 *     responses:
 *       200:
 *         description: Email verified successfully
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
 *                 example: "john@example.com"
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *       400:
 *         description: Validation error
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
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 example: "Password123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
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
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "AdminPass123"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Server error
 */
router.get('/admin/clients', verifyToken, verifyRole(['admin']), getAllClients);

export default router;