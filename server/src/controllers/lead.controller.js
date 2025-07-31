import Lead from "../models/Lead.js";
import ClientAccess from "../models/ClientAccess.js";

/* CLIENT API */

// Create new lead
const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, message, status, ...extraFields } =
      req.body;

    const lead = await Lead.create({
      ownerId: req.user.userId, // Assign to current user
      name: name !== undefined ? name : null,
      email,
      phone: phone !== undefined ? phone : null,
      source: source !== undefined ? source : null,
      message: message !== undefined ? message : null,
      status,
      extraFields: new Map(Object.entries(extraFields)), // Convert extra fields to Map
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Create lead error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all leads for a client with pagination and filtering
const getClientLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      search,
      status,
      source,
      startDate,
      endDate,
      owner = "anyone",
    } = req.query;

    // Build query
    const query = {};

    // Handle owner filter
    if (owner === "me") {
      query.ownerId = req.user.userId;
    } else if (owner === "anyone") {
      // Get both owned leads and shared leads
      const sharedAccesses = await ClientAccess.find({
        sharedWithId: req.user.userId,
        permissions: { $in: ["read"] },
      });
      const sharedOwnerIds = sharedAccesses.map((access) => access.ownerId);

      query.$or = [
        { ownerId: req.user.userId },
        { ownerId: { $in: sharedOwnerIds } },
      ];
    }

    // Add search condition if search parameter exists
    if (search) {
      const searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
        ],
      };

      if (query.$or) {
        // If we already have $or for owner filter, combine with search
        query.$and = [{ $or: query.$or }, searchQuery];
        delete query.$or;
      } else {
        Object.assign(query, searchQuery);
      }
    }

    // Add status filter if provided
    if (status && status !== "all") {
      query.status = status;
    }

    // Add source filter if provided
    if (source && source !== "all") {
      query.source = source;
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination
    const totalItems = await Lead.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum);

    // Get leads with pagination
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    // Add owner information to leads
    const leadsWithOwner = leads.map((lead) => {
      const isOwned = lead.ownerId.toString() === req.user.userId;
      return {
        ...lead,
        owner: isOwned ? "me" : "shared",
        sharedBy: isOwned ? null : lead.ownerId, // You might want to populate this with actual owner name
      };
    });

    res.status(200).json({
      success: true,
      data: {
        leads: leadsWithOwner,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems,
          itemsPerPage: limitNum,
          hasNextPage: pageNum < totalPages,
          hasPrevPage: pageNum > 1,
        },
      },
    });
  } catch (error) {
    console.error("Get client leads error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get lead by ID
const getLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find lead and verify ownership
    const lead = await Lead.findOne({ _id: id, ownerId: req.user.userId });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Get lead by ID error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update lead
const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, source, message, status, ...extraFields } =
      req.body;

    // Find lead and verify ownership
    const lead = await Lead.findOne({ _id: id, ownerId: req.user.userId });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or unauthorized",
      });
    }

    // Build complete update object - replace all fields with what's provided
    const updateData = {
      name: name !== undefined ? name : null, // Allow null to delete the field
      email,
      phone: phone !== undefined ? phone : null,
      source: source !== undefined ? source : null,
      message: message !== undefined ? message : null,
      status,
    };

    // Handle extra fields - replace all extra fields with what's provided
    if (Object.keys(extraFields).length > 0) {
      updateData.extraFields = new Map(Object.entries(extraFields));
    } else {
      updateData.extraFields = new Map(); // Clear all extra fields if none provided
    }

    // Update the lead
    const updatedLead = await Lead.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update lead error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid lead ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete lead
const deleteLead = async (req, res) => {
  try {
    // Lead is already validated and attached to request by middleware
    await req.lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ADMIN API */

// Get all leads grouped by clients (Admin only)
const getAllLeadsGroupedByClients = async (req, res) => {
  try {
    const { search, source, status, startDate, endDate, clientName } =
      req.query;

    // Build match stage for filtering
    const matchStage = {};

    // Add search condition if search parameter exists
    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Add source filter if provided
    if (source) {
      matchStage.source = { $regex: source, $options: "i" };
    }

    // Add status filter if provided
    if (status) {
      matchStage.status = { $regex: status, $options: "i" };
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) {
        matchStage.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        matchStage.createdAt.$lte = new Date(endDate);
      }
    }

    // Aggregate leads by client with filtering
    const leadsByClient = await Lead.aggregate([
      // Apply filters first
      { $match: matchStage },
      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $unwind: "$client",
      },
      // Add client name filter if provided
      ...(clientName
        ? [
            {
              $match: {
                "client.name": { $regex: clientName, $options: "i" },
              },
            },
          ]
        : []),
      {
        $group: {
          _id: "$ownerId",
          clientName: { $first: "$client.name" },
          clientEmail: { $first: "$client.email" },
          totalLeads: { $sum: 1 },
          leads: {
            $push: {
              _id: "$_id",
              name: "$name",
              email: "$email",
              phone: "$phone",
              source: "$source",
              status: "$status",
              message: "$message",
              extraFields: "$extraFields",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
            },
          },
        },
      },
      {
        $sort: { clientName: 1 },
      },
    ]);

    res.status(200).json({
      success: true,
      count: leadsByClient.length,
      data: leadsByClient,
    });
  } catch (error) {
    console.error("Get all leads grouped by clients error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get leads for a specific client (Admin only)
const getClientLeadsById = async (req, res) => {
  try {
    const { clientId } = req.params;
    const { search, source, status, startDate, endDate } = req.query;

    // Build query
    const query = { ownerId: clientId };

    // Add search condition if search parameter exists
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    // Add source filter if provided
    if (source) {
      query.source = { $regex: source, $options: "i" };
    }

    // Add status filter if provided
    if (status) {
      query.status = { $regex: status, $options: "i" };
    }

    // Add date range filter if provided
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Get client leads by ID error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid client ID format",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* PUBLIC API */

// Create lead via public API
const createLeadFromWebhook = async (req, res) => {
  try {
    const { name, email, phone, source, message, ...extraFields } = req.body;

    const lead = await Lead.create({
      ownerId: req.apiKey.clientId, // Use the client ID from the API key
      name,
      email,
      phone,
      source, // Default source to 'API' if not provided
      message,
      extraFields: new Map(Object.entries(extraFields)), // Convert extra fields to Map
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (error) {
    console.error("Create public lead error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  createLead,
  getClientLeads,
  getLeadById,
  updateLead,
  deleteLead,
  getAllLeadsGroupedByClients,
  getClientLeadsById,
  createLeadFromWebhook,
};
