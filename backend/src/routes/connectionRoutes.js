import express from 'express';
import {
  sendConnectionRequest,
  getConnectionRequests,
  getSentRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
  getMutualConnections,
} from '../controllers/connectionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Connection request routes
router.post('/request/:userId', sendConnectionRequest);
router.get('/requests', getConnectionRequests);
router.get('/sent', getSentRequests);
router.put('/accept/:requestId', acceptConnectionRequest);
router.put('/reject/:requestId', rejectConnectionRequest);
router.delete('/:userId', removeConnection);
router.get('/mutual/:userId', getMutualConnections);

export default router;
