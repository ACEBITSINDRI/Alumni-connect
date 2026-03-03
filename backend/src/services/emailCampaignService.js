import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { AlumniModel, StudentModel } from '../models/User.js';
import { auth as firebaseAuth } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TEMPLATES_DIR = path.join(__dirname, '../templates/emails');
const PLATFORM_URL = process.env.FRONTEND_URL || 'https://alumniconnect.acebits.in';

// ─── Email Provider Setup ───────────────────────────────────────────────────
// Render.com blocks all outbound SMTP (ports 25, 465, 587)
// When RESEND_API_KEY is set, we use Resend (HTTP API, works on Render)
// Otherwise we fall back to Nodemailer (for local development)
const useResend = !!process.env.RESEND_API_KEY;
const resendClient = useResend ? new Resend(process.env.RESEND_API_KEY) : null;

console.log(`📧 Email provider: ${useResend ? 'Resend (HTTP API)' : 'Nodemailer (SMTP)'}`);

/**
 * Create Nodemailer transporter (reverting to exact stable setup from Feb 17)
 */
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for 587 and others
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD?.trim(),
    },
  });
};

let _transporter = null;
const getTransporter = () => {
  if (!_transporter) _transporter = createTransporter();
  return _transporter;
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
 * Uses Resend (HTTP API) on production, Nodemailer (SMTP) on local dev
 */
const sendEmail = async (to, subject, htmlContent, attachments = []) => {
  try {
    // Skip placeholder/fake emails immediately
    if (to.includes('@example.com') || to.includes('@placeholder.com')) {
      return { success: false, email: to, error: 'Skipped placeholder email' };
    }

    if (useResend) {
      // ── Resend HTTP API (works on Render) ──────────────────────────────
      let rawEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

      // If the env variable already has brackets like "Name <email@domain.com>", extract just the email
      const emailMatch = rawEmail.match(/<(.+)>/);
      if (emailMatch && emailMatch[1]) {
        rawEmail = emailMatch[1].trim();
      }

      const fromName = process.env.EMAIL_FROM_NAME || 'Alumni Connect';
      // Ensure perfect "Name <email>" format without nested brackets
      const fromAddress = `${fromName} <${rawEmail}>`;

      const payload = {
        from: fromAddress,
        to: [to],
        subject,
        html: htmlContent,
      };

      // Attach files if any
      if (attachments.length > 0) {
        payload.attachments = attachments.map(att => ({
          filename: att.filename,
          content: att.content, // Buffer
        }));
      }

      const { data, error } = await resendClient.emails.send(payload);
      if (error) {
        throw new Error(error.message || JSON.stringify(error));
      }
      return { success: true, email: to, id: data?.id };
    } else {
      // ── Nodemailer SMTP (local development) ──────────────────────────
      const transporter = getTransporter();
      const mailOptions = {
        from: { name: 'Alumni Connect', address: process.env.EMAIL_USER },
        to,
        subject,
        html: htmlContent,
        attachments,
      };
      await transporter.sendMail(mailOptions);
      return { success: true, email: to };
    }
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
    return { success: false, email: to, error: error.message };
  }
};

/**
 * Send bulk emails with rate limiting
 * Modified to support Resend API limits (2 emails/second free tier)
 */
export const sendBulkEmails = async (recipients, subject, htmlTemplate, attachments = [], batchSize = 10, delayMs = 1000) => {
  const results = {
    total: recipients.length,
    sent: 0,
    failed: 0,
    errors: [],
  };

  // If using Resend, enforce a 600ms delay per email to stay under 2 emails/sec limit
  // otherwise, default to the batch processing
  const useResend = !!process.env.RESEND_API_KEY;

  if (useResend) {
    console.log(`Starting Resend sequential mailing for ${recipients.length} users to respect limits...`);
    for (let i = 0; i < recipients.length; i++) {
      const recipient = recipients[i];
      const result = await sendEmail(recipient.email, subject, htmlTemplate(recipient), attachments);
      if (result.success) {
        results.sent++;
      } else {
        results.failed++;
        results.errors.push(result);
      }

      // Log progress every 10 emails
      if ((i + 1) % 10 === 0) {
        console.log(`Progress: Sent ${results.sent}/${results.total}`);
      }

      // Wait 600ms between EVERY email to stay under the 2 per second limit
      if (i < recipients.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 600));
      }
    }
    console.log(`Finished Resend mailing. Sent ${results.sent}/${results.total}`);
    return results;
  }

  // Fallback: SMTP Batch Processing for Nodemailer (Local dev)
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);

    const batchPromises = batch.map(recipient =>
      sendEmail(recipient.email, subject, htmlTemplate(recipient), attachments)
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
 * Send newsletter email campaign
 */
export const sendNewsletterCampaign = async (newsletterData, filters = {}) => {
  try {
    const template = await loadTemplate('newsletter-announcement');
    const users = await getAllUsers(filters);

    if (users.length === 0) {
      return { success: false, message: 'No users found matching filters' };
    }

    const subject = newsletterData.subject || '📰 Newsletter from Alumni Connect';

    const htmlTemplate = (user) => template({
      firstName: user.firstName || 'User',
      title: newsletterData.title,
      content: newsletterData.content,
      platformUrl: PLATFORM_URL,
      unsubscribeUrl: `${PLATFORM_URL}/unsubscribe`,
    });

    const results = await sendBulkEmails(users, subject, htmlTemplate, newsletterData.attachments || []);

    return {
      success: true,
      message: `Newsletter sent to ${results.sent} users`,
      results,
    };
  } catch (error) {
    console.error('Error sending newsletter:', error);
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
  sendNewsletterCampaign,
  sendTestEmail,
  getEmailStats,
};
