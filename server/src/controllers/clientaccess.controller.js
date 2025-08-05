import ClientAccess from "../models/ClientAccess.js";

const inviteClient = async (req, res) => {
  try {
    let { permissions } = req.body;

    // targetClient is already validated and stored in req by the validation middleware
    const targetClient = req.targetClient;

    // If 'update' or 'delete' is present, ensure 'read' is also included
    if (
      permissions &&
      (permissions.includes("update") || permissions.includes("delete")) &&
      !permissions.includes("read")
    ) {
      permissions.push("read");
    }

    // Create new invitation with pending status
    const clientAccess = await ClientAccess.create({
      ownerId: req.user.userId,
      sharedWithId: targetClient._id,
      permissions: permissions || ["read"], // Use default read permission if not specified
      status: "pending", // Explicitly set status to pending for invitations
    });

    // Populate owner and shared with details for response
    const populatedAccess = await ClientAccess.findById(clientAccess._id)
      .populate("ownerId", "name email")
      .populate("sharedWithId", "name email");

    res.status(201).json({
      success: true,
      message: "Client invitation sent successfully",
      data: {
        id: populatedAccess._id,
        owner: populatedAccess.ownerId,
        invitedClient: populatedAccess.sharedWithId,
        permissions: populatedAccess.permissions,
        status: populatedAccess.status,
        createdAt: populatedAccess.createdAt,
        updatedAt: populatedAccess.updatedAt,
      },
    });
  } catch (error) {
    console.error("Invite client error:", error);
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

const getSharedWithMe = async (req, res) => {
  try {
    // Find all ClientAccess records where the current user is the sharedWithId
    const sharedWithMe = await ClientAccess.find({
      sharedWithId: req.user.userId,
    })
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    // Format the response data
    const data = sharedWithMe.map((access) => ({
      owner: access.ownerId, // { name, email, _id }
      permissions: access.permissions,
      sharedAt: access.createdAt,
      status: access.status,
      id: access._id,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get shared with me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getSharedByMe = async (req, res) => {
  try {
    // Find all ClientAccess records where the current user is the ownerId
    const sharedByMe = await ClientAccess.find({ ownerId: req.user.userId })
      .populate("sharedWithId", "name email")
      .sort({ createdAt: -1 });

    // Format the response data
    const data = sharedByMe.map((access) => ({
      sharedWith: access.sharedWithId, // { name, email, _id }
      permissions: access.permissions,
      sharedAt: access.createdAt,
      status: access.status,
      id: access._id,
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Get shared by me error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateSharingPermissions = async (req, res) => {
  try {
    let { permissions } = req.body;

    // If 'update' or 'delete' is present, ensure 'read' is also included
    if (
      (permissions.includes("update") || permissions.includes("delete")) &&
      !permissions.includes("read")
    ) {
      permissions.push("read");
    }

    // Remove duplicates just in case
    permissions = [...new Set(permissions)];

    const access = req.access;

    // Update permissions
    access.permissions = permissions;
    await access.save();

    res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      data: {
        id: access._id,
        permissions: access.permissions,
        updatedAt: access.updatedAt,
      },
    });
  } catch (error) {
    console.error("Update sharing permissions error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid access ID format.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const removeSharingAccess = async (req, res) => {
  try {
    const access = req.access;

    // Only owner can remove sharing (already checked in validation)
    await access.deleteOne();
    res.status(200).json({
      success: true,
      message: "Sharing removed successfully.",
    });
  } catch (error) {
    console.error("Remove sharing access error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const respondToSharingInvitation = async (req, res) => {
  try {
    const { action } = req.body; // "accept" or "reject"
    const access = req.access;

    if (action === "accept") {
      // Update status to active
      access.status = "active";
      await access.save();

      res.status(200).json({
        success: true,
        message: "Sharing invitation accepted successfully.",
        data: {
          id: access._id,
          status: access.status,
          updatedAt: access.updatedAt,
        },
      });
    } else if (action === "reject") {
      // Remove the sharing relationship
      await access.deleteOne();

      res.status(200).json({
        success: true,
        message: "Sharing invitation rejected successfully.",
        data: {
          removedAccessId: access._id,
          removedAt: new Date(),
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'accept' or 'reject'.",
      });
    }
  } catch (error) {
    console.error("Respond to sharing invitation error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  getSharedWithMe,
  getSharedByMe,
  updateSharingPermissions,
  removeSharingAccess,
  respondToSharingInvitation,
  inviteClient,
};
