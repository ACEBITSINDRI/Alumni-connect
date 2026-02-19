import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },

    // Job Type
    type: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Job', 'Internship'],
      required: true,
    },

    // Location
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    workMode: {
      type: String,
      enum: ['On-site', 'Remote', 'Hybrid'],
      required: true,
    },

    // Requirements
    experience: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
      },
      level: {
        type: String,
        enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'],
      },
    },

    skills: [{
      type: String,
      trim: true,
    }],

    qualifications: [{
      type: String,
      trim: true,
    }],

    // Compensation
    salary: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'INR',
      },
      period: {
        type: String,
        enum: ['per month', 'per year', 'per hour'],
        default: 'per month',
      },
      display: String, // e.g., "₹5-7 LPA" or "Not Disclosed"
    },

    stipend: {
      amount: Number,
      currency: {
        type: String,
        default: 'INR',
      },
      period: {
        type: String,
        enum: ['per month', 'per week'],
        default: 'per month',
      },
    },

    // Application Details
    applyUrl: {
      type: String,
      trim: true,
    },
    applyEmail: {
      type: String,
      trim: true,
      lowercase: true,
    },
    deadline: {
      type: Date,
    },

    // Company Details
    companyLogo: {
      url: String,
      publicId: String,
    },
    companyWebsite: {
      type: String,
      trim: true,
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    },
    industry: {
      type: String,
      trim: true,
    },

    // Posted By
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postedByRole: {
      type: String,
      enum: ['student', 'alumni'],
    },

    // Engagement
    applications: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      appliedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ['applied', 'shortlisted', 'rejected', 'hired'],
        default: 'applied',
      },
      resume: String,
      coverLetter: String,
    }],

    savedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],

    views: {
      type: Number,
      default: 0,
    },

    // Status
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Additional Details
    benefits: [{
      type: String,
      trim: true,
    }],
    responsibilities: [{
      type: String,
      trim: true,
    }],

    // Duration (for internships)
    duration: {
      type: String, // e.g., "3 months", "6 months"
    },
    startDate: {
      type: Date,
    },

    // Tags
    tags: [{
      type: String,
      trim: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes
opportunitySchema.index({ company: 1 });
opportunitySchema.index({ type: 1 });
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ location: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ postedBy: 1, createdAt: -1 });
opportunitySchema.index({ createdAt: -1 });

// Virtual for application count
opportunitySchema.virtual('applicationCount').get(function() {
  return this.applications.length;
});

// Virtual for save count
opportunitySchema.virtual('saveCount').get(function() {
  return this.savedBy.length;
});

// Check if expired
opportunitySchema.virtual('isExpired').get(function() {
  if (!this.deadline) return false;
  return new Date() > this.deadline;
});

// Auto-close if deadline passed
opportunitySchema.pre('save', function(next) {
  if (this.deadline && new Date() > this.deadline && this.status === 'active') {
    this.status = 'closed';
  }
  next();
});

opportunitySchema.set('toJSON', { virtuals: true });
opportunitySchema.set('toObject', { virtuals: true });

const Opportunity = mongoose.model('Opportunity', opportunitySchema, 'opportunities');

export default Opportunity;
