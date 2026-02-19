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
  getNotificationPreferences,
  updateNotificationPreferences,
  testEventReminder,
  testJobAlert,
  testMentorshipNotification,
  testMessageNotification,
  testWeeklyDigest,
  triggerAllWeeklyDigests,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes - require authentication
router.use(protect);

// === NOTIFICATION MANAGEMENT ===

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

// === NOTIFICATION PREFERENCES ===

// Get notification preferences
router.get('/preferences', getNotificationPreferences);

// Update notification preferences
router.put('/preferences', updateNotificationPreferences);

// === TESTING ENDPOINTS ===

// Send test notification
router.post('/test', sendTestNotification);

// Test event reminder
router.post('/test/event-reminder', testEventReminder);

// Test job alert
router.post('/test/job-alert', testJobAlert);

// Test mentorship notification
router.post('/test/mentorship', testMentorshipNotification);

// Test message notification
router.post('/test/message', testMessageNotification);

// Test weekly digest
router.post('/test/weekly-digest', testWeeklyDigest);

// === TOPIC MANAGEMENT ===

// Subscribe to topic
router.post('/subscribe/:topic', subscribeUserToTopic);

// Unsubscribe from topic
router.post('/unsubscribe/:topic', unsubscribeUserFromTopic);

// === ADMIN ENDPOINTS ===

// Send announcement (admin only)
router.post('/announcement', sendAnnouncement);

// Trigger all weekly digests (admin only)
router.post('/admin/weekly-digest', triggerAllWeeklyDigests);

export default router;
