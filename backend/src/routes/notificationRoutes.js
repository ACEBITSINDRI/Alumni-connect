import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  sendTestNotification,
  subscribeUserToTopic,
  unsubscribeUserFromTopic,
  sendAnnouncement,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// Get notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark as read
router.patch('/:id/read', markAsRead);

// Mark all as read
router.patch('/read-all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Delete all notifications
router.delete('/all', deleteAllNotifications);

// Send test notification
router.post('/test', sendTestNotification);

// Subscribe to topic
router.post('/subscribe/:topic', subscribeUserToTopic);

// Unsubscribe from topic
router.post('/unsubscribe/:topic', unsubscribeUserFromTopic);

// Send announcement (admin only)
router.post('/announcement', sendAnnouncement);

export default router;
