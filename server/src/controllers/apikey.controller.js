import crypto from 'crypto';
import ApiKey from '../models/ApiKey.js';

const generateApiKey = async (req, res) => {
    try {
        // Client is already validated and attached to request by middleware
        const client = req.client;
        const { expiresAt } = req.body;

        // Generate a secure random API key
        const apiKeyBuffer = crypto.randomBytes(32);
        const apiKey = apiKeyBuffer.toString('base64url');

        // Create new API key record
        const newApiKey = await ApiKey.create({
            clientId: client._id,
            key: apiKey,
            expiresAt: new Date(expiresAt)
        });

        // Don't send the actual key in the response data for security
        const apiKeyData = newApiKey.toObject();
        delete apiKeyData.key;

        res.status(201).json({
            success: true,
            message: 'API key generated successfully',
            data: {
                ...apiKeyData,
                key: apiKey // Send key only once in the response
            }
        });

    } catch (error) {
        console.error('Generate API key error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate API key'
        });
    }
};

const toggleApiKeyStatus = async (req, res) => {
    try {
        
        const apiKey = req.apiKey;

        // Toggle the revoked status
        apiKey.revoked = !apiKey.revoked;
        await apiKey.save();

        res.status(200).json({
            success: true,
            message: `API key ${apiKey.revoked ? 'revoked' : 'activated'} successfully`,
            data: apiKey
        });

    } catch (error) {
        console.error('Toggle API key status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle API key status'
        });
    }
};

const regenerateApiKey = async (req, res) => {
    try {
        const apiKey = req.apiKey;
        const { expiresAt } = req.body;

        // Generate a new secure random API key
        const apiKeyBuffer = crypto.randomBytes(32);
        const newKey = apiKeyBuffer.toString('base64url');

        // Update the existing API key with new key and expiration
        apiKey.key = newKey;
        apiKey.expiresAt = new Date(expiresAt);
        apiKey.revoked = false; // Reset revoked status
        await apiKey.save();

        // Don't send the actual key in the response data for security
        const apiKeyData = apiKey.toObject();
        delete apiKeyData.key;

        res.status(200).json({
            success: true,
            message: 'API key regenerated successfully',
            data: {
                ...apiKeyData,
                key: newKey // Send new key only once in the response
            }
        });

    } catch (error) {
        console.error('Regenerate API key error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to regenerate API key'
        });
    }
};


export {
    generateApiKey,
    toggleApiKeyStatus,
    regenerateApiKey
};
