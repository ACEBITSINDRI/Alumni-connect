import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import { AlumniModel, StudentModel, getUserModel } from '../models/User.js';

// @desc    Get all conversations for logged-in user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: 'participants',
        select: 'firstName lastName profilePicture batch company currentRole',
      })
      .populate({
        path: 'lastMessage',
        select: 'content sender createdAt',
      })
      .sort({ updatedAt: -1 })
      .lean();

    // Format conversations for frontend
    const formattedConversations = conversations.map(conv => {
      const otherUser = conv.participants.find(p => p._id.toString() !== userId.toString());
      return {
        id: conv._id,
        user: {
          id: otherUser._id,
          name: `${otherUser.firstName} ${otherUser.lastName}`,
          avatar: otherUser.profilePicture,
          role: otherUser.currentRole || 'Alumni',
          batch: otherUser.batch,
          isOnline: false, // TODO: Implement real-time status
        },
        lastMessage: {
          content: conv.lastMessage?.content || 'No messages yet',
          timestamp: conv.lastMessage?.createdAt || conv.createdAt,
          senderId: conv.lastMessage?.sender,
        },
        unreadCount: conv.unreadCount?.get(userId.toString()) || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedConversations,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching conversations',
    });
  }
};

// @desc    Get messages in a conversation
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findById(conversationId)
      .populate('participants', 'firstName lastName profilePicture batch company currentRole');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Check if user is part of conversation
    if (!conversation.participants.some(p => p._id.toString() === userId.toString())) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this conversation',
      });
    }

    const messages = await Message.find({
      conversation: conversationId,
      isDeleted: false,
    })
      .populate('sender', 'firstName lastName profilePicture')
      .sort({ createdAt: 1 })
      .lean();

    // Get other participant info
    const otherUser = conversation.participants.find(p => p._id.toString() !== userId.toString());

    res.status(200).json({
      success: true,
      data: {
        messages,
        otherUser: {
          id: otherUser._id,
          name: `${otherUser.firstName} ${otherUser.lastName}`,
          avatar: otherUser.profilePicture,
          role: otherUser.currentRole || 'Alumni',
          batch: otherUser.batch,
          company: otherUser.company,
          isOnline: false,
        },
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching messages',
    });
  }
};

// @desc    Send a message
// @route   POST /api/messages/send
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !content) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID and content are required',
      });
    }

    // Check if receiver exists
    let receiver = await AlumniModel.findById(receiverId);
    if (!receiver) {
      receiver = await StudentModel.findById(receiverId);
    }
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    // Find or create conversation
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // Create message
    const message = await Message.create({
      conversation: conversation._id,
      sender: senderId,
      receiver: receiverId,
      content,
    });

    // Update conversation's lastMessage
    conversation.lastMessage = message._id;
    conversation.unreadCount.set(receiverId.toString(), (conversation.unreadCount.get(receiverId.toString()) || 0) + 1);
    await conversation.save();

    const populatedMessage = await message.populate('sender', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      data: populatedMessage,
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error sending message',
    });
  }
};

// @desc    Mark message as read
// @route   PATCH /api/messages/:messageId/read
// @access  Private
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findByIdAndUpdate(
      messageId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error marking message as read',
    });
  }
};

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
export const getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user._id;

    const conversations = await Conversation.find({
      participants: userId,
    });

    let totalUnread = 0;
    conversations.forEach(conv => {
      totalUnread += conv.unreadCount?.get(userId.toString()) || 0;
    });

    res.status(200).json({
      success: true,
      data: { unreadCount: totalUnread },
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching unread count',
    });
  }
};
