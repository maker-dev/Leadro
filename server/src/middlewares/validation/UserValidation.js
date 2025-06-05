import { body } from 'express-validator';
import User from '../../models/User';

// Validation rules for client registration
const ClientRegisterValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isAlpha().withMessage('Name must contain only alphabetic characters')
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail()
        .custom(async (email) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already exists');
            }
            return true;
        }),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),   
    body('role')
        .trim()
        .default('client')
        .custom((value) => {
        if (value !== 'client') {
            throw new Error('Invalid role for registration');
        }
        return true;
        })
];


export {
    ClientRegisterValidation
};
