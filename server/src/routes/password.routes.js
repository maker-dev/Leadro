import express from 'express';
import validate from '../middlewares/validate.js';
import { forgotPassword } from '../controllers/password.controller.js';
import { forgotPasswordValidation } from '../middlewares/validation/PasswordValidation.js';

const router = express.Router();

// Password Reset Routes
router.post('/forgot-password', forgotPasswordValidation, validate, forgotPassword);

export default router;
