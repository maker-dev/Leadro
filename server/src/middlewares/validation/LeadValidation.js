import { body, param } from 'express-validator';
import Lead from '../../models/Lead.js';

const CreateLeadValidation = [
    // Required fields
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    // Optional fields with validation if provided
    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-'.]+$/).withMessage('Name can only contain letters, numbers, spaces, and basic punctuation'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage('Please provide a valid phone number'),

    body('source')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Source must be between 2 and 50 characters'),

    body('message')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),

    // Validate any extra fields
    body()
        .custom((data) => {
            const allowedFields = ['email', 'name', 'phone', 'source', 'status', 'message'];
            const extraFields = Object.keys(data).filter(key => !allowedFields.includes(key));
            
            // Validate each extra field
            for (const field of extraFields) {
                const value = data[field];
                
                // Check if value is not null or undefined
                if (value === null || value === undefined) {
                    throw new Error(`Extra field '${field}' cannot be null or undefined`);
                }

                // Check if value is not an object or array (to keep extra fields simple)
                if (typeof value === 'object') {
                    throw new Error(`Extra field '${field}' must be a simple value, not an object or array`);
                }

                // Check field name format
                if (!/^[a-zA-Z0-9_]+$/.test(field)) {
                    throw new Error(`Extra field name '${field}' can only contain letters, numbers, and underscores`);
                }

                // Check value length if it's a string
                if (typeof value === 'string' && value.length > 500) {
                    throw new Error(`Extra field '${field}' value cannot exceed 500 characters`);
                }
            }

            return true;
        })
];

const UpdateLeadValidation = [
    // Validate ID parameter
    param('id')
        .notEmpty().withMessage('Lead ID is required')
        .isMongoId().withMessage('Invalid lead ID format'),

    // Optional fields with validation if provided
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail(),

    body('name')
        .optional()
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Name must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9\s\-'.]+$/).withMessage('Name can only contain letters, numbers, spaces, and basic punctuation'),

    body('phone')
        .optional()
        .trim()
        .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
        .withMessage('Please provide a valid phone number'),

    body('source')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Source must be between 2 and 50 characters'),

    body('status')
        .optional()
        .trim()
        .isIn(['new', 'contacted', 'converted', 'lost'])
        .withMessage('Status must be one of: new, contacted, converted, lost'),

    body('message')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Message cannot exceed 1000 characters'),

    // Validate any extra fields
    body()
        .custom((data) => {
            const allowedFields = ['email', 'name', 'phone', 'source', 'status', 'message'];
            const extraFields = Object.keys(data).filter(key => !allowedFields.includes(key));
            
            // Validate each extra field
            for (const field of extraFields) {
                const value = data[field];
                
                // Check if value is not null or undefined
                if (value === null || value === undefined) {
                    throw new Error(`Extra field '${field}' cannot be null or undefined`);
                }

                // Check if value is not an object or array (to keep extra fields simple)
                if (typeof value === 'object') {
                    throw new Error(`Extra field '${field}' must be a simple value, not an object or array`);
                }

                // Check field name format
                if (!/^[a-zA-Z0-9_]+$/.test(field)) {
                    throw new Error(`Extra field name '${field}' can only contain letters, numbers, and underscores`);
                }

                // Check value length if it's a string
                if (typeof value === 'string' && value.length > 500) {
                    throw new Error(`Extra field '${field}' value cannot exceed 500 characters`);
                }
            }
            
            return true;
        })
];

const DeleteLeadValidation = [
    // Validate ID parameter
    param('id')
        .trim()
        .notEmpty()
        .withMessage('Lead ID is required')
        .custom(async (id, { req }) => {
            try {
                // Find lead and verify ownership
                const lead = await Lead.findOne({ 
                    _id: id, 
                    ownerId: req.user.userId 
                });
                
                if (!lead) {
                    throw new Error('Lead not found or unauthorized');
                }

                // Store lead in request for controller use
                req.lead = lead;
                return true;
            } catch (error) {
                if (error.name === 'CastError') {
                    throw new Error('Invalid lead ID format');
                }
                throw error;
            }
        })
];

export {
    CreateLeadValidation,
    UpdateLeadValidation,
    DeleteLeadValidation
};
