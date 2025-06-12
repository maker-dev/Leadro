import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'
import sendEmail from '../utils/sendEmail.js';

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
      role: 'client' // Set role as client for registration
    });

    // Generate email verification token
    const emailVerificationToken = jwt.sign({ userId: user._id }, process.env.EMAIL_SECRET, { expiresIn: '20h' });

    const emailVerificationUrl = `${process.env.BACKEND_URL}/api/users/client/verify-email?token=${emailVerificationToken}`;

    //send email verification email
    await sendEmail({
      to: email,
      subject: 'Email Verification',
      html: `Click <a href="${emailVerificationUrl}">here</a> to verify your email`
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const clientVerifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.EMAIL_SECRET);
    await User.findByIdAndUpdate(decoded.userId, { isEmailVerified: true });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
    
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Email verification link has expired. Please request a new one.'
      });
    }

    console.error('Email verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

const clientLogin = async (req, res) => {
  try {
    // User is already validated and fetched in validation middleware
    const user = req.user;
    
    // Generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      data: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false, 
      message: 'Internal server error'
    });
  }
};


//Profile API (unified for both client and admin)

const getProfile = async (req, res) => {
  try {
    const user = req.user;
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

//Admin APIS

const adminLogin = async (req, res) => {
  try {
    // User is already validated and fetched in validation middleware
    const user = req.user;

    
    // Generate JWT token with admin flag
    const token = jwt.sign({ userId: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      data: userResponse
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getAllClients = async (req, res) => {
  try {
    // Find all users with client role, excluding password
    const clients = await User.find({ role: 'client' }).select('-password');
    
    res.status(200).json({
      success: true,
      count: clients.length,
      data: clients
    });

  } catch (error) {
    console.error('Get all clients error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Email verification API (unified for both client and admin)

const resendVerificationEmail = async (req, res) => {
  try {
    const user = req.user; // User is now available from validation middleware

    // Generate new email verification token
    const emailVerificationToken = jwt.sign({ userId: user._id }, process.env.EMAIL_SECRET, { expiresIn: '20h' });

    const emailVerificationUrl = `${process.env.BACKEND_URL}/api/users/client/verify-email?token=${emailVerificationToken}`;

    // Send new verification email
    await sendEmail({
      to: user.email,
      subject: 'Email Verification - New Link',
      html: `Click <a href="${emailVerificationUrl}">here</a> to verify your email`
    });

    res.status(200).json({
      success: true,
      message: 'Verification email has been resent'
    });

  } catch (error) {
    console.error('Resend verification email error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  clientRegister,
  clientLogin,
  getProfile,
  adminLogin,
  getAllClients,
  clientVerifyEmail,
  resendVerificationEmail,
};