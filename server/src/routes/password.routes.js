import express from 'express';
import validate from '../middlewares/validate.js';
import { forgotPassword, resetPassword } from '../controllers/password.controller.js';
import { forgotPasswordValidation, resetPasswordValidation } from '../middlewares/validation/PasswordValidation.js';

const router = express.Router();

// Password Reset Routes
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);
router.post('/reset-password/:token', resetPasswordValidation, validate, resetPassword);

export default router;
