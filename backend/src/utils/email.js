import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send verification email to user
 * @param {String} email - User email
 * @param {String} token - Verification token
 * @param {String} userName - User's first name
 * @returns {Promise}
 */
export const sendVerificationEmail = async (email, token, userName) => {
  try {
    const transporter = createTransporter();

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify Your Email - Alumni Connect',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Alumni Connect!</h1>
              <p>BIT Sindri - Civil Engineering Department</p>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Thank you for registering with Alumni Connect! We're excited to have you join our community of civil engineering professionals and students.</p>

              <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>

              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>

              <p><strong>This verification link will expire in 24 hours.</strong></p>

              <p>If you didn't create an account with Alumni Connect, please ignore this email.</p>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
            <div class="footer">
              <p>&copy; 2025 Alumni Connect - BIT Sindri. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

/**
 * Send welcome email after verification
 * @param {String} email - User email
 * @param {String} userName - User's first name
 * @param {String} role - User role (student/alumni)
 * @returns {Promise}
 */
export const sendWelcomeEmail = async (email, userName, role) => {
  try {
    const transporter = createTransporter();

    const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to Alumni Connect!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .feature { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Alumni Connect!</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Your email has been verified successfully! You're now part of the BIT Sindri Civil Engineering alumni network.</p>

              <h3>What you can do now:</h3>

              <div class="feature">
                <strong>📝 Create Posts:</strong> Share your experiences, achievements, and insights with the community.
              </div>

              <div class="feature">
                <strong>🤝 Connect with ${role === 'student' ? 'Alumni' : 'Students'}:</strong> Network with peers, ${role === 'student' ? 'alumni' : 'current students'}, and expand your professional circle.
              </div>

              <div class="feature">
                <strong>💼 Explore Opportunities:</strong> Find jobs, internships, and career guidance from experienced professionals.
              </div>

              <div class="feature">
                <strong>📅 Attend Events:</strong> Join alumni meetups, webinars, and networking events.
              </div>

              <div style="text-align: center;">
                <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
              </div>

              <p>We're thrilled to have you in our community!</p>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email - it's not critical
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 * @param {String} email - User email
 * @param {String} token - Reset token
 * @param {String} userName - User's first name
 * @returns {Promise}
 */
export const sendPasswordResetEmail = async (email, token, userName) => {
  try {
    const transporter = createTransporter();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request - Alumni Connect',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>We received a request to reset your password for your Alumni Connect account.</p>

              <p>Click the button below to reset your password:</p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>

              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>

              <div class="warning">
                <strong>⚠️ Important:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
              </div>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send connection request email
 * @param {String} email - Recipient email
 * @param {String} userName - Recipient name
 * @param {String} senderName - Sender name
 * @param {String} senderRole - Sender role
 * @param {String} profileUrl - Profile URL
 * @returns {Promise}
 */
export const sendConnectionRequestEmail = async (email, userName, senderName, senderRole, profileUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `${senderName} wants to connect with you`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🤝 New Connection Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p><strong>${senderName}</strong> (${senderRole}) wants to connect with you on Alumni Connect!</p>

              <div class="info-box">
                <p><strong>Name:</strong> ${senderName}</p>
                <p><strong>Role:</strong> ${senderRole}</p>
              </div>

              <p>Connecting with alumni and students helps you grow your professional network and discover new opportunities.</p>

              <div style="text-align: center;">
                <a href="${profileUrl}" class="button">View Profile & Respond</a>
              </div>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Connection request email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending connection request email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send new job opportunity email
 * @param {String} email - Recipient email
 * @param {String} userName - Recipient name
 * @param {String} jobTitle - Job title
 * @param {String} company - Company name
 * @param {String} location - Job location
 * @param {String} jobUrl - Job details URL
 * @returns {Promise}
 */
export const sendNewJobEmail = async (email, userName, jobTitle, company, location, jobUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `New Job Opportunity: ${jobTitle} at ${company}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .job-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💼 New Job Opportunity</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>A new job opportunity matching your profile has been posted on Alumni Connect!</p>

              <div class="job-card">
                <h3 style="color: #667eea; margin: 0 0 10px 0;">${jobTitle}</h3>
                <p style="margin: 5px 0;"><strong>Company:</strong> ${company}</p>
                <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
              </div>

              <p>Don't miss this opportunity! Apply before the deadline.</p>

              <div style="text-align: center;">
                <a href="${jobUrl}" class="button">View Job Details</a>
              </div>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('New job email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending new job email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send event invitation email
 * @param {String} email - Recipient email
 * @param {String} userName - Recipient name
 * @param {String} eventName - Event name
 * @param {String} eventDate - Event date
 * @param {String} eventLocation - Event location
 * @param {String} eventUrl - Event details URL
 * @returns {Promise}
 */
export const sendEventInvitationEmail = async (email, userName, eventName, eventDate, eventLocation, eventUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `You're invited: ${eventName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .event-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Event Invitation</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>You're invited to an upcoming event on Alumni Connect!</p>

              <div class="event-card">
                <h3 style="color: #667eea; margin: 0 0 15px 0;">${eventName}</h3>
                <p style="margin: 5px 0;"><strong>📆 Date:</strong> ${eventDate}</p>
                <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${eventLocation}</p>
              </div>

              <p>Join us for networking, learning, and connecting with fellow alumni and students!</p>

              <div style="text-align: center;">
                <a href="${eventUrl}" class="button">View Event Details & RSVP</a>
              </div>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Event invitation email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending event invitation email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send mentorship request email
 * @param {String} email - Mentor email
 * @param {String} mentorName - Mentor name
 * @param {String} studentName - Student name
 * @param {String} studentBatch - Student batch
 * @param {String} domain - Mentorship domain
 * @param {String} profileUrl - Student profile URL
 * @returns {Promise}
 */
export const sendMentorshipRequestEmail = async (email, mentorName, studentName, studentBatch, domain, profileUrl) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Mentorship Request from ${studentName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Mentorship Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${mentorName},</h2>
              <p>A student has requested your mentorship on Alumni Connect!</p>

              <div class="info-box">
                <p><strong>Student Name:</strong> ${studentName}</p>
                <p><strong>Batch:</strong> ${studentBatch}</p>
                <p><strong>Domain of Interest:</strong> ${domain}</p>
              </div>

              <p>Your experience and guidance can make a significant impact on a student's career journey. Consider accepting this mentorship request to help shape the future of our alumni community.</p>

              <div style="text-align: center;">
                <a href="${profileUrl}" class="button">View Profile & Respond</a>
              </div>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Mentorship request email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending mentorship request email:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send post engagement email (likes, comments)
 * @param {String} email - Post author email
 * @param {String} userName - Post author name
 * @param {String} engagerName - Person who engaged
 * @param {String} engagementType - 'like' or 'comment'
 * @param {String} postPreview - Post preview text
 * @param {String} commentText - Comment text (if applicable)
 * @param {String} postUrl - Post URL
 * @returns {Promise}
 */
export const sendPostEngagementEmail = async (email, userName, engagerName, engagementType, postPreview, commentText, postUrl) => {
  try {
    const transporter = createTransporter();

    const subject = engagementType === 'like'
      ? `${engagerName} liked your post`
      : `${engagerName} commented on your post`;

    const mainMessage = engagementType === 'like'
      ? `<p><strong>${engagerName}</strong> liked your post!</p>`
      : `<p><strong>${engagerName}</strong> commented on your post:</p>
         <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px; font-style: italic; border-left: 4px solid #667eea;">
           "${commentText}"
         </div>`;

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${engagementType === 'like' ? '❤️' : '💬'} Post ${engagementType === 'like' ? 'Liked' : 'Comment'}</h1>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              ${mainMessage}

              <p><strong>Your post:</strong></p>
              <div style="background: white; padding: 15px; margin: 15px 0; border-radius: 8px;">
                "${postPreview}..."
              </div>

              <div style="text-align: center;">
                <a href="${postUrl}" class="button">View ${engagementType === 'like' ? 'Post' : 'Comment'}</a>
              </div>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Post ${engagementType} email sent:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Error sending post ${engagementType} email:`, error);
    return { success: false, error: error.message };
  }
};

/**
 * Send weekly digest email
 * @param {String} email - User email
 * @param {String} userName - User name
 * @param {Object} stats - Weekly stats
 * @returns {Promise}
 */
export const sendWeeklyDigestEmail = async (email, userName, stats) => {
  try {
    const transporter = createTransporter();
    const { newConnections, newPosts, newJobs, newEvents, profileViews } = stats;

    const mailOptions = {
      from: `"Alumni Connect - BIT Sindri" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Weekly Alumni Connect Digest',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .stat-card { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; display: flex; align-items: center; }
            .stat-number { font-size: 32px; font-weight: bold; color: #667eea; margin-right: 15px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Your Weekly Digest</h1>
              <p>Here's what happened this week</p>
            </div>
            <div class="content">
              <h2>Hi ${userName},</h2>
              <p>Here's a summary of your activity and updates from the Alumni Connect community this week:</p>

              <div class="stat-card">
                <div class="stat-number">${newConnections || 0}</div>
                <div><strong>New Connections</strong><br>People joined your network</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">${profileViews || 0}</div>
                <div><strong>Profile Views</strong><br>People viewed your profile</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">${newPosts || 0}</div>
                <div><strong>New Posts</strong><br>In your network</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">${newJobs || 0}</div>
                <div><strong>New Job Postings</strong><br>Opportunities for you</div>
              </div>

              <div class="stat-card">
                <div class="stat-number">${newEvents || 0}</div>
                <div><strong>Upcoming Events</strong><br>Don't miss out</div>
              </div>

              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Visit Dashboard</a>
              </div>

              <p>Stay active and keep growing your network!</p>

              <p>Best regards,<br>Alumni Connect Team<br>BIT Sindri</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Weekly digest email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending weekly digest email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendConnectionRequestEmail,
  sendNewJobEmail,
  sendEventInvitationEmail,
  sendMentorshipRequestEmail,
  sendPostEngagementEmail,
  sendWeeklyDigestEmail,
};
