import { body } from 'express-validator';
import User from '../../models/User.js';

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

export default {
    forgotPasswordValidation
};
