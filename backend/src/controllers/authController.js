import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import crypto from 'crypto';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, batch, enrollmentNumber } = req.body;

    // Validate role
    if (!['student', 'alumni'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either student or alumni',
      });
    }

    // Get appropriate model based on role
    const UserModel = getUserModel(role);

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Create user
    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password,
      role,
      batch,
      enrollmentNumber,
      department: 'Civil Engineering',
    });

    // Generate tokens
    const accessToken = generateAccessToken(user._id, role);
    const refreshToken = generateRefreshToken(user._id, role);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during registration',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and role',
      });
    }

    // Get appropriate model
    const UserModel = getUserModel(role);

    // Find user and include password
    const user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id, role);
    const refreshToken = generateRefreshToken(user._id, role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during login',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id);

    res.status(200).json({
      success: true,
      data: user.getPublicProfile(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user data',
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  try {
    // In a production app, you might want to blacklist the token
    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error during logout',
    });
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email, role } = req.body;

    const UserModel = getUserModel(role);
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // TODO: Send email with reset link
    // const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to email',
      // In development, return the token
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing forgot password request',
    });
  }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, password, role } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const UserModel = getUserModel(role);
    const user = await UserModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating password',
    });
  }
};
