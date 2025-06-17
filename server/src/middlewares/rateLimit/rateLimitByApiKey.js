import rateLimit from 'express-rate-limit';

// Create API key-based rate limiter
const apiKeyRateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 200, // Limit each API key to 200 requests per windowMs
    message: {
        success: false,
        message: 'API key rate limit exceeded, please try again later'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Use the API key as the key for rate limiting
    keyGenerator: (req) => {
        return req.apiKey.key;
    }
});

export default apiKeyRateLimiter;
