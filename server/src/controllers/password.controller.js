import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/User.js';

const forgotPassword = async (req, res) => {
    try {
        // User is already validated and attached to request by middleware
        const user = req.user;

        // Generate password reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.RESET_SECRET, { expiresIn: '1h' });

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Create email content
        const emailContent = `
            <h1>Password Reset Request</h1>
            <p>You requested to reset your password. Click the link below to reset it:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            html: emailContent
        });

        res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process password reset request'
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        // User and password are already validated by middleware
        const { password } = req.body;
        const user = req.user;

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update user's password
        await User.findByIdAndUpdate(user._id, {
            password: hashedPassword
        });

        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully'
        });

    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password'
        });
    }
};

export {
    forgotPassword,
    resetPassword
};
