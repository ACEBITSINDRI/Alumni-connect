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

/**
 * ============================================
 * NOTIFICATION PREFERENCE CHECKER
 * ============================================
 */

/**
 * Check if user wants to receive specific type of notification
 * @param {Object} user - User document
 * @param {String} notificationType - Type: 'connections', 'posts', 'comments', 'likes', 'messages', 'events', 'jobs', 'mentorship'
 * @param {String} channel - Channel: 'push', 'email', 'inApp'
 * @returns {Boolean}
 */
export const shouldSendNotification = (user, notificationType, channel = 'push') => {
  if (!user || !user.notificationPreferences) {
    return true; // Send by default if preferences not set
  }

  const prefs = user.notificationPreferences;

  if (channel === 'push') {
    return prefs.pushNotifications?.enabled && prefs.pushNotifications?.[notificationType];
  } else if (channel === 'email') {
    return prefs.emailNotifications?.enabled && prefs.emailNotifications?.[notificationType];
  } else if (channel === 'inApp') {
    return prefs.inAppNotifications?.enabled;
  }

  return true;
};

/**
 * ============================================
 * SPECIALIZED NOTIFICATION FUNCTIONS
 * ============================================
 */

/**
 * Send Event Reminder Notification
 * @param {String} eventId - Event ID
 * @param {String} eventName - Event name
 * @param {Date} eventDate - Event date
 * @param {Array} participants - Array of participant user IDs
 * @param {String} timeUntil - Human-readable time (e.g., "1 hour", "1 day")
 * @returns {Promise<Object>}
 */
export const sendEventReminderNotification = async ({
  eventId,
  eventName,
  eventDate,
  participants,
  timeUntil,
}) => {
  try {
    const notificationData = NotificationTemplates.EVENT_REMINDER(eventName, timeUntil);
    const results = [];

    for (const participantId of participants) {
      // Find user
      let user = await AlumniModel.findById(participantId);
      if (!user) {
        user = await StudentModel.findById(participantId);
      }

      if (!user) continue;

      // Check preferences
      const sendPush = shouldSendNotification(user, 'events', 'push');
      const sendEmail = shouldSendNotification(user, 'events', 'email');
      const sendInApp = shouldSendNotification(user, 'events', 'inApp');

      // Send notifications based on preferences
      const result = await sendCompleteNotification({
        recipientId: participantId,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: `/events/${eventId}`,
        relatedEvent: eventId,
        sendPush,
        sendInApp,
      });

      // Send email if enabled
      if (sendEmail) {
        // Import email service dynamically to avoid circular dependency
        const { sendEventReminderEmail } = await import('../utils/email.js');
        await sendEventReminderEmail(
          user.email,
          `${user.firstName} ${user.lastName}`,
          eventName,
          eventDate,
          `/events/${eventId}`
        );
      }

      results.push(result);
    }

    console.log(`✅ Event reminders sent to ${results.length} participants`);
    return { success: true, count: results.length };
  } catch (error) {
    console.error('❌ Error sending event reminders:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Job/Opportunity Alert Notification
 * @param {String} jobId - Job/Opportunity ID
 * @param {String} jobTitle - Job title
 * @param {String} company - Company name
 * @param {String} location - Job location
 * @param {Array} targetUserIds - Array of user IDs to notify (optional)
 * @returns {Promise<Object>}
 */
export const sendJobAlertNotification = async ({
  jobId,
  jobTitle,
  company,
  location,
  targetUserIds = null,
}) => {
  try {
    const notificationData = NotificationTemplates.NEW_JOB_POSTED(jobTitle, company);
    const results = [];

    // If specific users targeted, notify them
    if (targetUserIds && targetUserIds.length > 0) {
      for (const userId of targetUserIds) {
        let user = await AlumniModel.findById(userId);
        if (!user) {
          user = await StudentModel.findById(userId);
        }

        if (!user) continue;

        const sendPush = shouldSendNotification(user, 'jobs', 'push');
        const sendEmail = shouldSendNotification(user, 'jobs', 'email');
        const sendInApp = shouldSendNotification(user, 'jobs', 'inApp');

        const result = await sendCompleteNotification({
          recipientId: userId,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          actionUrl: `/opportunities/${jobId}`,
          relatedOpportunity: jobId,
          sendPush,
          sendInApp,
        });

        // Send email if enabled
        if (sendEmail) {
          const { sendNewJobEmail } = await import('../utils/email.js');
          await sendNewJobEmail(
            user.email,
            `${user.firstName} ${user.lastName}`,
            jobTitle,
            company,
            location,
            `/opportunities/${jobId}`
          );
        }

        results.push(result);
      }
    } else {
      // Broadcast to all users who want job notifications
      const [alumniUsers, studentUsers] = await Promise.all([
        AlumniModel.find({ 'notificationPreferences.pushNotifications.jobs': true }).select('_id email firstName lastName'),
        StudentModel.find({ 'notificationPreferences.pushNotifications.jobs': true }).select('_id email firstName lastName'),
      ]);

      const allUsers = [...alumniUsers, ...studentUsers];

      for (const user of allUsers) {
        const sendPush = shouldSendNotification(user, 'jobs', 'push');
        const sendEmail = shouldSendNotification(user, 'jobs', 'email');
        const sendInApp = shouldSendNotification(user, 'jobs', 'inApp');

        const result = await sendCompleteNotification({
          recipientId: user._id,
          type: notificationData.type,
          title: notificationData.title,
          message: notificationData.message,
          actionUrl: `/opportunities/${jobId}`,
          relatedOpportunity: jobId,
          sendPush,
          sendInApp,
        });

        if (sendEmail) {
          const { sendNewJobEmail } = await import('../utils/email.js');
          await sendNewJobEmail(
            user.email,
            `${user.firstName} ${user.lastName}`,
            jobTitle,
            company,
            location,
            `/opportunities/${jobId}`
          );
        }

        results.push(result);
      }
    }

    console.log(`✅ Job alerts sent to ${results.length} users`);
    return { success: true, count: results.length };
  } catch (error) {
    console.error('❌ Error sending job alerts:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Mentorship Notification
 * @param {String} mentorId - Mentor user ID
 * @param {String} menteeId - Mentee user ID
 * @param {String} type - 'request' or 'accepted'
 * @param {String} message - Optional custom message
 * @returns {Promise<Object>}
 */
export const sendMentorshipNotification = async ({
  mentorId,
  menteeId,
  type = 'request',
  message = null,
}) => {
  try {
    let recipientId, senderId, notificationData;

    // Find both users
    let mentor = await AlumniModel.findById(mentorId);
    if (!mentor) {
      mentor = await StudentModel.findById(mentorId);
    }

    let mentee = await AlumniModel.findById(menteeId);
    if (!mentee) {
      mentee = await StudentModel.findById(menteeId);
    }

    if (!mentor || !mentee) {
      throw new Error('Mentor or mentee not found');
    }

    if (type === 'request') {
      recipientId = mentorId;
      senderId = menteeId;
      notificationData = NotificationTemplates.MENTORSHIP_REQUEST(
        `${mentee.firstName} ${mentee.lastName}`
      );
    } else if (type === 'accepted') {
      recipientId = menteeId;
      senderId = mentorId;
      notificationData = NotificationTemplates.MENTORSHIP_ACCEPTED(
        `${mentor.firstName} ${mentor.lastName}`
      );
    }

    // Check preferences
    const recipient = type === 'request' ? mentor : mentee;
    const sendPush = shouldSendNotification(recipient, 'mentorship', 'push');
    const sendEmail = shouldSendNotification(recipient, 'mentorship', 'email');
    const sendInApp = shouldSendNotification(recipient, 'mentorship', 'inApp');

    // Send notifications
    const result = await sendCompleteNotification({
      recipientId,
      senderId,
      type: notificationData.type,
      title: notificationData.title,
      message: message || notificationData.message,
      actionUrl: `/profile/${senderId}`,
      sendPush,
      sendInApp,
    });

    // Send email if enabled
    if (sendEmail) {
      const { sendMentorshipRequestEmail } = await import('../utils/email.js');
      await sendMentorshipRequestEmail(
        recipient.email,
        `${recipient.firstName} ${recipient.lastName}`,
        type === 'request' ? `${mentee.firstName} ${mentee.lastName}` : `${mentor.firstName} ${mentor.lastName}`,
        mentee.batch || 'N/A',
        mentee.department || 'N/A',
        `/profile/${senderId}`
      );
    }

    console.log(`✅ Mentorship ${type} notification sent`);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Error sending mentorship notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send Message Notification
 * @param {String} recipientId - Recipient user ID
 * @param {String} senderId - Sender user ID
 * @param {String} messagePreview - Preview of the message
 * @param {String} conversationId - Conversation ID
 * @returns {Promise<Object>}
 */
export const sendMessageNotification = async ({
  recipientId,
  senderId,
  messagePreview,
  conversationId,
}) => {
  try {
    // Find both users
    let sender = await AlumniModel.findById(senderId);
    if (!sender) {
      sender = await StudentModel.findById(senderId);
    }

    let recipient = await AlumniModel.findById(recipientId);
    if (!recipient) {
      recipient = await StudentModel.findById(recipientId);
    }

    if (!sender || !recipient) {
      throw new Error('Sender or recipient not found');
    }

    const senderName = `${sender.firstName} ${sender.lastName}`;
    const notificationData = NotificationTemplates.NEW_MESSAGE(senderName, messagePreview);

    // Check preferences
    const sendPush = shouldSendNotification(recipient, 'messages', 'push');
    const sendEmail = shouldSendNotification(recipient, 'messages', 'email');
    const sendInApp = shouldSendNotification(recipient, 'messages', 'inApp');

    // Send notifications
    const result = await sendCompleteNotification({
      recipientId,
      senderId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      actionUrl: `/messages/${conversationId}`,
      sendPush,
      sendInApp,
    });

    // Send email if enabled (less aggressive - only for first message or if user hasn't been active)
    const timeSinceLastActive = Date.now() - new Date(recipient.lastActive).getTime();
    const oneHour = 60 * 60 * 1000;

    if (sendEmail && timeSinceLastActive > oneHour) {
      const { sendNewMessageEmail } = await import('../utils/email.js');
      await sendNewMessageEmail(
        recipient.email,
        `${recipient.firstName} ${recipient.lastName}`,
        senderName,
        messagePreview,
        `/messages/${conversationId}`
      );
    }

    console.log(`✅ Message notification sent to ${recipientId}`);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Error sending message notification:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate Weekly Digest for a user
 * @param {String} userId - User ID
 * @returns {Promise<Object>}
 */
export const generateWeeklyDigest = async (userId) => {
  try {
    // Find user
    let user = await AlumniModel.findById(userId);
    if (!user) {
      user = await StudentModel.findById(userId);
    }

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user wants weekly digest
    if (!shouldSendNotification(user, 'weeklyDigest', 'email')) {
      console.log(`User ${userId} has disabled weekly digest`);
      return { success: true, skipped: true };
    }

    // Calculate date range (last 7 days)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // Gather stats from last week
    const stats = {
      newConnections: 0,
      newMessages: 0,
      postLikes: 0,
      postComments: 0,
      eventsAttending: 0,
      newJobs: 0,
      profileViews: 0,
    };

    // Get new connections
    const recentConnections = user.connections.filter(conn => {
      return new Date(conn.createdAt) > oneWeekAgo;
    });
    stats.newConnections = recentConnections.length;

    // Get notifications from last week
    const recentNotifications = await Notification.find({
      recipient: userId,
      createdAt: { $gte: oneWeekAgo },
    });

    // Count different types
    stats.newMessages = recentNotifications.filter(n => n.type === 'message').length;
    stats.postLikes = recentNotifications.filter(n => n.type === 'like').length;
    stats.postComments = recentNotifications.filter(n => n.type === 'comment').length;
    stats.eventsAttending = recentNotifications.filter(n => n.type === 'event').length;
    stats.newJobs = recentNotifications.filter(n => n.type === 'opportunity').length;

    // Send weekly digest email
    const { sendWeeklyDigestEmail } = await import('../utils/email.js');
    await sendWeeklyDigestEmail(
      user.email,
      `${user.firstName} ${user.lastName}`,
      stats
    );

    console.log(`✅ Weekly digest sent to ${user.email}`);
    return { success: true, stats };
  } catch (error) {
    console.error('❌ Error generating weekly digest:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate Weekly Digest for all users
 * Called by cron job every Sunday
 * @returns {Promise<Object>}
 */
export const generateAllWeeklyDigests = async () => {
  try {
    console.log('📊 Starting weekly digest generation for all users...');

    // Get all users who have weekly digest enabled
    const [alumniUsers, studentUsers] = await Promise.all([
      AlumniModel.find({ 'notificationPreferences.emailNotifications.weeklyDigest': true }).select('_id'),
      StudentModel.find({ 'notificationPreferences.emailNotifications.weeklyDigest': true }).select('_id'),
    ]);

    const allUsers = [...alumniUsers, ...studentUsers];
    console.log(`Found ${allUsers.length} users with weekly digest enabled`);

    const results = [];
    for (const user of allUsers) {
      const result = await generateWeeklyDigest(user._id);
      results.push(result);

      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const successCount = results.filter(r => r.success).length;
    console.log(`✅ Weekly digests completed: ${successCount}/${allUsers.length} successful`);

    return {
      success: true,
      totalUsers: allUsers.length,
      successCount,
      failureCount: allUsers.length - successCount,
    };
  } catch (error) {
    console.error('❌ Error generating weekly digests:', error);
    return { success: false, error: error.message };
  }
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
  // New specialized notification functions
  shouldSendNotification,
  sendEventReminderNotification,
  sendJobAlertNotification,
  sendMentorshipNotification,
  sendMessageNotification,
  generateWeeklyDigest,
  generateAllWeeklyDigests,
};
