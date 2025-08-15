import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import ApiKey from "../models/ApiKey.js";
import ClientAccess from "../models/ClientAccess.js";
import Lead from "../models/Lead.js";

const isProduction = process.env.NODE_ENV === "production";

//Client APIS

const clientRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "client", // Set role as client for registration
    });

    // Generate email verification token
    const emailVerificationToken = jwt.sign(
      { userId: user._id },
      process.env.EMAIL_SECRET,
      { expiresIn: "20h" }
    );

    const emailVerificationUrl = `${process.env.BACKEND_URL}/api/users/client/verify-email?token=${emailVerificationToken}`;

    //send email verification email
    await sendEmail({
      to: email,
      subject: "Email Verification",
      html: `Click <a href="${emailVerificationUrl}">here</a> to verify your email`,
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const clientVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    await User.findByIdAndUpdate(decoded.userId, { isEmailVerified: true });

    // Redirect to frontend with success status
    return res.redirect(
      `${process.env.FRONTEND_URL}/email-verified?status=success`
    );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Redirect to frontend with token-expired status
      return res.redirect(
        `${process.env.FRONTEND_URL}/email-verified?status=token-expired`
      );
    }

    console.error("Email verification error:", err);
    // Redirect to frontend with error status
    return res.redirect(
      `${process.env.FRONTEND_URL}/email-verified?status=error`
    );
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const user = req.user; // User is now available from validation middleware

    // Generate new email verification token
    const emailVerificationToken = jwt.sign(
      { userId: user._id },
      process.env.EMAIL_SECRET,
      { expiresIn: "20h" }
    );

    const emailVerificationUrl = `${process.env.BACKEND_URL}/api/users/client/verify-email?token=${emailVerificationToken}`;

    // Send new verification email
    await sendEmail({
      to: user.email,
      subject: "Email Verification - New Link",
      html: `Click <a href="${emailVerificationUrl}">here</a> to verify your email`,
    });

    res.status(200).json({
      success: true,
      message: "Verification email has been resent",
    });
  } catch (error) {
    console.error("Resend verification email error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Admin APIS

const getAllClients = async (req, res) => {
  try {
    // Find all users with client role, excluding password
    const clients = await User.find({
      role: "client",
      isEmailVerified: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients,
    });
  } catch (error) {
    console.error("Get all clients error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAllClientsWithPagination = async (req, res) => {
  try {
    const { page = 1, limit = 8, search } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build query
    const query = { role: "client", isEmailVerified: true };

    // If search is provided, search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } }, // i = case-insensitive
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count
    const totalItems = await User.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limitNum);

    // Fetch clients with pagination
    const clients = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    res.status(200).json({
      success: true,
      data: {
        clients,
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
    console.error("Get all clients error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateAdminClientProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email } = req.body;

    const user = await User.findById(userId);

    if (name) user.name = name;
    if (email && email.toLowerCase() !== user.email) {
      user.email = email.toLowerCase();
      user.isEmailVerified = false;

      // Generate email verification token
      const emailVerificationToken = jwt.sign(
        { userId: user._id },
        process.env.EMAIL_SECRET,
        { expiresIn: "20h" }
      );

      const emailVerificationUrl = `${process.env.BACKEND_URL}/api/users/client/verify-email?token=${emailVerificationToken}`;

      //send email verification email
      await sendEmail({
        to: email,
        subject: "Email Verification",
        html: `Click <a href="${emailVerificationUrl}">here</a> to verify your new email`,
      });
    }

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Update client profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getClientById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists and is a client
    const user = await User.findById(userId).select("-password");
    if (!user || user.role !== "client") {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get client by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteClientByAdmin = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists and is a client
    const user = await User.findById(userId);
    if (!user || user.role !== "client") {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // Delete all API keys belonging to the client
    await ApiKey.deleteMany({ clientId: userId });

    // Delete all ClientAccess where user is owner or sharedWith
    await ClientAccess.deleteMany({
      $or: [{ ownerId: userId }, { sharedWithId: userId }],
    });

    // Delete all Leads owned by the client
    await Lead.deleteMany({ ownerId: userId });

    // Delete the client user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Client account and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete client by admin error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//Hybrid APIS

const login = async (req, res) => {
  try {
    const user = req.user; // Already validated and fetched

    // Generate JWT tokens
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Customize message by role
    const message = "Login successful";

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message,
        token,
        data: userResponse,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token not found. Please log in.",
      });
    }

    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET,
      async (err, decoded) => {
        if (err) {
          res.clearCookie("refreshToken");
          return res.status(403).json({
            success: false,
            message: "Invalid or expired refresh token. Please log in again.",
          });
        }

        const user = await User.findById(decoded.userId);

        if (!user) {
          res.clearCookie("refreshToken");
          return res
            .status(403)
            .json({ success: false, message: "User not found." });
        }

        const newAccessToken = jwt.sign(
          { userId: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({
          success: true,
          message: "Token refreshed successfully",
          token: newAccessToken,
        });
      }
    );
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    });
    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const changeName = async (req, res) => {
  try {
    const user = req.user;

    const { name } = req.body;

    // Update the user's name
    user.name = name;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: "Name updated successfully",
      data: userResponse,
    });
  } catch (error) {
    console.error("Change name error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Delete all API keys belonging to the user
    await ApiKey.deleteMany({ clientId: userId });

    // Delete all ClientAccess where user is owner or sharedWith
    await ClientAccess.deleteMany({
      $or: [{ ownerId: userId }, { sharedWithId: userId }],
    });

    // Delete all Leads owned by the user
    await Lead.deleteMany({ ownerId: userId });

    // Delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account and all related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {
  clientRegister,
  login,
  refreshToken,
  getProfile,
  getAllClients,
  getAllClientsWithPagination,
  getClientById,
  updateAdminClientProfile,
  deleteClientByAdmin,
  clientVerifyEmail,
  resendVerificationEmail,
  logout,
  changeName,
  deleteAccount,
};
