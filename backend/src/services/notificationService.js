import admin from '../config/firebase.js';
import Notification from '../models/Notification.js';
import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';

/**
 * Comprehensive Firebase Cloud Messaging (FCM) Notification Service
 * Handles push notifications, in-app notifications, and notification management
 */

/**
 * Send push notification via FCM to a single user
 * @param {String} userId - MongoDB user ID
 * @param {Object} notificationData - Notification content
 * @returns {Promise<Object>}
 */
export const sendPushNotification = async (userId, notificationData) => {
  try {
    // Find user in either Alumni or Student collection
    let user = await AlumniModel.findById(userId);
    if (!user) {
      user = await StudentModel.findById(userId);
    }

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.fcmToken) {
      console.log(`User ${userId} has no FCM token registered`);
      return { success: false, reason: 'no_fcm_token' };
    }

    const { title, body, data = {}, imageUrl, actionUrl } = notificationData;

    const message = {
      notification: {
        title,
        body,
        ...(imageUrl && { imageUrl }),
      },
      data: {
        ...data,
        actionUrl: actionUrl || '/',
        clickAction: actionUrl || '/',
      },
      token: user.fcmToken,
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo.png',
          badge: '/badge.png',
          ...(imageUrl && { image: imageUrl }),
          requireInteraction: false,
          vibrate: [200, 100, 200],
        },
        fcmOptions: {
          link: actionUrl || '/',
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log('✅ FCM notification sent successfully:', response);

    return {
      success: true,
      messageId: response,
      userId,
    };
  } catch (error) {
    console.error('❌ Error sending FCM notification:', error);

    // Handle invalid/expired FCM tokens
    if (
      error.code === 'messaging/invalid-registration-token' ||
      error.code === 'messaging/registration-token-not-registered'
    ) {
      // Remove invalid FCM token from user
      const UserModel = user ? getUserModel(user.role) : AlumniModel;
      await UserModel.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
      console.log(`Removed invalid FCM token for user ${userId}`);
    }

    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }
};

/**
 * Send push notifications to multiple users
 * @param {Array<String>} userIds - Array of MongoDB user IDs
 * @param {Object} notificationData - Notification content
 * @returns {Promise<Object>}
 */
export const sendBulkPushNotifications = async (userIds, notificationData) => {
  try {
    // Find users in both collections
    const [alumniUsers, studentUsers] = await Promise.all([
      AlumniModel.find({
        _id: { $in: userIds },
        fcmToken: { $exists: true, $ne: null },
      }),
      StudentModel.find({
        _id: { $in: userIds },
        fcmToken: { $exists: true, $ne: null },
      }),
    ]);

    const users = [...alumniUsers, ...studentUsers];

    if (users.length === 0) {
      return { success: false, reason: 'no_users_with_fcm_tokens' };
    }

    const { title, body, data = {}, imageUrl, actionUrl } = notificationData;

    const tokens = users.map((user) => user.fcmToken);

    const message = {
      notification: {
        title,
        body,
        ...(imageUrl && { imageUrl }),
      },
      data: {
        ...data,
        actionUrl: actionUrl || '/',
        clickAction: actionUrl || '/',
      },
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo.png',
          badge: '/badge.png',
          ...(imageUrl && { image: imageUrl }),
          requireInteraction: false,
          vibrate: [200, 100, 200],
        },
        fcmOptions: {
          link: actionUrl || '/',
        },
      },
      tokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    console.log(`✅ Bulk FCM sent: ${response.successCount}/${tokens.length} successful`);

    // Handle failed tokens
    if (response.failureCount > 0) {
      const failedTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          failedTokens.push(tokens[idx]);
          console.error(`Failed to send to token ${idx}:`, resp.error);
        }
      });

      // Remove invalid tokens from both collections
      await Promise.all([
        AlumniModel.updateMany(
          { fcmToken: { $in: failedTokens } },
          { $unset: { fcmToken: 1 } }
        ),
        StudentModel.updateMany(
          { fcmToken: { $in: failedTokens } },
          { $unset: { fcmToken: 1 } }
        ),
      ]);
    }

    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      totalUsers: users.length,
    };
  } catch (error) {
    console.error('❌ Error sending bulk FCM notifications:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create in-app notification in MongoDB
 * @param {Object} notificationData - Notification details
 * @returns {Promise<Object>}
 */
export const createInAppNotification = async (notificationData) => {
  try {
    const {
      recipient,
      sender,
      type,
      title,
      message,
      actionUrl,
      relatedPost,
      relatedEvent,
      relatedOpportunity,
    } = notificationData;

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      actionUrl,
      relatedPost,
      relatedEvent,
      relatedOpportunity,
    });

    console.log(`✅ In-app notification created: ${notification._id}`);
    return notification;
  } catch (error) {
    console.error('❌ Error creating in-app notification:', error);
    throw error;
  }
};

/**
 * Send complete notification (Push + In-App)
 * @param {Object} params - Notification parameters
 * @returns {Promise<Object>}
 */
export const sendCompleteNotification = async ({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  actionUrl = '/',
  imageUrl = null,
  data = {},
  relatedPost = null,
  relatedEvent = null,
  relatedOpportunity = null,
  sendPush = true,
  sendInApp = true,
}) => {
  try {
    const results = {
      push: null,
      inApp: null,
    };

    // Create in-app notification
    if (sendInApp) {
      results.inApp = await createInAppNotification({
        recipient: recipientId,
        sender: senderId,
        type,
        title,
        message,
        actionUrl,
        relatedPost,
        relatedEvent,
        relatedOpportunity,
      });
    }

    // Send push notification
    if (sendPush) {
      results.push = await sendPushNotification(recipientId, {
        title,
        body: message,
        data: {
          ...data,
          type,
          notificationId: results.inApp?._id?.toString(),
        },
        imageUrl,
        actionUrl,
      });
    }

    return {
      success: true,
      results,
    };
  } catch (error) {
    console.error('❌ Error sending complete notification:', error);
    throw error;
  }
};

/**
 * Send topic-based notification (for broadcasting)
 * @param {String} topic - Topic name
 * @param {Object} notificationData - Notification content
 * @returns {Promise<Object>}
 */
export const sendTopicNotification = async (topic, notificationData) => {
  try {
    const { title, body, data = {}, imageUrl, actionUrl } = notificationData;

    const message = {
      notification: {
        title,
        body,
        ...(imageUrl && { imageUrl }),
      },
      data: {
        ...data,
        actionUrl: actionUrl || '/',
      },
      topic,
      webpush: {
        notification: {
          title,
          body,
          icon: '/logo.png',
          badge: '/badge.png',
          ...(imageUrl && { image: imageUrl }),
        },
        fcmOptions: {
          link: actionUrl || '/',
        },
      },
    };

    const response = await admin.messaging().send(message);
    console.log(`✅ Topic notification sent to "${topic}":`, response);

    return {
      success: true,
      messageId: response,
      topic,
    };
  } catch (error) {
    console.error('❌ Error sending topic notification:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Subscribe user to topic
 * @param {String} fcmToken - User's FCM token
 * @param {String} topic - Topic name
 * @returns {Promise<Object>}
 */
export const subscribeToTopic = async (fcmToken, topic) => {
  try {
    const response = await admin.messaging().subscribeToTopic(fcmToken, topic);
    console.log(`✅ Subscribed to topic "${topic}":`, response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Error subscribing to topic:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Unsubscribe user from topic
 * @param {String} fcmToken - User's FCM token
 * @param {String} topic - Topic name
 * @returns {Promise<Object>}
 */
export const unsubscribeFromTopic = async (fcmToken, topic) => {
  try {
    const response = await admin.messaging().unsubscribeFromTopic(fcmToken, topic);
    console.log(`✅ Unsubscribed from topic "${topic}":`, response);
    return { success: true, response };
  } catch (error) {
    console.error('❌ Error unsubscribing from topic:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Notification Templates for different event types
 */
export const NotificationTemplates = {
  // Connection Notifications
  CONNECTION_REQUEST: (senderName) => ({
    title: 'New Connection Request',
    message: `${senderName} sent you a connection request`,
    type: 'connection',
  }),

  CONNECTION_ACCEPTED: (senderName) => ({
    title: 'Connection Accepted',
    message: `${senderName} accepted your connection request`,
    type: 'connection',
  }),

  // Post Notifications
  POST_LIKE: (senderName, postPreview) => ({
    title: 'New Like',
    message: `${senderName} liked your post: "${postPreview}"`,
    type: 'like',
  }),

  POST_COMMENT: (senderName, postPreview) => ({
    title: 'New Comment',
    message: `${senderName} commented on your post: "${postPreview}"`,
    type: 'comment',
  }),

  POST_MENTION: (senderName, postPreview) => ({
    title: 'You were mentioned',
    message: `${senderName} mentioned you in a post: "${postPreview}"`,
    type: 'mention',
  }),

  // Message Notifications
  NEW_MESSAGE: (senderName, messagePreview) => ({
    title: 'New Message',
    message: `${senderName}: ${messagePreview}`,
    type: 'message',
  }),

  // Event Notifications
  EVENT_INVITATION: (eventName, eventDate) => ({
    title: 'New Event Invitation',
    message: `You're invited to "${eventName}" on ${eventDate}`,
    type: 'event',
  }),

  EVENT_REMINDER: (eventName, timeUntil) => ({
    title: 'Event Reminder',
    message: `"${eventName}" starts in ${timeUntil}`,
    type: 'event',
  }),

  EVENT_UPDATE: (eventName) => ({
    title: 'Event Updated',
    message: `Details for "${eventName}" have been updated`,
    type: 'event',
  }),

  // Opportunity Notifications
  NEW_JOB_POSTED: (jobTitle, company) => ({
    title: 'New Job Opportunity',
    message: `${jobTitle} at ${company}`,
    type: 'opportunity',
  }),

  INTERNSHIP_POSTED: (title, company) => ({
    title: 'New Internship',
    message: `${title} at ${company}`,
    type: 'opportunity',
  }),

  // Mentorship Notifications
  MENTORSHIP_REQUEST: (senderName) => ({
    title: 'Mentorship Request',
    message: `${senderName} requested you to be their mentor`,
    type: 'system',
  }),

  MENTORSHIP_ACCEPTED: (mentorName) => ({
    title: 'Mentorship Accepted',
    message: `${mentorName} accepted your mentorship request`,
    type: 'system',
  }),

  // Achievement Notifications
  PROFILE_VERIFIED: () => ({
    title: 'Profile Verified',
    message: 'Your profile has been verified successfully',
    type: 'achievement',
  }),

  MILESTONE_REACHED: (milestone) => ({
    title: 'Milestone Achieved!',
    message: `Congratulations! You've reached ${milestone}`,
    type: 'achievement',
  }),

  // System Notifications
  WELCOME: (userName) => ({
    title: 'Welcome to Alumni Connect!',
    message: `Hi ${userName}, start connecting with alumni and students`,
    type: 'system',
  }),

  ANNOUNCEMENT: (announcementTitle) => ({
    title: 'New Announcement',
    message: announcementTitle,
    type: 'system',
  }),
};

export default {
  sendPushNotification,
  sendBulkPushNotifications,
  createInAppNotification,
  sendCompleteNotification,
  sendTopicNotification,
  subscribeToTopic,
  unsubscribeFromTopic,
  NotificationTemplates,
};
