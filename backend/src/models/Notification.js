import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'connection',
        'message',
        'like',
        'comment',
        'event',
        'opportunity',
        'mention',
        'achievement',
        'post',
        'system'
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    actionUrl: {
      type: String,
      trim: true,
    },
    relatedPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    relatedOpportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1 });
notificationSchema.index({ type: 1 });

// Auto-delete old read notifications after 30 days
notificationSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 30 * 24 * 60 * 60, // 30 days
    partialFilterExpression: { isRead: true }
  }
);

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
