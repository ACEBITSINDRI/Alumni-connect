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

export default { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail };
