import { body, param } from 'express-validator';
import User from '../../models/User.js';
import ClientAccess from '../../models/ClientAccess.js';

const ShareAccessValidation = [
    // Validate email of client to share with
    body('email')
        .trim()
        .notEmpty().withMessage('Email of client to share with is required')
        .isEmail().withMessage('Please provide a valid email')
        .normalizeEmail() // Normalize email format
        .custom(async (email, { req }) => {
            try {
                // Fetch current user's email from DB
                const currentUser = await User.findById(req.user.userId);
                if (!currentUser) {
                    throw new Error('Current user not found');
                }
                // Check if trying to share with self
                if (email.toLowerCase() === currentUser.email.toLowerCase()) {
                    throw new Error('Cannot share access with yourself');
                }

                // Check if target client exists and is verified
                const targetClient = await User.findOne({ 
                    email: email,
                    isEmailVerified: true,
                    role: 'client'
                });

                if (!targetClient) {
                    throw new Error('Target client not found or not verified');
                }

                // Check if sharing already exists
                const existingShare = await ClientAccess.findOne({
                    ownerId: req.user.userId,
                    sharedWithId: targetClient._id
                });

                if (existingShare) {
                    throw new Error('You have already shared access with this client');
                }

                // Store target client in request for controller use
                req.targetClient = targetClient;
                return true;
            } catch (error) {
                throw error;
            }
        }),

    // Validate permissions array (optional since it has a default value)
    body('permissions')
        .optional()
        .isArray().withMessage('Permissions must be an array')
        .custom((permissions) => {
            const allowedPermissions = ['read', 'update', 'delete'];
            
            // Check if all provided permissions are valid
            const isValid = permissions.every(permission => 
                allowedPermissions.includes(permission)
            );

            if (!isValid) {
                throw new Error('Invalid permissions. Allowed values: read, update, delete');
            }

            // Check for duplicate permissions
            if (new Set(permissions).size !== permissions.length) {
                throw new Error('Duplicate permissions are not allowed');
            }

            return true;
        })
];

const UpdateSharingPermissionsValidation = [
    // Validate accessId param
    param('accessId')
        .notEmpty().withMessage('Access ID is required')
        .isMongoId().withMessage('Invalid access ID format')
        .custom(async (accessId, { req }) => {
            // Ensure the sharing relationship exists and the current user is the owner
            const access = await ClientAccess.findOne({ _id: accessId, ownerId: req.user.userId });
            if (!access) {
                throw new Error('Not owner of this sharing or sharing not found.');
            }
            req.access = access;
            return true;
        }),

    // Validate permissions array
    body('permissions')
        .isArray({ min: 1 }).withMessage('Permissions must be a non-empty array')
        .custom((permissions) => {
            const allowedPermissions = ['read', 'update', 'delete'];
            // Check if all provided permissions are valid
            const isValid = permissions.every(permission => 
                allowedPermissions.includes(permission)
            );
            if (!isValid) {
                throw new Error('Invalid permissions. Allowed values: read, update, delete');
            }
            // Check for duplicate permissions
            if (new Set(permissions).size !== permissions.length) {
                throw new Error('Duplicate permissions are not allowed');
            }
            return true;
        })
];

const RemoveSharingAccessValidation = [
    param('accessId')
        .notEmpty().withMessage('Access ID is required')
        .isMongoId().withMessage('Invalid access ID format')
        .custom(async (accessId, { req }) => {
            // Ensure the sharing relationship exists and the current user is the owner
            const access = await ClientAccess.findOne({ _id: accessId, ownerId: req.user.userId });
            if (!access) {
                throw new Error('Not owner of this sharing or sharing not found.');
            }
            req.access = access;
            return true;
        })
];

const GetSharingDetailsValidation = [
    param('accessId')
        .notEmpty().withMessage('Access ID is required')
        .isMongoId().withMessage('Invalid access ID format')
        .custom(async (accessId, { req }) => {
            // Find the sharing relationship where the user is either owner or sharedWith
            const access = await ClientAccess.findOne({
                _id: accessId,
                $or: [
                    { ownerId: req.user.userId },
                    { sharedWithId: req.user.userId }
                ]
            });
            if (!access) {
                throw new Error('Not involved in this sharing or sharing not found.');
            }
            req.access = access;
            return true;
        })
];

export {
    ShareAccessValidation,
    UpdateSharingPermissionsValidation,
    RemoveSharingAccessValidation,
    GetSharingDetailsValidation
};
