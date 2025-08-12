import ApiKey from "../../models/ApiKey.js";
import rateLimit from "express-rate-limit";

// Create IP-based rate limiter
const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const checkApiKeyOrRateLimitByIP = async (req, res, next) => {
  const apiKey = req.header("x-api-key");

  // If no API key is provided, apply IP-based rate limiting
  if (!apiKey) {
    ipRateLimiter(req, res, () => {
      return res.status(401).json({
        success: false,
        message: "API key is required",
      });
    });
    return;
  }

  try {
    // Find the API key in the database
    const key = await ApiKey.findOne({
      key: apiKey,
      revoked: false,
    }).populate("clientId", "email");

    // If API key is invalid or expired, apply IP-based rate limiting
    if (!key) {
      ipRateLimiter(req, res, () => {
        return res.status(401).json({
          success: false,
          message: "Invalid or revoked API key",
        });
      });
      return;
    }

    // If API key is valid, attach it to the request and proceed
    req.apiKey = key;
    next();
  } catch (error) {
    console.error("API Key verification error:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying API key",
    });
  }
};

export default checkApiKeyOrRateLimitByIP;
