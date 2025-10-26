import express from 'express';
import {
  getAllUsers,
  searchUsers,
  getUserById,
  updateProfile,
  uploadProfilePictureHandler,
  getConnections,
  getSuggestedConnections,
  getUserStats,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// User routes
router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/connections', getConnections);
router.get('/suggestions', getSuggestedConnections);
router.get('/stats', getUserStats);
router.get('/:id', getUserById);

// Profile update routes
router.put('/profile', updateProfile);
router.put('/profile-picture', upload.single('profilePicture'), uploadProfilePictureHandler);

export default router;
