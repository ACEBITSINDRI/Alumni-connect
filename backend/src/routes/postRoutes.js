import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  commentOnPost,
  likeComment,
  deleteComment,
} from '../controllers/postController.js';
import { protect } from '../middleware/auth.js';
import { uploadPostImages, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getPosts);

// Protected routes (require authentication)
router.use(protect);

// Post CRUD routes
router.post('/', uploadPostImages, handleUploadError, createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(updatePost)
  .delete(deletePost);

// Post engagement routes
router.post('/:id/like', likePost);
router.post('/:id/comment', commentOnPost);
router.post('/:id/comments/:commentId/like', likeComment);
router.delete('/:id/comments/:commentId', deleteComment);

export default router;
