import { param, body } from 'express-validator';
import User from '../../models/User.js';
import ApiKey from '../../models/ApiKey.js';

const generateApiKeyValidation = [
    param('clientId')
        .trim()
        .notEmpty()
        .withMessage('Client ID is required')
        .custom(async (clientId, { req }) => {
            try {
                // Check if client exists and is active
                const client = await User.findOne({ 
                    _id: clientId,
                    role: 'client',
                    isEmailVerified: true
                });

                if (!client) {
                    throw new Error('Client not found or not verified');
                }

                // Check if client already has an active API key
                const existingApiKey = await ApiKey.findOne({
                    clientId: client._id,
                    expiresAt: { $gt: new Date() }
                });

                if (existingApiKey) {
                    throw new Error('Client already has an active API key');
                }

                // Store client in request for controller use
                req.client = client;
                return true;
            } catch (error) {
                if (error.name === 'CastError') {
                    throw new Error('Invalid client ID format');
                }
                throw error;
            }
        }),
    body('expiresAt')
        .trim()
        .notEmpty()
        .withMessage('Expiration date is required')
        .isISO8601()
        .withMessage('Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)')
        .custom((value) => {
            const expirationDate = new Date(value);
            const now = new Date();

            // Check if date is in the future
            if (expirationDate <= now) {
                throw new Error('Expiration date must be in the future');
            }

            // Check if date is not more than 1 year from now
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            
            if (expirationDate > oneYearFromNow) {
                throw new Error('Expiration date cannot be more than 1 year from now');
            }

            return true;
        })
];

const toggleApiKeyStatusValidation = [
    param('apiKeyId')
        .trim()
        .notEmpty()
        .withMessage('API Key ID is required')
        .custom(async (apiKeyId, { req }) => {
            try {
                const apiKey = await ApiKey.findById(apiKeyId);
                if (!apiKey) {
                    throw new Error('API key not found');
                }
                req.apiKey = apiKey;
                return true;
            } catch (error) {
                if (error.name === 'CastError') {
                    throw new Error('Invalid API key ID format');
                }
                throw error;
            }
        })
];

const regenerateApiKeyValidation = [
    param('apiKeyId')
        .trim()
        .notEmpty()
        .withMessage('API Key ID is required')
        .custom(async (apiKeyId, { req }) => {
            try {
                const apiKey = await ApiKey.findById(apiKeyId);
                if (!apiKey) {
                    throw new Error('API key not found');
                }
                req.apiKey = apiKey;
                return true;
            } catch (error) {
                if (error.name === 'CastError') {
                    throw new Error('Invalid API key ID format');
                }
                throw error;
            }
        }),
    body('expiresAt')
        .trim()
        .notEmpty()
        .withMessage('Expiration date is required')
        .isISO8601()
        .withMessage('Invalid date format. Please use ISO 8601 format (YYYY-MM-DD)')
        .custom((value) => {
            const expirationDate = new Date(value);
            const now = new Date();

            // Check if date is in the future
            if (expirationDate <= now) {
                throw new Error('Expiration date must be in the future');
            }

            // Check if date is not more than 1 year from now
            const oneYearFromNow = new Date();
            oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
            
            if (expirationDate > oneYearFromNow) {
                throw new Error('Expiration date cannot be more than 1 year from now');
            }

            return true;
        })
];

export {
    generateApiKeyValidation,
    toggleApiKeyStatusValidation,
    regenerateApiKeyValidation
}