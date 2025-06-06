import { body } from 'express-validator';
import User from '../../models/User.js';
import bcrypt from 'bcrypt';

// Validation rules for client registration
const ClientRegisterValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .matches(/^[A-Za-z\s]+$/).withMessage('Name must contain only letters')
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
    body('confirmPassword')
        .trim()
        .notEmpty()
        .withMessage('Confirm Password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
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

// Validation rules for client login
const ClientLoginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
    body().custom(async (_, { req }) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.role !== 'client') {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password'); 
        }

        req.user = user;
        return true;
    })
];

// Validation rules for admin login
const AdminLoginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required'),
    body().custom(async (_, { req }) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('Invalid email or password');
        }

        if (user.role !== 'admin') {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid email or password'); 
        }

        req.user = user;
        return true;
    })
];

export {
    ClientRegisterValidation,
    ClientLoginValidation,
    AdminLoginValidation
};
