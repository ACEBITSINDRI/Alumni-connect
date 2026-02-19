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

// Public routes (no authentication required)
router.get('/', getAllUsers);
router.get('/search', searchUsers);
router.get('/:id', getUserById);

// Protected routes (authentication required)
router.use(protect);

router.get('/connections', getConnections);
router.get('/suggestions', getSuggestedConnections);
router.get('/stats', getUserStats);

// Profile update routes
router.put('/profile', updateProfile);
router.put('/profile-picture', upload.single('profilePicture'), uploadProfilePictureHandler);

export default router;
