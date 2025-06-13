import express from 'express';
import validate from '../middlewares/validate.js';
import { forgotPassword, resetPassword } from '../controllers/password.controller.js';
import { forgotPasswordValidation, resetPasswordValidation } from '../middlewares/validation/PasswordValidation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Password
 *   description: Password management endpoints
 */

/**
 * @swagger
 * /api/password/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Password]
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
 *                 example: "user@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: No account found with this email
 *       500:
 *         description: Server error
 */
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);

/**
 * @swagger
 * /api/password/reset-password/{token}:
 *   post:
 *     summary: Reset password using token
 *     tags: [Password]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - confirmPassword
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d@$!%*?&]'
 *                 example: "NewPassword123"
 *               confirmPassword:
 *                 type: string
 *                 example: "NewPassword123"
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid or expired token
 *       500:
 *         description: Server error
 */
router.post('/reset-password/:token', resetPasswordValidation, validate, resetPassword);

export default router;
