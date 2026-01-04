import mongoose from 'mongoose';

const tickerItemSchema = new mongoose.Schema(
  {
    // Content
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [300, 'Message cannot exceed 300 characters'],
    },

    // Type & Source
    type: {
      type: String,
      enum: {
        values: ['announcement', 'event', 'job', 'news', 'achievement'],
        message: '{VALUE} is not a valid type',
      },
      required: [true, 'Type is required'],
    },
    source: {
      type: String,
      enum: {
        values: ['manual', 'auto-event', 'auto-opportunity'],
        message: '{VALUE} is not a valid source',
      },
      default: 'manual',
    },

    // Reference to source data (for auto-generated items)
    relatedEvent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
    relatedOpportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Opportunity',
    },

    // Visibility & Priority
    isActive: {
      type: Boolean,
      default: true,
    },
    priority: {
      type: Number,
      min: [1, 'Priority must be at least 1'],
      max: [5, 'Priority cannot exceed 5'],
      default: 3,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function (value) {
          // Only validate if endDate is provided
          return !value || value > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },

    // Action
    actionUrl: {
      type: String,
      trim: true,
    },
    actionLabel: {
      type: String,
      trim: true,
      maxlength: [30, 'Action label cannot exceed 30 characters'],
    },

    // Styling hints
    variant: {
      type: String,
      enum: {
        values: ['info', 'success', 'warning', 'urgent'],
        message: '{VALUE} is not a valid variant',
      },
      default: 'info',
    },
    icon: {
      type: String,
      trim: true,
    },

    // Admin tracking
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    // Engagement
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient querying
tickerItemSchema.index({ isActive: 1, priority: -1, startDate: -1 });
tickerItemSchema.index({ endDate: 1 }); // For cleanup/expiration
tickerItemSchema.index({ type: 1 });
tickerItemSchema.index({ source: 1 });
tickerItemSchema.index({ createdBy: 1 });

// Virtual to check if ticker item is currently valid
tickerItemSchema.virtual('isValid').get(function () {
  const now = new Date();
  const isAfterStart = this.startDate <= now;
  const isBeforeEnd = !this.endDate || this.endDate >= now;
  return this.isActive && isAfterStart && isBeforeEnd;
});

// Method to increment view count
tickerItemSchema.methods.incrementViews = async function () {
  this.viewCount += 1;
  await this.save();
  return this;
};

// Method to increment click count
tickerItemSchema.methods.incrementClicks = async function () {
  this.clickCount += 1;
  await this.save();
  return this;
};

// Static method to get all active ticker items
tickerItemSchema.statics.getActive = function () {
  const now = new Date();
  return this.find({
    isActive: true,
    startDate: { $lte: now },
    $or: [{ endDate: null }, { endDate: { $gte: now } }],
  }).sort({ priority: -1, startDate: -1 });
};

// Static method to cleanup expired items
tickerItemSchema.statics.cleanupExpired = async function () {
  const now = new Date();
  const result = await this.updateMany(
    {
      isActive: true,
      endDate: { $lt: now },
    },
    {
      $set: { isActive: false },
    }
  );
  return result;
};

// Ensure virtuals are included when converting to JSON
tickerItemSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.__v;
    return ret;
  },
});

const TickerItem = mongoose.model('TickerItem', tickerItemSchema, 'ticker_items');

export default TickerItem;
