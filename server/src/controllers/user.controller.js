import bcrypt from 'bcrypt';
import User from '../models/User.js';
import jwt from 'jsonwebtoken'

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

const getClientProfile = async (req, res) => {
  try {
    
    const user = req.user;
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Get client profile error:', error);
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

const getAdminProfile = async (req, res) => {
  try {
    const user = req.user;
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      data: userResponse
    });

  } catch (error) {
    console.error('Get admin profile error:', error);
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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export {
  clientRegister,
  clientLogin,
  getClientProfile,
  adminLogin,
  getAdminProfile,
  getAllClients,
  getAllUsers,
};