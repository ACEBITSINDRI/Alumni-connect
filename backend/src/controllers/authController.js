import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import crypto from 'crypto';
import { uploadProfilePicture, uploadIdCard } from '../config/cloudinary.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      batch,
      enrollmentNumber,
      phone,
      currentRole,
      company,
      location,
      skills,
      linkedinUrl,
      githubUrl,
      portfolioUrl,
      bio,
      department,
      mentorshipAvailable,
      mentorshipDomains,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, password, and role',
      });
    }

    // Validate role
    if (!['student', 'alumni'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be either student or alumni',
      });
    }

    // Get appropriate model based on role
    const UserModel = getUserModel(role);

    // Check if user already exists in both collections
    const existingAlumni = await AlumniModel.findOne({ email });
    const existingStudent = await StudentModel.findOne({ email });

    if (existingAlumni || existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists',
      });
    }

    // Check enrollment number uniqueness if provided
    if (enrollmentNumber) {
      const existingEnrollment = await UserModel.findOne({ enrollmentNumber });
      if (existingEnrollment) {
        return res.status(400).json({
          success: false,
          message: 'Enrollment number already exists',
        });
      }
    }

    // Prepare user data
    const userData = {
      firstName,
      lastName,
      email,
      password,
      role,
      batch,
      enrollmentNumber,
      phone,
      department: department || 'Civil Engineering',
      bio,
    };

    // Add professional information (mainly for alumni)
    if (currentRole) userData.currentRole = currentRole;
    if (company) userData.company = company;
    if (location) userData.location = location;

    // Add social links
    if (linkedinUrl) userData.linkedinUrl = linkedinUrl;
    if (githubUrl) userData.githubUrl = githubUrl;
    if (portfolioUrl) userData.portfolioUrl = portfolioUrl;

    // Add skills (parse if it's a JSON string)
    if (skills) {
      try {
        userData.skills = Array.isArray(skills) ? skills : JSON.parse(skills);
      } catch (e) {
        // If it's a string, split by comma
        userData.skills = typeof skills === 'string' ? skills.split(',').map(s => s.trim()) : [];
      }
    }

    // Add mentorship info
    if (mentorshipAvailable !== undefined) {
      userData.mentorshipAvailable = mentorshipAvailable === 'true' || mentorshipAvailable === true;
    }
    if (mentorshipDomains) {
      try {
        userData.mentorshipDomains = Array.isArray(mentorshipDomains)
          ? mentorshipDomains
          : JSON.parse(mentorshipDomains);
      } catch (e) {
        // If it's a string, split by comma
        userData.mentorshipDomains = typeof mentorshipDomains === 'string'
          ? mentorshipDomains.split(',').map(d => d.trim())
          : [];
      }
    }

    // Create user first to get the ID
    const user = await UserModel.create(userData);

    // Handle file uploads if present
    try {
      if (req.files) {
        // Upload profile picture if provided
        if (req.files.profilePicture && req.files.profilePicture[0]) {
          const profilePicResult = await uploadProfilePicture(
            req.files.profilePicture[0].buffer,
            user._id.toString()
          );
          user.profilePicture = profilePicResult.url;
        }

        // Upload ID card if provided (mainly for students)
        if (req.files.idCard && req.files.idCard[0]) {
          const idCardResult = await uploadIdCard(
            req.files.idCard[0].buffer,
            user._id.toString()
          );
          // Store ID card URL in a custom field or as part of documents
          // You might want to add an idCardUrl field to the User schema
          if (!user.documents) user.documents = {};
          user.documents.idCard = idCardResult.url;
        }

        // Save user with uploaded file URLs
        await user.save();
      }
    } catch (uploadError) {
      // If file upload fails, delete the created user
      await UserModel.findByIdAndDelete(user._id);
      console.error('File upload error:', uploadError);
      return res.status(500).json({
        success: false,
        message: 'Failed to upload files. Please try again.',
      });
    }

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
    console.error('Error stack:', error.stack);
    res.status(500).json({
      success: false,
      message: error.message || 'Error during registration',
      ...(process.env.NODE_ENV === 'development' && { error: error.toString(), stack: error.stack }),
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
