import crypto from "crypto";
import ApiKey from "../models/ApiKey.js";

const generateApiKey = async (req, res) => {
  try {
    // Client ID is already validated and attached to request by middleware
    const clientId = req.clientId;
    const { label } = req.body;

    // Generate a secure random API key
    const randomPart = crypto.randomBytes(32).toString("hex");
    const apiKey = `sk-${randomPart}`;

    // Create new API key record
    const newApiKey = await ApiKey.create({
      clientId: clientId,
      label: label,
      key: apiKey,
    });

    res.status(201).json({
      success: true,
      message: "API key generated successfully",
      data: {
        _id: newApiKey._id,
        clientId: newApiKey.clientId,
        label: newApiKey.label,
        key: apiKey, // Return the key for immediate use
        revoked: newApiKey.revoked,
        usageCount: newApiKey.usageCount,
        lastUsedAt: newApiKey.lastUsedAt,
        createdAt: newApiKey.createdAt,
        updatedAt: newApiKey.updatedAt,
      },
    });
  } catch (error) {
    console.error("Generate API key error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate API key",
    });
  }
};

const updateApiKeyLabel = async (req, res) => {
  try {
    const apiKey = req.apiKey;
    const { label } = req.body;

    // Update the API key label
    apiKey.label = label;
    await apiKey.save();

    res.status(200).json({
      success: true,
      message: "API key label updated successfully",
      data: {
        _id: apiKey._id,
        clientId: apiKey.clientId,
        label: apiKey.label,
        revoked: apiKey.revoked,
        usageCount: apiKey.usageCount,
        lastUsedAt: apiKey.lastUsedAt,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update API key label error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update API key label",
    });
  }
};

const deleteApiKey = async (req, res) => {
  try {
    const apiKey = req.apiKey;
    await apiKey.deleteOne();
    res.status(200).json({
      success: true,
      message: "API key deleted successfully",
    });
  } catch (error) {
    console.error("Delete API key error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete API key",
    });
  }
};

const getAllApiKeysForCurrentClient = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const apiKeys = await ApiKey.find({ clientId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "API keys retrieved successfully",
      data: apiKeys.map((apiKey) => ({
        _id: apiKey._id,
        clientId: apiKey.clientId,
        label: apiKey.label,
        key: apiKey.key,
        revoked: apiKey.revoked,
        usageCount: apiKey.usageCount,
        lastUsedAt: apiKey.lastUsedAt,
        createdAt: apiKey.createdAt,
        updatedAt: apiKey.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Get all API keys for client error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve API keys",
    });
  }
};

const getApiKeySummaryForCurrentClient = async (req, res) => {
  try {
    const clientId = req.user.userId;
    const apiKeys = await ApiKey.find({ clientId });
    const totalApiKeys = apiKeys.length;
    const activeKeys = apiKeys.filter((k) => !k.revoked).length;
    const revokedKeys = apiKeys.filter((k) => k.revoked).length;
    const totalUsage = apiKeys.reduce((sum, k) => sum + (k.usageCount || 0), 0);
    const lastKeyCreated =
      apiKeys.length > 0
        ? apiKeys.reduce((latest, k) => {
            return !latest || k.createdAt > latest ? k.createdAt : latest;
          }, null)
        : null;
    res.status(200).json({
      success: true,
      message: "API key summary retrieved successfully",
      data: {
        totalApiKeys,
        activeKeys,
        revokedKeys,
        totalUsage,
        lastKeyCreated,
      },
    });
  } catch (error) {
    console.error("Get API key summary error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve API key summary",
    });
  }
};

export {
  generateApiKey,
  updateApiKeyLabel,
  deleteApiKey,
  getAllApiKeysForCurrentClient,
  getApiKeySummaryForCurrentClient,
};
