import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary from buffer
 * @param {Buffer} fileBuffer - File buffer from multer
 * @param {String} folder - Cloudinary folder name
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} - Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder = 'alumni-connect', options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        ...options,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Upload profile picture with transformations
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} userId - User ID for unique naming
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadProfilePicture = async (fileBuffer, userId) => {
  try {
    const result = await uploadToCloudinary(fileBuffer, 'alumni-connect/profiles', {
      public_id: `profile_${userId}_${Date.now()}`,
      transformation: [
        { width: 500, height: 500, crop: 'fill', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary profile picture upload error:', error);
    throw new Error('Failed to upload profile picture');
  }
};

/**
 * Upload ID card document
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} userId - User ID for unique naming
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadIdCard = async (fileBuffer, userId) => {
  try {
    const result = await uploadToCloudinary(fileBuffer, 'alumni-connect/documents', {
      public_id: `idcard_${userId}_${Date.now()}`,
      resource_type: 'auto',
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary ID card upload error:', error);
    throw new Error('Failed to upload ID card');
  }
};

/**
 * Upload post images
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} userId - User ID
 * @returns {Promise<Object>} - Upload result with URL and public_id
 */
export const uploadPostImage = async (fileBuffer, userId) => {
  try {
    const result = await uploadToCloudinary(fileBuffer, 'alumni-connect/posts', {
      public_id: `post_${userId}_${Date.now()}`,
      transformation: [
        { width: 1200, height: 1200, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary post image upload error:', error);
    throw new Error('Failed to upload post image');
  }
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {Array<String>} publicIds - Array of Cloudinary public IDs
 * @returns {Promise<Object>} - Deletion result
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIds);
    return result;
  } catch (error) {
    console.error('Cloudinary multiple deletion error:', error);
    throw new Error('Failed to delete files from Cloudinary');
  }
};

export default cloudinary;
