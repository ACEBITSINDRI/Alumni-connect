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
};
