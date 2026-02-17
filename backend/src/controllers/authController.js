import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';
import { auth } from '../config/firebase.js';
import { uploadProfilePicture, uploadDocument } from '../services/firebaseStorage.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import {
  getLinkedInAuthUrl,
  exchangeCodeForToken,
  getLinkedInUserInfo,
  decodeLinkedInIdToken,
  createFirebaseUserFromLinkedIn,
} from '../services/linkedinAuth.service.js';

// Helper function to generate JWT tokens
const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
  );

  return { accessToken, refreshToken };
};

// @desc    Register user with Firebase
// @route   POST /api/auth/register
// @access  Public (supports both Firebase Auth and Email/Password)
export const register = async (req, res) => {
  try {
    // Log incoming request data
    console.log('[Register] Request received with:', {
      body: Object.keys(req.body),
      files: req.files ? Object.keys(req.files) : 'none',
    });

    const {
      firstName,
      lastName,
      email,
      password,
      role,
      firebaseUid,
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

    // Get Firebase user from multiple sources
    let firebaseUser;
    let createdFirebaseUser = false;

    if (req.firebaseUser) {
      // Case 1: Already authenticated via Firebase (from protect middleware)
      firebaseUser = req.firebaseUser;
    } else if (firebaseUid) {
      // Case 2: Firebase UID provided (Google Sign-In from frontend)
      try {
        firebaseUser = await auth.getUser(firebaseUid);
      } catch (error) {
        console.error('[Register] Invalid Firebase UID:', firebaseUid, error);
        return res.status(400).json({
          success: false,
          message: 'Invalid Firebase UID',
        });
      }
    } else if (email && password) {
      // Case 3: Email/Password registration - Create Firebase user automatically
      try {
        console.log('Creating Firebase user for email/password registration...');
        firebaseUser = await auth.createUser({
          email,
          password,
          emailVerified: false,
          displayName: `${firstName} ${lastName}`,
        });
        createdFirebaseUser = true;
        console.log('✅ Firebase user created:', firebaseUser.uid);
      } catch (firebaseError) {
        console.error('Firebase user creation error:', firebaseError);

        // If user already exists in Firebase, try to get existing user
        if (firebaseError.code === 'auth/email-already-exists') {
          try {
            firebaseUser = await auth.getUserByEmail(email);
            console.log('⚠️ Using existing Firebase user:', firebaseUser.uid);
            createdFirebaseUser = false; // Don't send verification email for existing Firebase user
          } catch (getUserError) {
            return res.status(400).json({
              success: false,
              message: 'Email already registered. Please login instead.',
            });
          }
        } else {
          console.error('[Register] Failed to create Firebase user:', email, firebaseError);
          return res.status(400).json({
            success: false,
            message: firebaseError.message || 'Failed to create Firebase user',
            error: firebaseError.code,
          });
        }
      }
    } else {
      console.error('[Register] Missing firebaseUid or email/password');
      return res.status(400).json({
        success: false,
        message: 'Please provide either firebaseUid (for Google Sign-In) or email & password for registration',
      });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !role) {
      console.error('[Register] Missing required fields in body:', { firstName, lastName, email, role });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: firstName, lastName, email, and role',
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
    const existingAlumni = await AlumniModel.findOne({
      $or: [{ email }, { firebaseUid: firebaseUser.uid }],
    });
    const existingStudent = await StudentModel.findOne({
      $or: [{ email }, { firebaseUid: firebaseUser.uid }],
    });

    if (existingAlumni || existingStudent) {
      console.error('[Register] User already exists in MongoDB:', { email, firebaseUid: firebaseUser.uid });
      return res.status(400).json({
        success: false,
        message: 'User with this email or Firebase account already exists',
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
      firebaseUid: firebaseUser.uid,
      role,
      batch,
      enrollmentNumber,
      phone,
      department: department || 'Civil Engineering',
      bio,
      isEmailVerified: true, // Auto-verify for production (SMTP blocked on Render free tier)
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
        userData.skills = typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : [];
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
        userData.mentorshipDomains =
          typeof mentorshipDomains === 'string'
            ? mentorshipDomains.split(',').map((d) => d.trim())
            : [];
      }
    }

    // Create user
    const user = await UserModel.create(userData);

    // Generate verification token and send email (for email/password signups)
    if (createdFirebaseUser) {
      const verificationToken = await user.generateVerificationToken();
      await user.save();

      // Send verification email in background (don't wait)
      import('../utils/email.js').then(({ sendVerificationEmail }) => {
        sendVerificationEmail(
          user.email,
          verificationToken,
          `${user.firstName} ${user.lastName}`
        ).then(() => {
          console.log('✅ Verification email sent to:', user.email);
        }).catch((emailError) => {
          console.error('❌ Failed to send verification email:', emailError);
        });
      });
    }

    // Handle file uploads if present
    try {
      if (req.files) {
        // Upload profile picture if provided
        if (req.files.profilePicture && req.files.profilePicture[0]) {
          const profilePicResult = await uploadProfilePicture(
            req.files.profilePicture[0].buffer,
            firebaseUser.uid,
            req.files.profilePicture[0].originalname
          );
          user.profilePicture = profilePicResult.url;
        }

        // Upload ID card if provided (mainly for students)
        if (req.files.idCard && req.files.idCard[0]) {
          const idCardResult = await uploadDocument(
            req.files.idCard[0].buffer,
            firebaseUser.uid,
            req.files.idCard[0].originalname
          );
          // Store ID card URL in a custom field or as part of documents
          if (!user.documents) user.documents = {};
          user.documents.idCard = idCardResult.url;
        }

        // Save user with uploaded file URLs
        await user.save();
      }
    } catch (uploadError) {
      // Log the error but don't fail registration
      console.error('File upload error:', uploadError);
      console.log('Continuing registration without file uploads');
    }

    // Generate custom Firebase token for immediate login (for email/password users)
    let customToken = null;
    if (createdFirebaseUser) {
      try {
        customToken = await auth.createCustomToken(firebaseUser.uid);
        console.log('✅ Custom token generated for new user');
      } catch (tokenError) {
        console.error('Error generating custom token:', tokenError);
        // Don't fail registration, user can login separately
      }
    }

    // Generate JWT tokens for API authentication
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: user.getPublicProfile(),
        firebaseUid: firebaseUser.uid,
        accessToken,
        refreshToken,
        ...(customToken && { customToken }), // Include custom token for email/password users
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error stack:', error.stack);

    // Cleanup: If we created a Firebase user but MongoDB user creation failed, delete the Firebase user
    if (createdFirebaseUser && firebaseUser) {
      try {
        await auth.deleteUser(firebaseUser.uid);
        console.log('Cleaned up Firebase user after registration failure');
      } catch (cleanupError) {
        console.error('Failed to cleanup Firebase user:', cleanupError);
      }
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error during registration',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.toString(),
        stack: error.stack,
      }),
    });
  }
};

// @desc    Login user with Firebase
// @route   POST /api/auth/login
// @access  Public (but requires Firebase ID token)
export const login = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Please provide role',
      });
    }

    // Firebase user already verified by middleware
    const firebaseUid = req.firebaseUser.uid;

    // Get appropriate model
    const UserModel = getUserModel(role);

    // Find user by Firebase UID
    const user = await UserModel.findOne({ firebaseUid });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found. Please complete registration.',
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated',
      });
    }

    // Update last active
    user.lastActive = new Date();
    await user.save();

    // Generate JWT tokens for API authentication
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

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

// @desc    Google login/signup
// @route   POST /api/auth/google-login
// @access  Public (but requires Firebase ID token)
export const googleLogin = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'alumni'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required',
      });
    }

    // Firebase user already verified by middleware
    const firebaseUser = req.firebaseUser;

    // Check if user exists in MongoDB
    let user = await AlumniModel.findOne({ firebaseUid: firebaseUser.uid });
    let userRole = 'alumni';

    if (!user) {
      user = await StudentModel.findOne({ firebaseUid: firebaseUser.uid });
      userRole = 'student';
    }

    let isNewUser = false;

    // If user doesn't exist, create new profile
    if (!user) {
      const UserModel = getUserModel(role);

      const [firstName, ...lastNameParts] = (firebaseUser.displayName || firebaseUser.email.split('@')[0]).split(' ');

      user = await UserModel.create({
        firstName: firstName || 'User',
        lastName: lastNameParts.join(' ') || '',
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        role,
        batch: '', // Will be updated during profile completion
        isEmailVerified: firebaseUser.email_verified || false,
        profilePicture: firebaseUser.picture || '',
      });

      isNewUser = true;
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    // Check if profile needs completion (for Google users)
    const needsProfileCompletion = isNewUser && (!user.batch || !user.phone);

    // Generate JWT tokens for API authentication
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.status(200).json({
      success: true,
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      data: {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken,
        isNewUser,
        needsProfileCompletion,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during Google authentication',
    });
  }
};

// @desc    LinkedIn login/signup
// @route   POST /api/auth/linkedin-login
// @access  Public (but requires Firebase ID token)
export const linkedInLogin = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role || !['student', 'alumni'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role is required',
      });
    }

    // Firebase user already verified by middleware
    const firebaseUser = req.firebaseUser;

    // Check if user exists in MongoDB
    let user = await AlumniModel.findOne({ firebaseUid: firebaseUser.uid });
    let userRole = 'alumni';

    if (!user) {
      user = await StudentModel.findOne({ firebaseUid: firebaseUser.uid });
      userRole = 'student';
    }

    let isNewUser = false;

    // If user doesn't exist, create new profile
    if (!user) {
      const UserModel = getUserModel(role);

      const [firstName, ...lastNameParts] = (firebaseUser.displayName || firebaseUser.email.split('@')[0]).split(' ');

      user = await UserModel.create({
        firstName: firstName || 'User',
        lastName: lastNameParts.join(' ') || '',
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        role,
        batch: '', // Will be updated during profile completion
        isEmailVerified: firebaseUser.email_verified || false,
        profilePicture: firebaseUser.picture || '',
      });

      isNewUser = true;
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    // Check if profile needs completion (for LinkedIn users)
    const needsProfileCompletion = isNewUser && (!user.batch || !user.phone);

    // Generate JWT tokens for API authentication
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    res.status(200).json({
      success: true,
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      data: {
        user: user.getPublicProfile(),
        accessToken,
        refreshToken,
        isNewUser,
        needsProfileCompletion,
      },
    });
  } catch (error) {
    console.error('LinkedIn login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during LinkedIn authentication',
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user.getPublicProfile(),
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
    // Clear FCM token if present
    if (req.user.fcmToken) {
      req.user.fcmToken = undefined;
      await req.user.save();
    }

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

// @desc    Update FCM token
// @route   POST /api/auth/fcm-token
// @access  Private
export const updateFCMToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;

    if (!fcmToken) {
      return res.status(400).json({
        success: false,
        message: 'FCM token is required',
      });
    }

    req.user.fcmToken = fcmToken;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'FCM token updated successfully',
    });
  } catch (error) {
    console.error('FCM token update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating FCM token',
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash the token to compare with stored hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with this token that hasn't expired
    let user = await AlumniModel.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      user = await StudentModel.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      });
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Send welcome email
    try {
      const { sendWelcomeEmail } = await import('../utils/email.js');
      await sendWelcomeEmail(
        user.email,
        `${user.firstName} ${user.lastName}`,
        user.role
      );
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }

    res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now login.',
      data: {
        email: user.email,
        isEmailVerified: true,
      },
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying email',
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address',
      });
    }

    // Find user by email
    let user = await AlumniModel.findOne({ email });
    if (!user) {
      user = await StudentModel.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified',
      });
    }

    // Generate new verification token
    const verificationToken = await user.generateVerificationToken();
    await user.save();

    // Send verification email
    const { sendVerificationEmail } = await import('../utils/email.js');
    await sendVerificationEmail(
      user.email,
      verificationToken,
      `${user.firstName} ${user.lastName}`
    );

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully',
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending verification email',
    });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email address',
      });
    }

    // Find user by email
    let user = await AlumniModel.findOne({ email });
    if (!user) {
      user = await StudentModel.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    const { sendPasswordResetEmail } = await import('../utils/email.js');
    await sendPasswordResetEmail(
      user.email,
      resetToken,
      `${user.firstName} ${user.lastName}`
    );

    res.status(200).json({
      success: true,
      message: 'Password reset email sent successfully',
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending password reset email',
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const crypto = require('crypto');

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a password with at least 6 characters',
      });
    }

    // Hash the token to compare with stored hashed token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with this token that hasn't expired
    let user = await AlumniModel.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      user = await StudentModel.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
    }

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Update Firebase password too if Firebase user exists
    if (user.firebaseUid) {
      try {
        await auth.updateUser(user.firebaseUid, { password });
      } catch (firebaseError) {
        console.error('Failed to update Firebase password:', firebaseError);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Password reset successful! You can now login with your new password.',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password',
    });
  }
};

// @desc    Initiate LinkedIn OAuth flow
// @route   GET /api/auth/linkedin
// @access  Public
export const linkedInAuth = async (req, res) => {
  try {
    const { role } = req.query;

    if (!role || !['student', 'alumni'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Valid role (student or alumni) is required',
      });
    }

    // Generate state parameter to prevent CSRF
    const state = Buffer.from(JSON.stringify({ role, timestamp: Date.now() })).toString('base64');

    // Create redirect URI (backend callback)
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://alumni-connect-backend-g28e.onrender.com'
      : `http://localhost:${process.env.PORT || 5000}`;
    const redirectUri = `${baseUrl}/api/auth/linkedin/callback`;

    // Get LinkedIn authorization URL
    const authUrl = getLinkedInAuthUrl(state, redirectUri);

    // Redirect to LinkedIn
    res.redirect(authUrl);
  } catch (error) {
    console.error('LinkedIn auth initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating LinkedIn authentication',
    });
  }
};

// @desc    Handle LinkedIn OAuth callback
// @route   GET /api/auth/linkedin/callback
// @access  Public
export const linkedInCallback = async (req, res) => {
  try {
    const { code, state, error } = req.query;

    // Handle OAuth errors
    if (error) {
      console.error('LinkedIn OAuth error:', error);
      return res.redirect(`${process.env.FRONTEND_URL.split(',')[0]}/login?error=${encodeURIComponent('LinkedIn authentication failed')}`);
    }

    if (!code) {
      return res.redirect(`${process.env.FRONTEND_URL.split(',')[0]}/login?error=${encodeURIComponent('No authorization code received')}`);
    }

    // Decode state to get role
    let role;
    try {
      const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
      role = stateData.role;
    } catch {
      return res.redirect(`${process.env.FRONTEND_URL.split(',')[0]}/login?error=${encodeURIComponent('Invalid state parameter')}`);
    }

    // Exchange code for token
    const baseUrl = process.env.NODE_ENV === 'production'
      ? 'https://alumni-connect-backend-g28e.onrender.com'
      : `http://localhost:${process.env.PORT || 5000}`;
    const redirectUri = `${baseUrl}/api/auth/linkedin/callback`;
    const tokenData = await exchangeCodeForToken(code, redirectUri);

    // Get user info from LinkedIn ID token (more reliable than userinfo endpoint)
    let linkedInProfile;
    if (tokenData.id_token) {
      console.log('✅ Using ID token to get user info');
      linkedInProfile = decodeLinkedInIdToken(tokenData.id_token);
    } else {
      console.log('⚠️ No ID token found, falling back to userinfo endpoint');
      linkedInProfile = await getLinkedInUserInfo(tokenData.access_token);
    }

    // Create or get Firebase user
    const firebaseUser = await createFirebaseUserFromLinkedIn(linkedInProfile);

    // Check if user exists in MongoDB
    let user = await AlumniModel.findOne({ firebaseUid: firebaseUser.uid });
    let userRole = 'alumni';

    if (!user) {
      user = await StudentModel.findOne({ firebaseUid: firebaseUser.uid });
      userRole = 'student';
    }

    let isNewUser = false;

    // If user doesn't exist in MongoDB, create new profile
    if (!user) {
      const UserModel = getUserModel(role);

      const [firstName, ...lastNameParts] = (linkedInProfile.name || linkedInProfile.email.split('@')[0]).split(' ');

      user = await UserModel.create({
        firstName: firstName || 'User',
        lastName: lastNameParts.join(' ') || '',
        email: linkedInProfile.email,
        firebaseUid: firebaseUser.uid,
        role,
        batch: '',
        isEmailVerified: linkedInProfile.email_verified || true,
        profilePicture: linkedInProfile.picture || '',
      });

      isNewUser = true;
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    // Generate JWT tokens for API authentication
    const { accessToken, refreshToken } = generateTokens(user._id, user.role);

    // Generate custom Firebase token
    const firebaseToken = await auth.createCustomToken(firebaseUser.uid);

    // Check if profile needs completion
    const needsProfileCompletion = isNewUser && (!user.batch || !user.phone);

    // Redirect to frontend with tokens
    const params = new URLSearchParams({
      accessToken,
      refreshToken,
      firebaseToken,
      user: JSON.stringify(user.getPublicProfile()),
      isNewUser: isNewUser.toString(),
      needsProfileCompletion: needsProfileCompletion.toString(),
    });

    res.redirect(`${process.env.FRONTEND_URL.split(',')[0]}/auth/linkedin/success?${params.toString()}`);
  } catch (error) {
    console.error('LinkedIn callback error:', error);
    res.redirect(`${process.env.FRONTEND_URL.split(',')[0]}/login?error=${encodeURIComponent('LinkedIn authentication failed')}`);
  }
};

// @desc    Get profile completion status
// @route   GET /api/auth/profile-status
// @access  Private
export const getProfileStatus = async (req, res) => {
  try {
    // Validate req.user exists
    if (!req.user || !req.user._id || !req.user.role) {
      console.error('Missing user data in getProfileStatus:', { user: req.user });
      return res.status(401).json({
        success: false,
        message: 'Authentication failed. User data missing.',
      });
    }

    const user = await getUserModel(req.user.role).findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Calculate profile completion percentage
    const requiredFields = ['firstName', 'lastName', 'batch', 'currentRole', 'company', 'bio'];
    const completedFields = requiredFields.filter(field => {
      if (field === 'firstName' || field === 'lastName') {
        return user[field] && user[field].toString().trim().length > 0;
      }
      if (field === 'batch') {
        return user[field] && user[field].toString().trim().length > 0;
      }
      if (field === 'currentRole') {
        return user[field] && user[field].toString().trim().length > 0;
      }
      if (field === 'company') {
        return user[field] && user[field].toString().trim().length > 0;
      }
      if (field === 'bio') {
        return user[field] && user[field].toString().trim().length > 0;
      }
      return false;
    });

    const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);

    // Get missing fields
    const missingFields = requiredFields.filter(field => !completedFields.includes(field));

    // Update user's profile completion status
    user.profileCompletionPercentage = completionPercentage;
    user.completedFields = completedFields;
    user.profileComplete = completionPercentage === 100;
    await user.save();

    res.status(200).json({
      success: true,
      data: {
        profileComplete: user.profileComplete,
        completionPercentage,
        completedFields,
        missingFields,
        hasSeenModal: user.hasSeenProfileCompletionModal,
      },
    });
  } catch (error) {
    console.error('Error getting profile status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile status',
    });
  }
};

// @desc    Mark profile completion modal as seen
// @route   PATCH /api/auth/mark-modal-seen
// @access  Private
export const markProfileModalAsSeen = async (req, res) => {
  try {
    const user = await getUserModel(req.user.role).findByIdAndUpdate(
      req.user._id,
      { hasSeenProfileCompletionModal: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Error marking modal as seen:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark modal as seen',
    });
  }
};
