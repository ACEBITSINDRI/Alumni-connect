import { auth } from '../config/firebase.js';
import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';
import jwt from 'jsonwebtoken';

// Verify Firebase token only (doesn't require MongoDB user to exist)
export const verifyFirebaseToken = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.',
      });
    }

    try {
      // Verify Firebase ID token
      const decodedToken = await auth.verifyIdToken(token);

      // Attach Firebase user info to request object
      req.firebaseUser = decodedToken;

      next();
    } catch (error) {
      console.error('Firebase auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or has expired.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route. Please login.',
      });
    }

    try {
      // Verify JWT token (not Firebase ID token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      // Find user in MongoDB by user ID (check both collections)
      let user = await AlumniModel.findById(userId).select('-password');

      if (!user) {
        user = await StudentModel.findById(userId).select('-password');
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Please complete registration.',
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated.',
        });
      }

      // Check if email is verified
      if (!user.isEmailVerified) {
        return res.status(403).json({
          success: false,
          message: 'Please verify your email address to access this resource.',
          requiresVerification: true,
        });
      }

      // Attach user info to request object
      req.user = user;
      req.user.role = user.role; // Use role from database (can be 'student', 'alumni', or 'admin')

      next();
    } catch (error) {
      console.error('JWT auth error:', error);
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or has expired.',
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication',
    });
  }
};

// Middleware to check if user is alumni
export const isAlumni = (req, res, next) => {
  if (req.user && req.user.role === 'alumni') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'This action is only allowed for alumni',
    });
  }
};

// Middleware to check if user is student
export const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'This action is only allowed for students',
    });
  }
};

// Middleware to allow both alumni and students
export const isAlumniOrStudent = (req, res, next) => {
  if (req.user && (req.user.role === 'alumni' || req.user.role === 'student')) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied',
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required. This action is only allowed for administrators.',
    });
  }
};
