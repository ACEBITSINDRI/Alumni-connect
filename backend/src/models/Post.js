import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorRole: {
      type: String,
      enum: ['student', 'alumni'],
      required: true,
    },
    type: {
      type: String,
      enum: ['general', 'advice', 'achievement', 'job'],
      default: 'general',
    },
    title: {
      type: String,
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      maxlength: [5000, 'Content cannot exceed 5000 characters'],
    },
    images: [{
      url: String,
      publicId: String, // Cloudinary public ID for deletion
    }],

    // Job-specific fields
    jobDetails: {
      company: String,
      location: String,
      type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      },
      experience: String,
      salary: String,
      applyUrl: String,
      deadline: Date,
    },

    // Engagement
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: {
        type: String,
        required: true,
        maxlength: [1000, 'Comment cannot exceed 1000 characters'],
      },
      likes: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      }],
      replies: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
          maxlength: [1000, 'Reply cannot exceed 1000 characters'],
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }],
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    shares: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    // Visibility and Status
    visibility: {
      type: String,
      enum: ['public', 'connections', 'private'],
      default: 'public',
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Analytics
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ type: 1 });
postSchema.index({ createdAt: -1 });
postSchema.index({ 'likes.user': 1 });

// Virtual for like count
postSchema.virtual('likeCount').get(function() {
  return this.likes.length;
});

// Virtual for comment count
postSchema.virtual('commentCount').get(function() {
  return this.comments.length;
});

// Virtual for share count
postSchema.virtual('shareCount').get(function() {
  return this.shares.length;
});

// Ensure virtuals are included in JSON
postSchema.set('toJSON', { virtuals: true });
postSchema.set('toObject', { virtuals: true });

const Post = mongoose.model('Post', postSchema);

export default Post;
