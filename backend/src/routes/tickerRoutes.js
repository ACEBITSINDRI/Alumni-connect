import express from 'express';
import {
  getActiveTickerItems,
  getAllTickerItems,
  getTickerItemById,
  createTickerItem,
  updateTickerItem,
  deleteTickerItem,
  toggleTickerItem,
  trackClick,
  trackView,
  clearTickerCache,
} from '../controllers/tickerController.js';
import { protect, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getActiveTickerItems); // Get all active ticker items (aggregated)
router.post('/:id/track-click', trackClick); // Track click (no auth required)
router.post('/:id/track-view', trackView); // Track view (no auth required)

// Admin routes (require authentication + admin role)
router.get('/admin/all', protect, isAdmin, getAllTickerItems); // Get all ticker items (admin view)
router.post('/admin/clear-cache', protect, isAdmin, clearTickerCache); // Clear cache
router.get('/:id', protect, isAdmin, getTickerItemById); // Get single ticker item
router.post('/', protect, isAdmin, createTickerItem); // Create manual ticker item
router.put('/:id', protect, isAdmin, updateTickerItem); // Update ticker item
router.delete('/:id', protect, isAdmin, deleteTickerItem); // Delete ticker item
router.patch('/:id/toggle', protect, isAdmin, toggleTickerItem); // Toggle active status

export default router;
