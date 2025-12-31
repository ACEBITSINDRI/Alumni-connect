/**
 * Firebase Helper Utilities
 * Common functions for Firebase integrations
 */

/**
 * Validate Firebase ID token format
 * @param {String} token - Firebase ID token
 * @returns {Boolean}
 */
export const isValidFirebaseToken = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Firebase tokens are JWT format: header.payload.signature
  const parts = token.split('.');
  if (parts.length !== 3) {
    return false;
  }

  return true;
};

/**
 * Extract user info from Firebase decoded token
 * @param {Object} decodedToken - Decoded Firebase token
 * @returns {Object}
 */
export const extractUserInfoFromToken = (decodedToken) => {
  return {
    uid: decodedToken.uid,
    email: decodedToken.email,
    emailVerified: decodedToken.email_verified || false,
    name: decodedToken.name,
    picture: decodedToken.picture,
    provider: decodedToken.firebase?.sign_in_provider || 'unknown',
  };
};

/**
 * Format notification data for FCM
 * @param {Object} data - Notification data
 * @returns {Object}
 */
export const formatNotificationForFCM = (data) => {
  const { title, body, imageUrl, actionUrl, ...customData } = data;

  return {
    notification: {
      title: title || 'Alumni Connect',
      body: body || '',
      ...(imageUrl && { imageUrl }),
    },
    data: {
      ...customData,
      actionUrl: actionUrl || '/',
      clickAction: actionUrl || '/',
    },
    webpush: {
      notification: {
        title: title || 'Alumni Connect',
        body: body || '',
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
};

/**
 * Sanitize file path for Firebase Storage
 * @param {String} path - File path
 * @returns {String}
 */
export const sanitizeStoragePath = (path) => {
  // Remove leading/trailing slashes
  path = path.replace(/^\/+|\/+$/g, '');

  // Replace multiple consecutive slashes with single slash
  path = path.replace(/\/+/g, '/');

  // Remove special characters except alphanumeric, dash, underscore, slash, dot
  path = path.replace(/[^a-zA-Z0-9\-_/.]/g, '_');

  return path;
};

/**
 * Get file extension from filename
 * @param {String} filename - File name
 * @returns {String}
 */
export const getFileExtension = (filename) => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : '';
};

/**
 * Check if file type is allowed
 * @param {String} filename - File name
 * @param {Array} allowedTypes - Array of allowed extensions
 * @returns {Boolean}
 */
export const isAllowedFileType = (filename, allowedTypes) => {
  const ext = getFileExtension(filename);
  return allowedTypes.includes(ext);
};

/**
 * Generate unique filename
 * @param {String} originalFilename - Original file name
 * @param {String} userId - User ID
 * @returns {String}
 */
export const generateUniqueFilename = (originalFilename, userId) => {
  const ext = getFileExtension(originalFilename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${userId}_${timestamp}_${random}.${ext}`;
};

/**
 * Format file size to human readable format
 * @param {Number} bytes - File size in bytes
 * @returns {String}
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email format
 * @param {String} email - Email address
 * @returns {Boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate verification code
 * @param {Number} length - Code length
 * @returns {String}
 */
export const generateVerificationCode = (length = 6) => {
  const characters = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

/**
 * Truncate text to specified length
 * @param {String} text - Text to truncate
 * @param {Number} maxLength - Maximum length
 * @param {String} suffix - Suffix to add (default: '...')
 * @returns {String}
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Format date for notifications
 * @param {Date} date - Date object
 * @returns {String}
 */
export const formatNotificationDate = (date) => {
  const now = new Date();
  const diff = now - new Date(date);

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(date).toLocaleDateString();
};

/**
 * Create slug from text
 * @param {String} text - Text to slugify
 * @returns {String}
 */
export const createSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

/**
 * Parse query filters for MongoDB
 * @param {Object} query - Query object from req.query
 * @returns {Object}
 */
export const parseQueryFilters = (query) => {
  const filters = {};

  // Handle pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Handle sorting
  let sort = { createdAt: -1 }; // Default sort
  if (query.sortBy) {
    const sortOrder = query.sortOrder === 'asc' ? 1 : -1;
    sort = { [query.sortBy]: sortOrder };
  }

  // Handle search
  if (query.search) {
    filters.$text = { $search: query.search };
  }

  return { filters, pagination: { page, limit, skip }, sort };
};

/**
 * Validate MongoDB ObjectId
 * @param {String} id - ID to validate
 * @returns {Boolean}
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Calculate time until event
 * @param {Date} eventDate - Event date
 * @returns {String}
 */
export const getTimeUntilEvent = (eventDate) => {
  const now = new Date();
  const event = new Date(eventDate);
  const diff = event - now;

  if (diff < 0) return 'Event has passed';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
};

/**
 * Remove HTML tags from text
 * @param {String} html - HTML string
 * @returns {String}
 */
export const stripHtmlTags = (html) => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Generate random color hex code
 * @returns {String}
 */
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

export default {
  isValidFirebaseToken,
  extractUserInfoFromToken,
  formatNotificationForFCM,
  sanitizeStoragePath,
  getFileExtension,
  isAllowedFileType,
  generateUniqueFilename,
  formatFileSize,
  isValidEmail,
  generateVerificationCode,
  truncateText,
  formatNotificationDate,
  createSlug,
  parseQueryFilters,
  isValidObjectId,
  getTimeUntilEvent,
  stripHtmlTags,
  generateRandomColor,
};
