import express from 'express';

const router = express.Router();

/**
 * @route   GET /health
 * @desc    Health check endpoint for monitoring
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Alumni Connect API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

/**
 * @route   GET /
 * @desc    API root endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to Alumni Connect API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/health'
  });
});

export default router;
