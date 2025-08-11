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
    console.log(error);
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

// ===================== ADMIN: Get all clients with their API key stats =====================
const getAllClientsApiKeyStats = async (req, res) => {
  try {
    // Parse filters from query
    let {
      page = 1,
      limit = 8,
      search = "",
      status, // "active" or "revoked"
      totalusagecount_min,
      totalusagecount_max,
      totalkeysnumber_min,
      totalkeysnumber_max,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Build match stage for status
    let matchStage = {};
    if (status === "active") {
      matchStage.revoked = false;
    } else if (status === "revoked") {
      matchStage.revoked = true;
    }

    // Aggregate API key stats per client
    let stats = await ApiKey.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$clientId",
          totalApiKeys: { $sum: 1 },
          activeKeys: { $sum: { $cond: [{ $eq: ["$revoked", false] }, 1, 0] } },
          revokedKeys: { $sum: { $cond: [{ $eq: ["$revoked", true] }, 1, 0] } },
          totalUsageCount: { $sum: "$usageCount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "client",
        },
      },
      { $unwind: "$client" },
      {
        $project: {
          clientId: "$_id",
          clientName: "$client.name",
          email: "$client.email",
          totalApiKeys: 1,
          activeKeys: 1,
          revokedKeys: 1,
          totalUsageCount: 1,
        },
      },
    ]);

    // Filter by search (name or email, case-insensitive)
    if (search) {
      const searchLower = search.toLowerCase();
      stats = stats.filter(
        (item) =>
          (item.clientName &&
            item.clientName.toLowerCase().includes(searchLower)) ||
          (item.email && item.email.toLowerCase().includes(searchLower))
      );
    }

    // Filter by totalusagecount min/max
    if (totalusagecount_min !== undefined) {
      stats = stats.filter(
        (item) => item.totalUsageCount >= Number(totalusagecount_min)
      );
    }
    if (totalusagecount_max !== undefined) {
      stats = stats.filter(
        (item) => item.totalUsageCount <= Number(totalusagecount_max)
      );
    }
    // Filter by totalkeysnumber min/max
    if (totalkeysnumber_min !== undefined) {
      stats = stats.filter(
        (item) => item.totalApiKeys >= Number(totalkeysnumber_min)
      );
    }
    if (totalkeysnumber_max !== undefined) {
      stats = stats.filter(
        (item) => item.totalApiKeys <= Number(totalkeysnumber_max)
      );
    }

    // Pagination
    const totalItems = stats.length;
    const totalPages = Math.ceil(totalItems / limit);
    const skip = (page - 1) * limit;
    const paginated = stats.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      data: paginated,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all clients API key stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve clients API key stats",
    });
  }
};

// ===================== ADMIN: Get API key summary for admin =====================
const getApiKeySummaryForAdmin = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Validate clientId parameter
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Get all API keys for the specific client
    const clientApiKeys = await ApiKey.find({ clientId });

    // Calculate statistics for the specific client
    const totalApiKeys = clientApiKeys.length;
    const activeKeys = clientApiKeys.filter((k) => !k.revoked).length;
    const revokedKeys = clientApiKeys.filter((k) => k.revoked).length;
    const totalUsage = clientApiKeys.reduce(
      (sum, k) => sum + (k.usageCount || 0),
      0
    );

    // Get the most recent API key creation date
    const lastKeyCreated =
      clientApiKeys.length > 0
        ? clientApiKeys.reduce((latest, k) => {
            return !latest || k.createdAt > latest ? k.createdAt : latest;
          }, null)
        : null;

    // Get the most recent API key usage date
    const lastKeyUsed =
      clientApiKeys.length > 0
        ? clientApiKeys.reduce((latest, k) => {
            if (!k.lastUsedAt) return latest;
            return !latest || k.lastUsedAt > latest ? k.lastUsedAt : latest;
          }, null)
        : null;

    // Calculate average usage per key
    const averageUsagePerKey =
      totalApiKeys > 0 ? Math.round(totalUsage / totalApiKeys) : 0;

    // Get top 1 most used API key label for this client (only if usage > 0)
    const topUsedKey =
      clientApiKeys
        .filter((key) => (key.usageCount || 0) > 0) // Filter out keys with 0 usage
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 1)
        .map((key) => key.label)[0] || null;

    res.status(200).json({
      success: true,
      message: "API key summary retrieved successfully",
      data: {
        totalApiKeys,
        activeKeys,
        revokedKeys,
        totalUsage,
        lastKeyCreated,
        lastKeyUsed,
        averageUsagePerKey,
        topUsedKey,
      },
    });
  } catch (error) {
    console.error("Get API key summary for admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve API key summary",
    });
  }
};

// ===================== ADMIN: Get all API keys for a specific client =====================
const getAllApiKeysForClientByAdmin = async (req, res) => {
  try {
    const { clientId } = req.params;

    // Validate clientId parameter
    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    // Get all API keys for the specific client with detailed information
    const clientApiKeys = await ApiKey.find({ clientId }).sort({
      createdAt: -1,
    });

    // Map the API keys to include all necessary information
    const mappedApiKeys = clientApiKeys.map((apiKey) => ({
      _id: apiKey._id,
      clientId: apiKey.clientId,
      label: apiKey.label,
      key: apiKey.key,
      revoked: apiKey.revoked,
      usageCount: apiKey.usageCount || 0,
      lastUsedAt: apiKey.lastUsedAt,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: "API keys retrieved successfully",
      data: {
        clientId,
        totalKeys: mappedApiKeys.length,
        apiKeys: mappedApiKeys,
      },
    });
  } catch (error) {
    console.error("Get all API keys for client by admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve API keys for client",
    });
  }
};

// ===================== ADMIN: Delete API key for a specific client =====================
const deleteApiKeyByAdmin = async (req, res) => {
  try {
    const { clientId, apiKeyId } = req.params;

    // Find the API key and ensure it belongs to the specified client
    const apiKey = await ApiKey.findOne({
      _id: apiKeyId,
      clientId: clientId,
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: "API key not found or does not belong to the specified client",
      });
    }

    // Delete the API key
    await apiKey.deleteOne();

    res.status(200).json({
      success: true,
      message: "API key deleted successfully",
      data: {
        deletedApiKey: {
          _id: apiKey._id,
          clientId: apiKey.clientId,
          label: apiKey.label,
          revoked: apiKey.revoked,
          usageCount: apiKey.usageCount || 0,
          lastUsedAt: apiKey.lastUsedAt,
          createdAt: apiKey.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Delete API key by admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete API key",
    });
  }
};

// ===================== ADMIN: Update API key revoked status for a specific client =====================
const updateApiKeyRevokedStatusByAdmin = async (req, res) => {
  try {
    const { clientId, apiKeyId } = req.params;
    const { revoked } = req.body;

    // Find the API key and ensure it belongs to the specified client
    const apiKey = await ApiKey.findOne({
      _id: apiKeyId,
      clientId: clientId,
    });

    if (!apiKey) {
      return res.status(404).json({
        success: false,
        message: "API key not found or does not belong to the specified client",
      });
    }

    // Update the revoked status
    apiKey.revoked = revoked;
    await apiKey.save();

    res.status(200).json({
      success: true,
      message: `API key ${revoked ? "revoked" : "activated"} successfully`,
      data: {
        updatedApiKey: {
          _id: apiKey._id,
          clientId: apiKey.clientId,
          label: apiKey.label,
          key: apiKey.key,
          revoked: apiKey.revoked,
          usageCount: apiKey.usageCount || 0,
          lastUsedAt: apiKey.lastUsedAt,
          createdAt: apiKey.createdAt,
          updatedAt: apiKey.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Update API key revoked status by admin error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update API key revoked status",
    });
  }
};

export {
  generateApiKey,
  updateApiKeyLabel,
  deleteApiKey,
  getAllApiKeysForCurrentClient,
  getApiKeySummaryForCurrentClient,
  getAllClientsApiKeyStats,
  getApiKeySummaryForAdmin,
  getAllApiKeysForClientByAdmin,
  deleteApiKeyByAdmin,
  updateApiKeyRevokedStatusByAdmin,
};
