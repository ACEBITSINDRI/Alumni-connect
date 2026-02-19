import Notification from '../models/Notification.js';
import {
  sendCompleteNotification,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
} from '../services/notificationService.js';

/**
 * Get all notifications for the current user
 * @route GET /api/notifications
 */
export const getNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, isRead } = req.query;
    const userId = req.user._id;

    const query = {
      recipient: userId,
      isDeleted: false,
    };

    if (type) {
      query.type = type;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('sender', 'firstName lastName profilePicture role')
      .populate('relatedPost', 'content')
      .populate('relatedEvent', 'name date')
      .populate('relatedOpportunity', 'title company');

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalNotifications: total,
          limit: parseInt(limit),
        },
        unreadCount,
      },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message,
    });
  }
};

/**
 * Get unread notification count
 * @route GET /api/notifications/unread-count
 */
export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const count = await Notification.countDocuments({
      recipient: userId,
      isRead: false,
      isDeleted: false,
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unread count',
      error: error.message,
    });
  }
};

/**
 * Mark notification as read
 * @route PATCH /api/notifications/:id/read
 */
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { notification },
      message: 'Notification marked as read',
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message,
    });
  }
};

/**
 * Mark all notifications as read
 * @route PATCH /api/notifications/read-all
 */
export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: userId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.status(200).json({
      success: true,
      data: { modifiedCount: result.modifiedCount },
      message: `${result.modifiedCount} notifications marked as read`,
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message,
    });
  }
};

/**
 * Delete notification
 * @route DELETE /api/notifications/:id
 */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: userId },
      { isDeleted: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notification',
      error: error.message,
    });
  }
};

/**
 * Delete all notifications
 * @route DELETE /api/notifications/all
 */
export const deleteAllNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await Notification.updateMany(
      { recipient: userId },
      { isDeleted: true }
    );

    res.status(200).json({
      success: true,
      data: { deletedCount: result.modifiedCount },
      message: `${result.modifiedCount} notifications deleted`,
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete all notifications',
      error: error.message,
    });
  }
};

/**
 * Send test notification (for testing purposes)
 * @route POST /api/notifications/test
 */
export const sendTestNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    const result = await sendCompleteNotification({
      recipientId: userId,
      type: 'system',
      title: 'Test Notification',
      message: 'This is a test notification from Alumni Connect',
      actionUrl: '/dashboard',
      sendPush: true,
      sendInApp: true,
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Test notification sent successfully',
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message,
    });
  }
};

/**
 * Subscribe to notification topic
 * @route POST /api/notifications/subscribe/:topic
 */
export const subscribeUserToTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const user = req.user;

    if (!user.fcmToken) {
      return res.status(400).json({
        success: false,
        message: 'No FCM token found for this user',
      });
    }

    const result = await subscribeToTopic(user.fcmToken, topic);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to subscribe to topic',
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully subscribed to topic: ${topic}`,
    });
  } catch (error) {
    console.error('Error subscribing to topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to topic',
      error: error.message,
    });
  }
};

/**
 * Unsubscribe from notification topic
 * @route POST /api/notifications/unsubscribe/:topic
 */
export const unsubscribeUserFromTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    const user = req.user;

    if (!user.fcmToken) {
      return res.status(400).json({
        success: false,
        message: 'No FCM token found for this user',
      });
    }

    const result = await unsubscribeFromTopic(user.fcmToken, topic);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe from topic',
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      message: `Successfully unsubscribed from topic: ${topic}`,
    });
  } catch (error) {
    console.error('Error unsubscribing from topic:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from topic',
      error: error.message,
    });
  }
};

/**
 * Send announcement to all users (admin only)
 * @route POST /api/notifications/announcement
 */
export const sendAnnouncement = async (req, res) => {
  try {
    const { title, message, actionUrl, imageUrl } = req.body;

    // TODO: Add admin role check here
    // if (req.user.role !== 'admin') {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Only admins can send announcements',
    //   });
    // }

    const result = await sendTopicNotification('all-users', {
      title,
      body: message,
      actionUrl,
      imageUrl,
      data: { type: 'announcement' },
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send announcement',
        error: result.error,
      });
    }

    res.status(200).json({
      success: true,
      data: result,
      message: 'Announcement sent successfully',
    });
  } catch (error) {
    console.error('Error sending announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send announcement',
      error: error.message,
    });
  }
};

/**
 * Get user's notification preferences
 * @route GET /api/notifications/preferences
 */
export const getNotificationPreferences = async (req, res) => {
  try {
    const user = req.user;

    if (!user.notificationPreferences) {
      // Return default preferences if not set
      return res.status(200).json({
        success: true,
        data: {
          pushNotifications: {
            enabled: true,
            connections: true,
            posts: true,
            comments: true,
            likes: true,
            messages: true,
            events: true,
            jobs: true,
            mentorship: true,
          },
          emailNotifications: {
            enabled: true,
            connections: true,
            posts: false,
            comments: true,
            likes: false,
            messages: true,
            events: true,
            jobs: true,
            mentorship: true,
            weeklyDigest: true,
          },
          inAppNotifications: {
            enabled: true,
          },
        },
      });
    }

    res.status(200).json({
      success: true,
      data: user.notificationPreferences,
    });
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notification preferences',
    });
  }
};

/**
 * Update user's notification preferences
 * @route PUT /api/notifications/preferences
 */
export const updateNotificationPreferences = async (req, res) => {
  try {
    const { pushNotifications, emailNotifications, inAppNotifications } = req.body;
    const user = req.user;

    // Update preferences
    if (pushNotifications) {
      user.notificationPreferences.pushNotifications = {
        ...user.notificationPreferences.pushNotifications,
        ...pushNotifications,
      };
    }

    if (emailNotifications) {
      user.notificationPreferences.emailNotifications = {
        ...user.notificationPreferences.emailNotifications,
        ...emailNotifications,
      };
    }

    if (inAppNotifications) {
      user.notificationPreferences.inAppNotifications = {
        ...user.notificationPreferences.inAppNotifications,
        ...inAppNotifications,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Notification preferences updated successfully',
      data: user.notificationPreferences,
    });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification preferences',
    });
  }
};

/**
 * Test event reminder notification
 * @route POST /api/notifications/test/event-reminder
 */
export const testEventReminder = async (req, res) => {
  try {
    const { sendEventReminderNotification } = await import('../services/notificationService.js');

    const result = await sendEventReminderNotification({
      eventId: 'test-event-id',
      eventName: 'Test Event',
      eventDate: new Date(),
      participants: [req.user._id],
      timeUntil: '1 hour',
    });

    res.status(200).json({
      success: true,
      message: 'Event reminder sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error sending test event reminder:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send event reminder',
      error: error.message,
    });
  }
};

/**
 * Test job alert notification
 * @route POST /api/notifications/test/job-alert
 */
export const testJobAlert = async (req, res) => {
  try {
    const { sendJobAlertNotification } = await import('../services/notificationService.js');

    const result = await sendJobAlertNotification({
      jobId: 'test-job-id',
      jobTitle: 'Software Engineer',
      company: 'Test Company',
      location: 'Remote',
      targetUserIds: [req.user._id],
    });

    res.status(200).json({
      success: true,
      message: 'Job alert sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error sending test job alert:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send job alert',
      error: error.message,
    });
  }
};

/**
 * Test mentorship notification
 * @route POST /api/notifications/test/mentorship
 */
export const testMentorshipNotification = async (req, res) => {
  try {
    const { sendMentorshipNotification } = await import('../services/notificationService.js');
    const { menteeId, type } = req.body;

    if (!menteeId || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide menteeId and type (request or accepted)',
      });
    }

    const result = await sendMentorshipNotification({
      mentorId: req.user._id,
      menteeId,
      type,
    });

    res.status(200).json({
      success: true,
      message: 'Mentorship notification sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error sending test mentorship notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send mentorship notification',
      error: error.message,
    });
  }
};

/**
 * Test message notification
 * @route POST /api/notifications/test/message
 */
export const testMessageNotification = async (req, res) => {
  try {
    const { sendMessageNotification } = await import('../services/notificationService.js');
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide recipientId',
      });
    }

    const result = await sendMessageNotification({
      recipientId,
      senderId: req.user._id,
      messagePreview: 'This is a test message notification!',
      conversationId: 'test-conversation',
    });

    res.status(200).json({
      success: true,
      message: 'Message notification sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error sending test message notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message notification',
      error: error.message,
    });
  }
};

/**
 * Test weekly digest
 * @route POST /api/notifications/test/weekly-digest
 */
export const testWeeklyDigest = async (req, res) => {
  try {
    const { generateWeeklyDigest } = await import('../services/notificationService.js');

    const result = await generateWeeklyDigest(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Weekly digest generated successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error generating weekly digest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate weekly digest',
      error: error.message,
    });
  }
};

/**
 * Trigger all weekly digests (Admin only)
 * @route POST /api/notifications/admin/weekly-digest
 */
export const triggerAllWeeklyDigests = async (req, res) => {
  try {
    // TODO: Add admin check
    const { generateAllWeeklyDigests } = await import('../services/notificationService.js');

    const result = await generateAllWeeklyDigests();

    res.status(200).json({
      success: true,
      message: 'Weekly digests triggered successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error triggering weekly digests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to trigger weekly digests',
      error: error.message,
    });
  }
};

export default {
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
  // Notification Preferences
  getNotificationPreferences,
  updateNotificationPreferences,
  // Testing Endpoints
  testEventReminder,
  testJobAlert,
  testMentorshipNotification,
  testMessageNotification,
  testWeeklyDigest,
  triggerAllWeeklyDigests,
};
