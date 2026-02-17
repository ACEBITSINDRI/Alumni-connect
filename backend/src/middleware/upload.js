import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
  // Allowed image formats
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  // Allowed document formats
  const allowedDocTypes = ['application/pdf'];

  const allAllowedTypes = [...allowedImageTypes, ...allowedDocTypes];

  if (allAllowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, WEBP images and PDF documents are allowed.'), false);
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: fileFilter,
});

// Middleware for single profile picture upload
export const uploadProfilePicture = upload.single('profilePicture');

// Middleware for single ID card upload
export const uploadIdCard = upload.single('idCard');

// Middleware for multiple post images (max 5)
export const uploadPostImages = upload.array('images', 5);

// Middleware for mixed fields (profile picture + id card)
export const uploadRegistrationFiles = upload.fields([
  { name: 'profilePicture', maxCount: 1 },
  { name: 'idCard', maxCount: 1 }
]);

// Custom error handler for multer errors
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB',
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Too many files uploaded',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    console.error('[Upload Error]', err);
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

export default upload;
