import express from 'express';
import {
  getStats,
  getUsersList,
  sendWelcome,
  sendEvent,
  sendCustom,
  sendTest,
  sendNewsletter,
} from '../controllers/emailCampaignController.js';
import { protect, isAdmin } from '../middleware/auth.js';
import { firebaseUpload } from '../middleware/firebaseUpload.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, isAdmin);

// GET routes
router.get('/stats', getStats);
router.get('/users', getUsersList);

// POST routes
router.post('/welcome', sendWelcome);
router.post('/event', sendEvent);
router.post('/custom', firebaseUpload, sendCustom);
router.post('/test', sendTest);
router.post('/newsletter', firebaseUpload, sendNewsletter);

export default router;
