import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { AlumniModel, StudentModel } from '../models/User.js';
import { auth as firebaseAuth } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '../templates/emails');
const PLATFORM_URL = process.env.FRONTEND_URL || 'https://alumniconnect.acebits.in';

/**
 * Create email transporter
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD?.trim(),
    },
  });
};

/**
 * Load and compile email template
 */
const loadTemplate = async (templateName) => {
  try {
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    return Handlebars.compile(templateContent);
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error);
    throw new Error(`Template ${templateName} not found`);
  }
};

/**
 * Get all users from database
 */
export const getAllUsers = async (filters = {}) => {
  try {
    const query = { isEmailVerified: true }; // Only send to verified emails

    if (filters.batch) {
      query.batch = filters.batch;
    }

    if (filters.department) {
      query.department = filters.department;
    }

    let users = [];

    // Query based on role filter
    if (!filters.role || filters.role === 'student') {
      const students = await StudentModel.find(query)
        .select('email firstName lastName role batch department')
        .lean();
      users = users.concat(students);
    }

    if (!filters.role || filters.role === 'alumni') {
      const alumni = await AlumniModel.find(query)
        .select('email firstName lastName role batch department')
        .lean();
      users = users.concat(alumni);
    }

    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Get all Firebase users (for users who haven't completed profile)
 */
export const getAllFirebaseUsers = async () => {
  try {
    const listUsersResult = await firebaseAuth.listUsers();
    const firebaseUsers = listUsersResult.users
      .filter(user => user.email && user.emailVerified)
      .map(user => ({
        email: user.email,
        firstName: user.displayName?.split(' ')[0] || 'User',
        lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
        uid: user.uid,
      }));

    return firebaseUsers;
  } catch (error) {
    console.error('Error fetching Firebase users:', error);
    // Return empty array if Firebase access fails
    return [];
  }
};

/**
 * Send email to a single recipient
 */
const sendEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransport();

    const mailOptions = {
      from: {
        name: 'Alumni Connect',
        address: process.env.EMAIL_USER,
      },
      to,
      subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, email: to };
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    return { success: false, email: to, error: error.message };
  }
};

/**
 * Send bulk emails with rate limiting
 */
export const sendBulkEmails = async (recipients, subject, htmlTemplate, batchSize = 10, delayMs = 1000) => {
  const results = {
    total: recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  // Process in batches to avoid rate limiting
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    const batchPromises = batch.map(recipient =>
      sendEmail(recipient.email, subject, htmlTemplate(recipient))
    );

    const batchResults = await Promise.all(batchPromises);

    batchResults.forEach(result => {
      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
        results.errors.push(result);
      }
    });

    console.log(`Batch ${Math.floor(i / batchSize) + 1}: Sent ${results.sent}/${results.total}`);

    // Delay between batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return results;
};

/**
 * Send welcome email campaign
 */
export const sendWelcomeEmail = async (filters = {}) => {
  try {
    const template = await loadTemplate('welcome');
    const users = await getAllUsers(filters);

    if (users.length === 0) {
      return { success: false, message: 'No users found matching filters' };
    }

    const subject = '🎉 Welcome to Alumni Connect - Your Professional Network!';

    const htmlTemplate = (user) => template({
      firstName: user.firstName || 'User',
      platformUrl: PLATFORM_URL,
      unsubscribeUrl: `${PLATFORM_URL}/unsubscribe`,
    });

    const results = await sendBulkEmails(users, subject, htmlTemplate);

    return {
      success: true,
      message: `Welcome emails sent to ${results.sent} users`,
      results,
    };
  } catch (error) {
    console.error('Error sending welcome emails:', error);
    throw error;
  }
};

/**
 * Send event announcement email campaign
 */
export const sendEventAnnouncement = async (eventData, filters = {}) => {
  try {
    const template = await loadTemplate('event-announcement');
    const users = await getAllUsers(filters);

    if (users.length === 0) {
      return { success: false, message: 'No users found matching filters' };
    }

    const subject = `📅 ${eventData.eventTitle} - Alumni Connect Event`;

    const htmlTemplate = (user) => template({
      firstName: user.firstName || 'User',
      eventTitle: eventData.eventTitle,
      eventDate: eventData.eventDate,
      eventTime: eventData.eventTime,
      venue: eventData.venue,
      eventType: eventData.eventType,
      organizer: eventData.organizer,
      registrationDeadline: eventData.registrationDeadline,
      description: eventData.description,
      customMessage: eventData.customMessage,
      eventUrl: eventData.eventUrl || `${PLATFORM_URL}/events`,
      ctaText: eventData.ctaText || 'Register Now',
      platformUrl: PLATFORM_URL,
      unsubscribeUrl: `${PLATFORM_URL}/unsubscribe`,
    });

    const results = await sendBulkEmails(users, subject, htmlTemplate);

    return {
      success: true,
      message: `Event announcement sent to ${results.sent} users`,
      results,
    };
  } catch (error) {
    console.error('Error sending event announcement:', error);
    throw error;
  }
};

/**
 * Send custom announcement email campaign
 */
export const sendCustomAnnouncement = async (announcementData, filters = {}) => {
  try {
    const template = await loadTemplate('custom-announcement');
    const users = await getAllUsers(filters);

    if (users.length === 0) {
      return { success: false, message: 'No users found matching filters' };
    }

    const subject = announcementData.subject || '📢 Announcement from Alumni Connect';

    const htmlTemplate = (user) => template({
      firstName: user.firstName || 'User',
      title: announcementData.title,
      badge: announcementData.badge,
      headerStyle: announcementData.headerStyle || 'info', // 'info', 'success', 'warning'
      preMessage: announcementData.preMessage,
      message: announcementData.message,
      postMessage: announcementData.postMessage,
      ctaText: announcementData.ctaText,
      ctaUrl: announcementData.ctaUrl,
      additionalInfo: announcementData.additionalInfo,
      platformUrl: PLATFORM_URL,
      unsubscribeUrl: `${PLATFORM_URL}/unsubscribe`,
    });

    const results = await sendBulkEmails(users, subject, htmlTemplate);

    return {
      success: true,
      message: `Custom announcement sent to ${results.sent} users`,
      results,
    };
  } catch (error) {
    console.error('Error sending custom announcement:', error);
    throw error;
  }
};

/**
 * Send test email (single recipient)
 */
export const sendTestEmail = async (recipientEmail, templateName, templateData) => {
  try {
    const template = await loadTemplate(templateName);

    const htmlContent = template({
      firstName: 'Test User',
      platformUrl: PLATFORM_URL,
      unsubscribeUrl: `${PLATFORM_URL}/unsubscribe`,
      ...templateData,
    });

    const subject = templateData.subject || 'Test Email from Alumni Connect';
    const result = await sendEmail(recipientEmail, subject, htmlContent);

    return result;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

/**
 * Get email campaign statistics
 */
export const getEmailStats = async () => {
  try {
    const studentCount = await StudentModel.countDocuments({ isEmailVerified: true });
    const alumniCount = await AlumniModel.countDocuments({ isEmailVerified: true });
    const totalUsers = studentCount + alumniCount;

    // Get unique batches and departments from both collections
    const studentBatches = await StudentModel.distinct('batch', { isEmailVerified: true });
    const alumniBatches = await AlumniModel.distinct('batch', { isEmailVerified: true });
    const batches = [...new Set([...studentBatches, ...alumniBatches])];

    const studentDepts = await StudentModel.distinct('department', { isEmailVerified: true });
    const alumniDepts = await AlumniModel.distinct('department', { isEmailVerified: true });
    const departments = [...new Set([...studentDepts, ...alumniDepts])];

    return {
      totalUsers,
      studentCount,
      alumniCount,
      batches: batches.filter(b => b && b !== ''),
      departments: departments.filter(d => d && d !== ''),
    };
  } catch (error) {
    console.error('Error getting email stats:', error);
    throw error;
  }
};

export default {
  getAllUsers,
  getAllFirebaseUsers,
  sendWelcomeEmail,
  sendEventAnnouncement,
  sendCustomAnnouncement,
  sendTestEmail,
  getEmailStats,
};
