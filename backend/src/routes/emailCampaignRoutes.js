import express from 'express';
import {
  getStats,
  getUsersList,
  sendWelcome,
  sendEvent,
  sendCustom,
  sendTest,
} from '../controllers/emailCampaignController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, isAdmin);

// GET routes
router.get('/stats', getStats);
router.get('/users', getUsersList);

// POST routes
router.post('/welcome', sendWelcome);
router.post('/event', sendEvent);
router.post('/custom', sendCustom);
router.post('/test', sendTest);

export default router;
