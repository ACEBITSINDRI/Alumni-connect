import express from 'express';
import {
  getEvents,
  getUpcomingForTicker,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  toggleLikeEvent,
  addComment,
} from '../controllers/eventController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getEvents);
router.get('/upcoming/ticker', getUpcomingForTicker); // Must be BEFORE /:id to avoid conflict
router.get('/:id', getEventById);

// Protected routes (require authentication)
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.post('/:id/register', protect, registerForEvent);
router.post('/:id/like', protect, toggleLikeEvent);
router.post('/:id/comment', protect, addComment);

export default router;
