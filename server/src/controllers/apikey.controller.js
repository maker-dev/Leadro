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

/* 
revoke apikey
activate apikey
regenerate apikey
*/

export {
    generateApiKey
};
