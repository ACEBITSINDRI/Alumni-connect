import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';
import { auth } from '../config/firebase.js';
import { uploadProfilePicture, uploadDocument } from '../services/firebaseStorage.js';

// @desc    Register user with Firebase
// @route   POST /api/auth/register
// @access  Public (but requires Firebase ID token)
export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
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

    // Get Firebase user from token (already verified by middleware or create manually)
    let firebaseUser;
    if (req.firebaseUser) {
      firebaseUser = req.firebaseUser;
    } else if (firebaseUid) {
      // Verify Firebase UID exists
      try {
        firebaseUser = await auth.getUser(firebaseUid);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: 'Invalid Firebase UID',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Firebase authentication required',
      });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !role) {
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
      isEmailVerified: firebaseUser.emailVerified || false,
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

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: {
        user: user.getPublicProfile(),
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    console.error('Error stack:', error.stack);
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

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.getPublicProfile(),
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
        isEmailVerified: firebaseUser.email_verified || false,
        profilePicture: firebaseUser.picture || '',
      });

      isNewUser = true;
    } else {
      // Update last active
      user.lastActive = new Date();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: isNewUser ? 'Account created successfully' : 'Login successful',
      data: {
        user: user.getPublicProfile(),
        isNewUser,
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
