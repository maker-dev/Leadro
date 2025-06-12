import { body, param } from 'express-validator';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

export const forgotPasswordValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .custom(async (email, { req }) => {
            // Check if user exists
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('No account found with this email address');
            }

            // Store user in request for controller use
            req.user = user;
            return true;
        })
];

export const resetPasswordValidation = [
    param('token')
        .trim()
        .notEmpty()
        .withMessage('Reset token is required')
        .custom(async (token, { req }) => {
            try {
                // Verify token
                const decoded = jwt.verify(token, process.env.RESET_SECRET);
                
                // Check if user exists
                const user = await User.findById(decoded.id);
                if (!user) {
                    throw new Error('Invalid reset token');
                }

                // Store user in request for controller use
                req.user = user;
                return true;
            } catch (error) {
                if (error.name === 'TokenExpiredError') {
                    throw new Error('Reset token has expired');
                }
                throw new Error('Invalid reset token');
            }
        }),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

export default {
    forgotPasswordValidation,
    resetPasswordValidation
};
