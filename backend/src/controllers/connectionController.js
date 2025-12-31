import { getUserModel, AlumniModel, StudentModel } from '../models/User.js';
import mongoose from 'mongoose';
import { sendCompleteNotification, NotificationTemplates } from '../services/notificationService.js';
import { sendConnectionRequestEmail } from '../utils/email.js';

// @desc    Send connection request
// @route   POST /api/connections/request/:userId
// @access  Private
export const sendConnectionRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    // Can't send request to yourself
    if (userId === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send connection request to yourself',
      });
    }

    // Find the target user in both collections
    let targetUser = await AlumniModel.findById(userId);
    if (!targetUser) {
      targetUser = await StudentModel.findById(userId);
    }

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const TargetUserModel = getUserModel(targetUser.role);
    const CurrentUserModel = getUserModel(req.user.role);

    // Check if already connected
    if (targetUser.connections.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already connected with this user',
      });
    }

    // Check if request already exists
    const existingRequest = targetUser.connectionRequests.find(
      request =>
        request.from.toString() === req.user._id.toString() &&
        request.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'Connection request already sent',
      });
    }

    // Add connection request
    await TargetUserModel.findByIdAndUpdate(userId, {
      $push: {
        connectionRequests: {
          from: req.user._id,
          status: 'pending',
          createdAt: new Date(),
        },
      },
    });

    // Send notification
    const senderName = `${req.user.firstName} ${req.user.lastName}`;
    const notificationData = NotificationTemplates.CONNECTION_REQUEST(senderName);

    try {
      await sendCompleteNotification({
        recipientId: userId,
        senderId: req.user._id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: `/profile/${req.user._id}`,
        sendPush: true,
        sendInApp: true,
      });

      // Send email notification
      const profileUrl = `${process.env.FRONTEND_URL}/profile/${req.user._id}`;
      await sendConnectionRequestEmail(
        targetUser.email,
        targetUser.firstName,
        senderName,
        req.user.role,
        profileUrl
      ).catch(err => console.log('Email notification failed:', err));
    } catch (notifError) {
      console.log('Notification failed:', notifError);
      // Continue even if notification fails
    }

    res.status(200).json({
      success: true,
      message: 'Connection request sent successfully',
    });
  } catch (error) {
    console.error('Send connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending connection request',
    });
  }
};

// @desc    Get received connection requests
// @route   GET /api/connections/requests
// @access  Private
export const getConnectionRequests = async (req, res) => {
  try {
    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id).select('connectionRequests');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Filter pending requests and populate sender details
    const pendingRequests = user.connectionRequests.filter(
      req => req.status === 'pending'
    );

    // Populate sender details from both collections
    const populatedRequests = await Promise.all(
      pendingRequests.map(async request => {
        let sender = await AlumniModel.findById(request.from).select(
          'firstName lastName email profilePicture currentRole company batch location role'
        );

        if (!sender) {
          sender = await StudentModel.findById(request.from).select(
            'firstName lastName email profilePicture batch department role'
          );
        }

        return {
          _id: request._id,
          from: sender,
          createdAt: request.createdAt,
          status: request.status,
        };
      })
    );

    // Filter out requests where sender was not found
    const validRequests = populatedRequests.filter(req => req.from !== null);

    res.status(200).json({
      success: true,
      data: validRequests,
    });
  } catch (error) {
    console.error('Get connection requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching connection requests',
    });
  }
};

// @desc    Get sent connection requests
// @route   GET /api/connections/sent
// @access  Private
export const getSentRequests = async (req, res) => {
  try {
    // Search both collections for requests sent by current user
    const [alumniWithRequests, studentsWithRequests] = await Promise.all([
      AlumniModel.find({
        'connectionRequests.from': req.user._id,
        'connectionRequests.status': 'pending',
      }).select('firstName lastName email profilePicture currentRole company batch location role connectionRequests'),

      StudentModel.find({
        'connectionRequests.from': req.user._id,
        'connectionRequests.status': 'pending',
      }).select('firstName lastName email profilePicture batch department role connectionRequests'),
    ]);

    const allUsersWithRequests = [...alumniWithRequests, ...studentsWithRequests];

    const sentRequests = allUsersWithRequests.map(user => {
      const request = user.connectionRequests.find(
        req => req.from.toString() === req.user._id.toString() && req.status === 'pending'
      );

      return {
        _id: request._id,
        to: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          currentRole: user.currentRole,
          company: user.company,
          batch: user.batch,
          department: user.department,
          location: user.location,
          role: user.role,
        },
        createdAt: request.createdAt,
        status: request.status,
      };
    });

    res.status(200).json({
      success: true,
      data: sentRequests,
    });
  } catch (error) {
    console.error('Get sent requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sent requests',
    });
  }
};

// @desc    Accept connection request
// @route   PUT /api/connections/accept/:requestId
// @access  Private
export const acceptConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find the connection request
    const requestIndex = user.connectionRequests.findIndex(
      req => req._id.toString() === requestId && req.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    const senderId = user.connectionRequests[requestIndex].from;

    // Update request status to accepted
    user.connectionRequests[requestIndex].status = 'accepted';

    // Add to connections
    if (!user.connections.includes(senderId)) {
      user.connections.push(senderId);
    }

    await user.save();

    // Add current user to sender's connections
    let senderModel = AlumniModel;
    let sender = await AlumniModel.findById(senderId);

    if (!sender) {
      senderModel = StudentModel;
      sender = await StudentModel.findById(senderId);
    }

    if (sender && !sender.connections.includes(req.user._id)) {
      sender.connections.push(req.user._id);
      await sender.save();
    }

    // Send notification to the sender
    const accepterName = `${req.user.firstName} ${req.user.lastName}`;
    const notificationData = NotificationTemplates.CONNECTION_ACCEPTED(accepterName);

    try {
      await sendCompleteNotification({
        recipientId: senderId,
        senderId: req.user._id,
        type: notificationData.type,
        title: notificationData.title,
        message: notificationData.message,
        actionUrl: `/profile/${req.user._id}`,
        sendPush: true,
        sendInApp: true,
      });
    } catch (notifError) {
      console.log('Notification failed:', notifError);
      // Continue even if notification fails
    }

    res.status(200).json({
      success: true,
      message: 'Connection request accepted',
    });
  } catch (error) {
    console.error('Accept connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error accepting connection request',
    });
  }
};

// @desc    Reject connection request
// @route   PUT /api/connections/reject/:requestId
// @access  Private
export const rejectConnectionRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find the connection request
    const requestIndex = user.connectionRequests.findIndex(
      req => req._id.toString() === requestId && req.status === 'pending'
    );

    if (requestIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Connection request not found',
      });
    }

    // Update request status to rejected
    user.connectionRequests[requestIndex].status = 'rejected';
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Connection request rejected',
    });
  } catch (error) {
    console.error('Reject connection request error:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting connection request',
    });
  }
};

// @desc    Remove connection
// @route   DELETE /api/connections/:userId
// @access  Private
export const removeConnection = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const UserModel = getUserModel(req.user.role);
    const user = await UserModel.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if connected
    if (!user.connections.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Not connected with this user',
      });
    }

    // Remove from current user's connections
    user.connections = user.connections.filter(
      id => id.toString() !== userId
    );
    await user.save();

    // Remove from other user's connections
    let otherUser = await AlumniModel.findById(userId);
    let OtherUserModel = AlumniModel;

    if (!otherUser) {
      otherUser = await StudentModel.findById(userId);
      OtherUserModel = StudentModel;
    }

    if (otherUser) {
      otherUser.connections = otherUser.connections.filter(
        id => id.toString() !== req.user._id.toString()
      );
      await otherUser.save();
    }

    res.status(200).json({
      success: true,
      message: 'Connection removed successfully',
    });
  } catch (error) {
    console.error('Remove connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing connection',
    });
  }
};

// @desc    Get mutual connections
// @route   GET /api/connections/mutual/:userId
// @access  Private
export const getMutualConnections = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID',
      });
    }

    const UserModel = getUserModel(req.user.role);
    const currentUser = await UserModel.findById(req.user._id).select('connections');

    // Find other user
    let otherUser = await AlumniModel.findById(userId).select('connections');
    if (!otherUser) {
      otherUser = await StudentModel.findById(userId).select('connections');
    }

    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Find mutual connections
    const currentUserConnections = currentUser.connections.map(id => id.toString());
    const otherUserConnections = otherUser.connections.map(id => id.toString());

    const mutualConnectionIds = currentUserConnections.filter(id =>
      otherUserConnections.includes(id)
    );

    // Get details of mutual connections
    const [alumniConnections, studentConnections] = await Promise.all([
      AlumniModel.find({ _id: { $in: mutualConnectionIds } }).select(
        'firstName lastName profilePicture currentRole company role'
      ),
      StudentModel.find({ _id: { $in: mutualConnectionIds } }).select(
        'firstName lastName profilePicture batch department role'
      ),
    ]);

    const mutualConnections = [...alumniConnections, ...studentConnections];

    res.status(200).json({
      success: true,
      data: {
        count: mutualConnections.length,
        connections: mutualConnections,
      },
    });
  } catch (error) {
    console.error('Get mutual connections error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching mutual connections',
    });
  }
};
