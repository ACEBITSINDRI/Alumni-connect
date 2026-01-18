import express from 'express';
import {
  getConversations,
  getMessages,
  sendMessage,
  markMessageAsRead,
  getUnreadMessageCount,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// Get all conversations
router.get('/conversations', getConversations);

// Get messages in a conversation
router.get('/conversations/:conversationId', getMessages);

// Send a message
router.post('/send', sendMessage);

// Mark message as read
router.patch('/:messageId/read', markMessageAsRead);

// Get unread message count
router.get('/unread-count', getUnreadMessageCount);

export default router;
