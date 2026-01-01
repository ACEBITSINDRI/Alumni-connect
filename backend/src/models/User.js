import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    // Firebase UID
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    password: {
      type: String,
      required: function() {
        // Password not required if Firebase UID exists (social login)
        return !this.firebaseUid;
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },

    // Role-based fields
    role: {
      type: String,
      enum: ['student', 'alumni'],
      required: true,
    },

    // Academic Information
    batch: {
      type: String,
      required: function() {
        return this.role === 'alumni' || this.role === 'student';
      },
    },
    enrollmentNumber: {
      type: String,
      sparse: true,
      unique: true,
    },
    department: {
      type: String,
      default: 'Civil Engineering',
    },

    // Professional Information (mainly for alumni)
    currentRole: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    experience: {
      type: Number, // in years
      min: 0,
    },

    // Profile Details
    profilePicture: {
      type: String,
      default: '',
    },
    coverPhoto: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
    },

    // Skills
    skills: [{
      type: String,
      trim: true,
    }],

    // Social Links
    linkedinUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    portfolioUrl: {
      type: String,
      trim: true,
    },

    // Professional Experience
    experience: [{
      title: String,
      company: String,
      location: String,
      type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Internship', 'Freelance'],
      },
      startDate: String,
      endDate: String,
      current: {
        type: Boolean,
        default: false,
      },
      description: String,
    }],

    // Education
    education: [{
      degree: String,
      institution: String,
      year: String,
      score: String,
    }],

    // Mentorship
    mentorshipAvailable: {
      type: Boolean,
      default: false,
    },
    mentorshipDomains: [{
      type: String,
      trim: true,
    }],

    // Privacy Settings
    privacySettings: {
      profileVisibility: {
        type: String,
        enum: ['public', 'connections', 'private'],
        default: 'public',
      },
      showEmail: {
        type: Boolean,
        default: false,
      },
      showPhone: {
        type: Boolean,
        default: false,
      },
      allowMessages: {
        type: String,
        enum: ['everyone', 'connections', 'none'],
        default: 'everyone',
      },
    },

    // Connections
    connections: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    connectionRequests: [{
      from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    // Account Status
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    passwordResetToken: String,
    passwordResetExpires: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },

    // Firebase Cloud Messaging token for push notifications
    fcmToken: {
      type: String,
    },

    // Notification Preferences
    notificationPreferences: {
      // Push Notification Settings
      pushNotifications: {
        enabled: {
          type: Boolean,
          default: true,
        },
        connections: {
          type: Boolean,
          default: true,
        },
        posts: {
          type: Boolean,
          default: true,
        },
        comments: {
          type: Boolean,
          default: true,
        },
        likes: {
          type: Boolean,
          default: true,
        },
        messages: {
          type: Boolean,
          default: true,
        },
        events: {
          type: Boolean,
          default: true,
        },
        jobs: {
          type: Boolean,
          default: true,
        },
        mentorship: {
          type: Boolean,
          default: true,
        },
      },
      // Email Notification Settings
      emailNotifications: {
        enabled: {
          type: Boolean,
          default: true,
        },
        connections: {
          type: Boolean,
          default: true,
        },
        posts: {
          type: Boolean,
          default: false, // Less frequent by default
        },
        comments: {
          type: Boolean,
          default: true,
        },
        likes: {
          type: Boolean,
          default: false,
        },
        messages: {
          type: Boolean,
          default: true,
        },
        events: {
          type: Boolean,
          default: true,
        },
        jobs: {
          type: Boolean,
          default: true,
        },
        mentorship: {
          type: Boolean,
          default: true,
        },
        weeklyDigest: {
          type: Boolean,
          default: true,
        },
      },
      // In-App Notification Settings
      inAppNotifications: {
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    },
  },
  {
    timestamps: true,
    collection: function() {
      return this.role === 'alumni' ? 'Alumni Data' : 'Student Data';
    },
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ batch: 1 });
userSchema.index({ company: 1 });
userSchema.index({ location: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  const user = this.toObject();
  delete user.password;
  delete user.emailVerificationToken;
  delete user.emailVerificationExpires;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.connectionRequests;

  return user;
};

// Generate email verification token
userSchema.methods.generateVerificationToken = async function() {
  const crypto = await import('crypto');
  const token = crypto.randomBytes(32).toString('hex');

  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Token expires in 24 hours
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  return token; // Return unhashed token to send via email
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = async function() {
  const crypto = await import('crypto');
  const token = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  // Token expires in 1 hour
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000;

  return token; // Return unhashed token to send via email
};

// Create models for both collections with systematic names
const AlumniModel = mongoose.model('Alumni', userSchema.clone(), 'alumni_data');
const StudentModel = mongoose.model('Student', userSchema.clone(), 'student_data');

// Export a factory function to get the appropriate model
export const getUserModel = (role) => {
  return role === 'alumni' ? AlumniModel : StudentModel;
};

export { AlumniModel, StudentModel };
