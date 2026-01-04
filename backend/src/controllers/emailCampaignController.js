import {
  sendWelcomeEmail,
  sendEventAnnouncement,
  sendCustomAnnouncement,
  sendTestEmail,
  getEmailStats,
  getAllUsers,
  getAllFirebaseUsers,
} from '../services/emailCampaignService.js';

/**
 * @desc    Get email campaign statistics
 * @route   GET /api/email-campaigns/stats
 * @access  Admin
 */
export const getStats = async (req, res) => {
  try {
    const stats = await getEmailStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error getting email stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email statistics',
      error: error.message,
    });
  }
};

/**
 * @desc    Get list of users for email campaign
 * @route   GET /api/email-campaigns/users
 * @access  Admin
 */
export const getUsersList = async (req, res) => {
  try {
    const { role, batch, department } = req.query;

    const filters = {};
    if (role) filters.role = role;
    if (batch) filters.batch = batch;
    if (department) filters.department = department;

    const users = await getAllUsers(filters);

    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error('Error getting users list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get users list',
      error: error.message,
    });
  }
};

/**
 * @desc    Send welcome email campaign
 * @route   POST /api/email-campaigns/welcome
 * @access  Admin
 */
export const sendWelcome = async (req, res) => {
  try {
    const { role, batch, department } = req.body;

    const filters = {};
    if (role) filters.role = role;
    if (batch) filters.batch = batch;
    if (department) filters.department = department;

    const result = await sendWelcomeEmail(filters);

    res.json({
      success: result.success,
      message: result.message,
      data: result.results,
    });
  } catch (error) {
    console.error('Error sending welcome emails:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send welcome emails',
      error: error.message,
    });
  }
};

/**
 * @desc    Send event announcement campaign
 * @route   POST /api/email-campaigns/event
 * @access  Admin
 */
export const sendEvent = async (req, res) => {
  try {
    const {
      eventTitle,
      eventDate,
      eventTime,
      venue,
      eventType,
      organizer,
      registrationDeadline,
      description,
      customMessage,
      eventUrl,
      ctaText,
      // Filters
      role,
      batch,
      department,
    } = req.body;

    // Validate required fields
    if (!eventTitle || !eventDate) {
      return res.status(400).json({
        success: false,
        message: 'Event title and date are required',
      });
    }

    const eventData = {
      eventTitle,
      eventDate,
      eventTime,
      venue,
      eventType,
      organizer,
      registrationDeadline,
      description,
      customMessage,
      eventUrl,
      ctaText,
    };

    const filters = {};
    if (role) filters.role = role;
    if (batch) filters.batch = batch;
    if (department) filters.department = department;

    const result = await sendEventAnnouncement(eventData, filters);

    res.json({
      success: result.success,
      message: result.message,
      data: result.results,
    });
  } catch (error) {
    console.error('Error sending event announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send event announcement',
      error: error.message,
    });
  }
};

/**
 * @desc    Send custom announcement campaign
 * @route   POST /api/email-campaigns/custom
 * @access  Admin
 */
export const sendCustom = async (req, res) => {
  try {
    const {
      subject,
      title,
      badge,
      headerStyle,
      preMessage,
      message,
      postMessage,
      ctaText,
      ctaUrl,
      additionalInfo,
      // Filters
      role,
      batch,
      department,
    } = req.body;

    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Title and message are required',
      });
    }

    const announcementData = {
      subject,
      title,
      badge,
      headerStyle,
      preMessage,
      message,
      postMessage,
      ctaText,
      ctaUrl,
      additionalInfo,
    };

    const filters = {};
    if (role) filters.role = role;
    if (batch) filters.batch = batch;
    if (department) filters.department = department;

    const result = await sendCustomAnnouncement(announcementData, filters);

    res.json({
      success: result.success,
      message: result.message,
      data: result.results,
    });
  } catch (error) {
    console.error('Error sending custom announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send custom announcement',
      error: error.message,
    });
  }
};

/**
 * @desc    Send test email
 * @route   POST /api/email-campaigns/test
 * @access  Admin
 */
export const sendTest = async (req, res) => {
  try {
    const { recipientEmail, templateName, templateData } = req.body;

    if (!recipientEmail || !templateName) {
      return res.status(400).json({
        success: false,
        message: 'Recipient email and template name are required',
      });
    }

    const result = await sendTestEmail(recipientEmail, templateName, templateData || {});

    res.json({
      success: result.success,
      message: result.success
        ? `Test email sent successfully to ${recipientEmail}`
        : `Failed to send test email: ${result.error}`,
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error.message,
    });
  }
};

export default {
  getStats,
  getUsersList,
  sendWelcome,
  sendEvent,
  sendCustom,
  sendTest,
};
