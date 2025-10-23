import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // Event Details
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    duration: {
      type: String,
    },

    // Location/Mode
    mode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      required: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    meetingLink: {
      type: String, // For online/hybrid events
    },

    // Event Type
    type: {
      type: String,
      enum: ['Workshop', 'Seminar', 'Webinar', 'Meetup', 'Conference', 'Other'],
      required: true,
    },

    // Media
    image: {
      url: String,
      publicId: String,
    },
    banner: {
      url: String,
      publicId: String,
    },

    // Organizer
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    organizerName: {
      type: String,
      required: true,
    },

    // Registration
    registrationFee: {
      type: String,
      default: 'Free',
    },
    maxParticipants: {
      type: Number,
      required: [true, 'Maximum participants is required'],
    },
    registeredParticipants: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      registeredAt: {
        type: Date,
        default: Date.now,
      },
      paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'free'],
        default: 'free',
      },
      transactionId: String,
    }],
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },

    // Speakers/Guests
    speakers: [{
      name: {
        type: String,
        required: true,
      },
      designation: {
        type: String,
      },
      photo: String,
      bio: String,
    }],

    // Event Status
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },

    // Additional Info
    tags: [{
      type: String,
      trim: true,
    }],
    agenda: [{
      time: String,
      activity: String,
    }],

    // Engagement
    likes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],

    // Visibility
    visibility: {
      type: String,
      enum: ['public', 'private'],
      default: 'public',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
eventSchema.index({ date: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });

// Virtual for registered count
eventSchema.virtual('registeredCount').get(function() {
  return this.registeredParticipants.length;
});

// Virtual for available seats
eventSchema.virtual('availableSeats').get(function() {
  return this.maxParticipants - this.registeredParticipants.length;
});

// Check if event is full
eventSchema.virtual('isFull').get(function() {
  return this.registeredParticipants.length >= this.maxParticipants;
});

// Auto-update status based on date
eventSchema.pre('save', function(next) {
  const now = new Date();
  const eventDate = new Date(this.date);

  if (eventDate < now && this.status === 'upcoming') {
    this.status = 'completed';
  }

  next();
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

const Event = mongoose.model('Event', eventSchema, 'events');

export default Event;
