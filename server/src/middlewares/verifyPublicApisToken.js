import ApiKey from '../models/ApiKey.js';

const verifyPublicApisToken = async (req, res, next) => {
    const apiKey = req.header("x-api-key");

    if (!apiKey) {
        return res.status(401).json({
            success: false,
            message: 'API key is required'
        });
    }

    try {
        // Find the API key in the database
        const key = await ApiKey.findOne({ 
            key: apiKey,
            revoked: false,
            expiresAt: { $gt: new Date() }
        }).populate('clientId', 'email');

        if (!key) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired API key'
            });
        }

        // Attach the API key information to the request
        req.apiKey = key;
        next();
    } catch (error) {
        console.error('API Key verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Error verifying API key'
        });
    }
};

export default verifyPublicApisToken;
