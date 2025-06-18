import crypto from 'crypto';
import ApiKey from '../models/ApiKey.js';
import User from '../models/User.js';

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

const getClientApiKey = async (req, res) => {
    try {
        const apiKey = req.clientApiKey;

        res.status(200).json({
            success: true,
            message: 'API key retrieved successfully',
            data: {
                key: apiKey.key,
                expiresAt: apiKey.expiresAt,
                revoked: apiKey.revoked
            }
        });

    } catch (error) {
        console.error('Get API key error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve API key'
        });
    }
};

const getAllApiKeysWithClients = async (req, res) => {
    try {
        // Get all verified clients
        const verifiedClients = await User.find({
            role: 'client',
            isEmailVerified: true
        }).select('name email createdAt');

        // Get all API keys
        const apiKeys = await ApiKey.find()
            .populate('clientId', 'name email createdAt')
            .sort({ createdAt: -1 });

        // Create a map of clientId to API key for quick lookup
        const apiKeyMap = new Map();
        apiKeys.forEach(apiKey => {
            apiKeyMap.set(apiKey.clientId._id.toString(), apiKey);
        });

        // Transform the data to include all verified clients with their API keys
        const clientsWithApiKeys = verifiedClients.map(client => {
            const clientData = client.toObject();
            const apiKey = apiKeyMap.get(clientData._id.toString());
            
            if (apiKey) {
                // Client has an API key
                return {
                    _id: clientData._id,
                    clientName: clientData.name,
                    clientEmail: clientData.email,
                    clientCreatedAt: clientData.createdAt,
                    hasApiKey: true,
                    apiKey: {
                        _id: apiKey._id,
                        key: apiKey.key,
                        revoked: apiKey.revoked,
                        expiresAt: apiKey.expiresAt,
                        createdAt: apiKey.createdAt,
                        updatedAt: apiKey.updatedAt,
                        isExpired: new Date() > new Date(apiKey.expiresAt),
                        isActive: !apiKey.revoked && new Date() < new Date(apiKey.expiresAt)
                    }
                };
            } else {
                // Client doesn't have an API key
                return {
                    _id: clientData._id,
                    clientName: clientData.name,
                    clientEmail: clientData.email,
                    clientCreatedAt: clientData.createdAt,
                    hasApiKey: false,
                    apiKey: null
                };
            }
        });

        res.status(200).json({
            success: true,
            message: 'Clients and API keys retrieved successfully',
            data: clientsWithApiKeys
        });

    } catch (error) {
        console.error('Get all API keys with clients error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve clients and API keys'
        });
    }
};

const getApiKeyByClientId = async (req, res) => {
    try {
        const client = req.targetClient; // From validation middleware

        // Find the API key for this client
        const apiKey = await ApiKey.findOne({ clientId: client._id }).sort({ createdAt: -1 });

        const clientData = client.toObject();
        
        if (apiKey) {
            // Client has an API key
            const apiKeyData = apiKey.toObject();
            res.status(200).json({
                success: true,
                message: 'API key retrieved successfully',
                data: {
                    _id: clientData._id,
                    clientName: clientData.name,
                    clientEmail: clientData.email,
                    clientCreatedAt: clientData.createdAt,
                    hasApiKey: true,
                    apiKey: {
                        _id: apiKeyData._id,
                        key: apiKeyData.key,
                        revoked: apiKeyData.revoked,
                        expiresAt: apiKeyData.expiresAt,
                        createdAt: apiKeyData.createdAt,
                        updatedAt: apiKeyData.updatedAt,
                        isExpired: new Date() > new Date(apiKeyData.expiresAt),
                        isActive: !apiKeyData.revoked && new Date() < new Date(apiKeyData.expiresAt)
                    }
                }
            });
        } else {
            // Client doesn't have an API key
            res.status(200).json({
                success: true,
                message: 'No API key found for this client',
                data: {
                    _id: clientData._id,
                    clientName: clientData.name,
                    clientEmail: clientData.email,
                    clientCreatedAt: clientData.createdAt,
                    hasApiKey: false,
                    apiKey: null
                }
            });
        }

    } catch (error) {
        console.error('Get API key by client ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve API key'
        });
    }
};

export {
    generateApiKey,
    toggleApiKeyStatus,
    regenerateApiKey,
    getClientApiKey,
    getAllApiKeysWithClients,
    getApiKeyByClientId
};
