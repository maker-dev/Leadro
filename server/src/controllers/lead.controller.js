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

    // Handle owner filter and get shared accesses in one query
    let sharedAccesses = [];
    if (owner === "me") {
      query.ownerId = req.user.userId;
    } else if (owner === "anyone") {
      // Get shared accesses with read permission for query building
      sharedAccesses = await ClientAccess.find({
        sharedWithId: req.user.userId,
        permissions: { $in: ["read"] },
        status: "active",
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

    // Optimize permission mapping - only get permissions for shared leads we actually have
    const sharedLeadOwnerIds = leads
      .filter((lead) => lead.ownerId.toString() !== req.user.userId)
      .map((lead) => lead.ownerId);

    let permissionsMap = new Map();
    if (sharedLeadOwnerIds.length > 0) {
      // Get permissions only for the owners of leads we actually have
      const relevantSharedAccesses = await ClientAccess.find({
        sharedWithId: req.user.userId,
        ownerId: { $in: sharedLeadOwnerIds },
        status: "active",
      });

      permissionsMap = new Map(
        relevantSharedAccesses.map((access) => [
          access.ownerId.toString(),
          access.permissions,
        ])
      );
    }

    // Add owner information and permissions to leads
    const leadsWithOwner = leads.map((lead) => {
      const isOwned = lead.ownerId.toString() === req.user.userId;
      const permissions = isOwned
        ? ["read", "update", "delete"]
        : permissionsMap.get(lead.ownerId.toString()) || [];

      return {
        ...lead,
        owner: isOwned ? "me" : "shared",
        sharedBy: isOwned ? null : lead.ownerId, // Will be populated with owner name
        permissions: permissions, // Include permissions for each lead
      };
    });

    // Populate owner names for shared leads
    if (leadsWithOwner.some((lead) => lead.owner === "shared")) {
      const ownerIds = [
        ...new Set(
          leadsWithOwner
            .filter((lead) => lead.owner === "shared")
            .map((lead) => lead.sharedBy)
        ),
      ];

      const owners = await User.find({ _id: { $in: ownerIds } }, "name");
      const ownerMap = new Map(
        owners.map((owner) => [owner._id.toString(), owner.name])
      );

      leadsWithOwner.forEach((lead) => {
        if (lead.owner === "shared" && lead.sharedBy) {
          lead.sharedBy =
            ownerMap.get(lead.sharedBy.toString()) || "Unknown Client";
        }
      });
    }

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

    // First, try to find lead owned by the user
    let lead = await Lead.findOne({ _id: id, ownerId: req.user.userId });
    let permissions = ["read", "update", "delete"]; // Default full permissions for own leads

    // If not found, check if user has read access through ClientAccess
    if (!lead) {
      // Get shared access records for this user
      const sharedAccesses = await ClientAccess.find({
        sharedWithId: req.user.userId,
        permissions: { $in: ["read"] },
        status: "active", // Only include active sharing relationships
      });

      const sharedOwnerIds = sharedAccesses.map((access) => access.ownerId);

      // Try to find lead owned by users who have shared with this user
      if (sharedOwnerIds.length > 0) {
        lead = await Lead.findOne({
          _id: id,
          ownerId: { $in: sharedOwnerIds },
        });

        // If found, get the specific permissions for this lead's owner
        if (lead) {
          const specificAccess = await ClientAccess.findOne({
            sharedWithId: req.user.userId,
            ownerId: lead.ownerId,
            status: "active",
          });
          permissions = specificAccess ? specificAccess.permissions : [];
        }
      }
    }

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or unauthorized",
      });
    }

    const leadObj = lead.toObject();
    leadObj.extraFields = Object.fromEntries(leadObj.extraFields); // Convert Map to plain object

    // Add permissions to the lead data
    const leadWithPermissions = {
      ...leadObj,
      permissions: permissions,
    };

    res.status(200).json({
      success: true,
      data: leadWithPermissions,
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

    // First, try to find lead owned by the user
    let lead = await Lead.findOne({ _id: id, ownerId: req.user.userId });

    // If not found, check if user has update access through ClientAccess
    if (!lead) {
      // Get shared access records for this user with update permission
      const sharedAccesses = await ClientAccess.find({
        sharedWithId: req.user.userId,
        permissions: { $in: ["update"] },
        status: "active", // Only include active sharing relationships
      });

      const sharedOwnerIds = sharedAccesses.map((access) => access.ownerId);

      // Try to find lead owned by users who have shared with this user
      if (sharedOwnerIds.length > 0) {
        lead = await Lead.findOne({
          _id: id,
          ownerId: { $in: sharedOwnerIds },
        });
      }
    }

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
    const { id } = req.params;

    // First, try to find lead owned by the user
    let lead = await Lead.findOne({
      _id: id,
      ownerId: req.user.userId,
    });

    // If not found, check if user has delete access through ClientAccess
    if (!lead) {
      // Get shared access records for this user with delete permission
      const sharedAccesses = await ClientAccess.find({
        sharedWithId: req.user.userId,
        permissions: { $in: ["delete"] },
        status: "active", // Only include active sharing relationships
      });

      const sharedOwnerIds = sharedAccesses.map((access) => access.ownerId);

      // Try to find lead owned by users who have shared with this user
      if (sharedOwnerIds.length > 0) {
        lead = await Lead.findOne({
          _id: id,
          ownerId: { $in: sharedOwnerIds },
        });
      }
    }

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found or unauthorized",
      });
    }

    // Delete the lead
    await lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete lead error:", error);
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

/* ADMIN API */

// Get all leads from all clients with client information (Admin only)
const getAllClientsLeads = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      search,
      status,
      source,
      startDate,
      endDate,
    } = req.query;

    // Build query
    const query = {};

    // Note: We'll handle search after populating client data
    // since we need to search in client name too

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

    // Get leads with pagination and populate client information
    let leads = await Lead.find(query)
      .populate("ownerId", "name")
      .sort({ createdAt: -1 })
      .lean();

    // Apply search across all fields including client name
    if (search) {
      leads = leads.filter((lead) => {
        const searchLower = search.toLowerCase();
        const leadName = (lead.name || "").toLowerCase();
        const leadEmail = (lead.email || "").toLowerCase();
        const leadPhone = (lead.phone || "").toLowerCase();
        const clientName = (lead.ownerId?.name || "").toLowerCase();

        return (
          leadName.includes(searchLower) ||
          leadEmail.includes(searchLower) ||
          leadPhone.includes(searchLower) ||
          clientName.includes(searchLower)
        );
      });
    }

    // Get total count after client name filtering
    const totalItems = leads.length;
    const totalPages = Math.ceil(totalItems / limitNum);

    // Apply pagination
    const skip = (pageNum - 1) * limitNum;
    leads = leads.slice(skip, skip + limitNum);

    // Format leads with client information
    const leadsWithClient = leads.map((lead) => ({
      ...lead,
      clientName: lead.ownerId?.name || "Unknown Client",
      ownerId: lead.ownerId?._id || lead.ownerId,
    }));

    res.status(200).json({
      success: true,
      data: {
        leads: leadsWithClient,
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
    console.error("Get all clients leads error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get lead by ID (Admin only)
const getAdminLeadById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find lead without ownership restriction (admin can view any lead)
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    console.error("Get admin lead by ID error:", error);
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

// Update lead (Admin only)
const updateAdminLead = async (req, res) => {
  try {
    const { name, email, phone, source, message, status, ...extraFields } =
      req.body;

    // Lead is already validated and attached to request by middleware
    const lead = req.lead;

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
    const updatedLead = await Lead.findByIdAndUpdate(lead._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    console.error("Update admin lead error:", error);
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

// Create lead for a client (Admin only)
const createLeadForClient = async (req, res) => {
  try {
    const {
      clientEmail,
      name,
      email,
      phone,
      source,
      message,
      status,
      ...extraFields
    } = req.body;

    // Check if the client exists by email
    const client = await User.findOne({ email: clientEmail, role: "client" });

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Create the lead
    const lead = await Lead.create({
      ownerId: client._id, // Assign to the specified client
      name: name !== undefined ? name : null,
      email,
      phone: phone !== undefined ? phone : null,
      source: source !== undefined ? source : null,
      message: message !== undefined ? message : null,
      status: status || "new", // Default to "new" if not provided
      extraFields: new Map(Object.entries(extraFields)), // Convert extra fields to Map
    });

    res.status(201).json({
      success: true,
      message: "Lead created successfully for client",
      data: lead,
    });
  } catch (error) {
    console.error("Create lead for client error:", error);
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

// Delete lead (Admin only)
const deleteAdminLead = async (req, res) => {
  try {
    // Lead is already validated and attached to request by middleware
    await req.lead.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    console.error("Delete admin lead error:", error);
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
    const { name, email, phone, source, message, status, ...extraFields } =
      req.body;

    const lead = await Lead.create({
      ownerId: req.apiKey.clientId, // Use the client ID from the API key
      name,
      email,
      phone,
      source,
      message,
      status: status || "new", // Default to "new" if not provided
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
  getAdminLeadById,
  updateLead,
  updateAdminLead,
  deleteLead,
  getAllClientsLeads,
  createLeadForClient,
  deleteAdminLead,
  createLeadFromWebhook,
};
