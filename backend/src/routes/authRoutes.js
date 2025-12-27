import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  googleLogin,
  getMe,
  logout,
  updateFCMToken,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { uploadRegistrationFiles, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Validation rules (updated for Firebase)
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
  // Password not required for Firebase auth (handled on client side)
];

const loginValidation = [
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
  // Firebase ID token will be verified in middleware
];

const googleLoginValidation = [
  body('role').isIn(['student', 'alumni']).withMessage('Role must be student or alumni'),
];

const fcmTokenValidation = [
  body('fcmToken').trim().notEmpty().withMessage('FCM token is required'),
];

// Routes (Firebase-based)
router.post('/register', uploadRegistrationFiles, handleUploadError, registerValidation, validate, register);
router.post('/login', protect, loginValidation, validate, login);
router.post('/google-login', protect, googleLoginValidation, validate, googleLogin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.post('/fcm-token', protect, fcmTokenValidation, validate, updateFCMToken);

// Note: Password reset is now handled by Firebase on client side
// No need for forgot-password, reset-password, update-password endpoints

export default router;
