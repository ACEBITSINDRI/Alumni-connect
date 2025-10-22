import { verifyAccessToken } from '../utils/jwt.js';
import { getUserModel } from '../models/User.js';

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
      // Verify token
      const decoded = verifyAccessToken(token);

      // Get user from database
      const UserModel = getUserModel(decoded.role);
      const user = await UserModel.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found. Token invalid.',
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account has been deactivated.',
        });
      }

      // Attach user to request object
      req.user = user;
      req.user.role = decoded.role;

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is invalid or has expired.',
      });
    }
  } catch (error) {
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
