import express from 'express';
import {
  getOpportunities,
  getRecentForTicker,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  applyToOpportunity,
  toggleSaveOpportunity,
  updateApplicationStatus,
} from '../controllers/opportunityController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getOpportunities);
router.get('/recent/ticker', getRecentForTicker); // Must be BEFORE /:id to avoid conflict
router.get('/:id', getOpportunityById);

// Protected routes (require authentication)
router.post('/', protect, createOpportunity);
router.put('/:id', protect, updateOpportunity);
router.delete('/:id', protect, deleteOpportunity);
router.post('/:id/apply', protect, applyToOpportunity);
router.post('/:id/save', protect, toggleSaveOpportunity);
router.patch('/:id/applications/:applicationId', protect, updateApplicationStatus);

export default router;
