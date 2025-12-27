import { storage } from '../config/firebase.js';
import { v4 as uuidv4 } from 'uuid';

const bucket = storage.bucket();

/**
 * Upload file to Firebase Storage
 * @param {Buffer} fileBuffer - File buffer
 * @param {string} folder - Folder path (e.g., 'profile-pictures', 'documents', 'posts')
 * @param {string} userId - User ID for organizing files
 * @param {string} originalFilename - Original file name
 * @returns {Promise<{url: string, path: string}>}
 */
export const uploadFile = async (fileBuffer, folder, userId, originalFilename) => {
  try {
    const fileExtension = originalFilename.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `${folder}/${userId}/${fileName}`;

    const file = bucket.file(filePath);

    await file.save(fileBuffer, {
      metadata: {
        contentType: getContentType(fileExtension),
        metadata: {
          firebaseStorageDownloadTokens: uuidv4(),
        },
      },
      public: false,
    });

    // Make file publicly accessible
    await file.makePublic();

    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    return {
      url: publicUrl,
      path: filePath,
    };
  } catch (error) {
    console.error('Firebase Storage upload error:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Upload profile picture
 */
export const uploadProfilePicture = async (fileBuffer, userId, originalFilename) => {
  return uploadFile(fileBuffer, 'profile-pictures', userId, originalFilename);
};

/**
 * Upload ID card/document
 */
export const uploadDocument = async (fileBuffer, userId, originalFilename) => {
  return uploadFile(fileBuffer, 'documents', userId, originalFilename);
};

/**
 * Upload post image
 */
export const uploadPostImage = async (fileBuffer, userId, originalFilename) => {
  return uploadFile(fileBuffer, 'posts', userId, originalFilename);
};

/**
 * Upload event image
 */
export const uploadEventImage = async (fileBuffer, originalFilename) => {
  const fileName = `${uuidv4()}.${originalFilename.split('.').pop()}`;
  const filePath = `events/${fileName}`;

  const file = bucket.file(filePath);

  await file.save(fileBuffer, {
    metadata: {
      contentType: getContentType(originalFilename.split('.').pop()),
    },
    public: false,
  });

  await file.makePublic();

  const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

  return {
    url: publicUrl,
    path: filePath,
  };
};

/**
 * Delete file from Firebase Storage
 */
export const deleteFile = async (filePath) => {
  try {
    const file = bucket.file(filePath);
    await file.delete();
    return { success: true };
  } catch (error) {
    console.error('Firebase Storage delete error:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Get content type based on file extension
 */
const getContentType = (extension) => {
  const contentTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  };

  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
};
