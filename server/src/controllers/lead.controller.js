import Lead from "../models/Lead.js";
import ClientAccess from "../models/ClientAccess.js";
import User from "../models/User.js";

/* CLIENT API */

// Create new lead
const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, message, status, ...extraFields } =
      req.body;

    const lead = await Lead.create({
      ownerId: req.user.userId, // Assign to current user
      name,
      email,
      phone,
      source,
      message,
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

// Get all leads for a client
const getClientLeads = async (req, res) => {
  try {
    // Get leads where ownerId matches the current user's ID
    const leads = await Lead.find({ ownerId: req.user.userId }).sort({
      createdAt: -1,
    }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
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
    const updateData = {};

    // Dynamically build update object only with provided fields
    const allowedFields = [
      "name",
      "email",
      "phone",
      "source",
      "message",
      "status",
    ];
    allowedFields.forEach((field) => {
      if (field in req.body) {
        updateData[field] = req.body[field];
      }
    });

    // Find lead and verify ownership
    const lead = await Lead.findOne({ _id: id, ownerId: req.user.userId });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or unauthorized",
      });
    }

    // Handle extra fields separately while preserving existing ones
    const existingExtraFields = Object.fromEntries(
      lead.extraFields || new Map()
    );
    const newExtraFields = Object.keys(req.body)
      .filter((key) => !allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    // Merge existing and new extra fields
    const mergedExtraFields = { ...existingExtraFields, ...newExtraFields };

    if (Object.keys(mergedExtraFields).length > 0) {
      updateData.extraFields = new Map(Object.entries(mergedExtraFields));
    }

    // Update only if there are changes
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
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

// Filter/Search leads
const filterLeads = async (req, res) => {
  try {
    const { search, source, status } = req.query;
    const query = { ownerId: req.user.userId };

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

    const leads = await Lead.find(query).sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Filter leads error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all leads that are being shared with the current client (not their own leads)
const getLeadsSharedWithMe = async (req, res) => {
  try {
    // Find all ClientAccess records where the current user is sharedWithId and has 'read' permission
    const sharedAccesses = await ClientAccess.find({
      sharedWithId: req.user.userId,
      permissions: { $in: ["read"] },
    });

    // Collect all ownerIds who have shared with this user (exclude self)
    const sharedOwnerIds = sharedAccesses
      .map((access) => access.ownerId.toString())
      .filter((ownerId) => ownerId !== req.user.userId);

    if (sharedOwnerIds.length === 0) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    // Get leads where ownerId is in the set (exclude current user's own leads)
    const leads = await Lead.find({ ownerId: { $in: sharedOwnerIds } })
      .sort({ createdAt: -1 })
      .lean();

    // Get owner info for each ownerId
    const owners = await User.find(
      { _id: { $in: sharedOwnerIds } },
      "name email"
    ).lean();
    const ownerMap = {};
    owners.forEach((owner) => {
      ownerMap[owner._id.toString()] = owner;
    });

    // Group leads by owner
    const grouped = {};
    leads.forEach((lead) => {
      const ownerId = lead.ownerId.toString();
      if (!grouped[ownerId]) {
        grouped[ownerId] = {
          owner: ownerMap[ownerId] || { _id: ownerId, name: "", email: "" },
          leads: [],
        };
      }
      grouped[ownerId].leads.push(lead);
    });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: Object.values(grouped),
    });
  } catch (error) {
    console.error("Get leads shared with me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all leads for a certain client, if shared with the current user, using ClientAccess _id
const getLeadsSharedByClient = async (req, res) => {
  try {
    const access = req.access;

    // Get all leads for the owner of this access
    const leads = await Lead.find({ ownerId: access.ownerId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    console.error("Get leads shared by client error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update a shared lead (if user has 'update' permission via ClientAccess)
const updateSharedLead = async (req, res) => {
  try {
    const { leadId } = req.params;
    const lead = req.lead;
    // Dynamically build update object only with provided fields
    const allowedFields = [
      "name",
      "email",
      "phone",
      "source",
      "message",
      "status",
    ];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (field in req.body) {
        updateData[field] = req.body[field];
      }
    });
    // Handle extra fields
    const existingExtraFields = Object.fromEntries(
      lead.extraFields || new Map()
    );
    const newExtraFields = Object.keys(req.body)
      .filter((key) => !allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});
    const mergedExtraFields = { ...existingExtraFields, ...newExtraFields };
    if (Object.keys(mergedExtraFields).length > 0) {
      updateData.extraFields = new Map(Object.entries(mergedExtraFields));
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }
    const updatedLead = await Lead.findByIdAndUpdate(leadId, updateData, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update shared lead error:", error);
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

// Delete a shared lead (if user has 'delete' permission via ClientAccess)
const deleteSharedLead = async (req, res) => {
  try {
    const lead = req.lead;
    await lead.deleteOne();
    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete shared lead error:", error);
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
  getLeadsSharedWithMe,
  updateLead,
  deleteLead,
  filterLeads,
  getAllLeadsGroupedByClients,
  getClientLeadsById,
  createLeadFromWebhook,
  getLeadsSharedByClient,
  updateSharedLead,
  deleteSharedLead,
};
