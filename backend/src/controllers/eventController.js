import Event from '../models/Event.js';
import { eventCache } from '../utils/cache.js';

// @desc    Get all events with filters
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const {
      status,
      type,
      mode,
      page = 1,
      limit = 10,
      sort = '-date',
      search,
    } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (type) {
      filter.type = type;
    }

    if (mode) {
      filter.mode = mode;
    }

    // Search by title or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const events = await Event.find(filter)
      .populate('organizer', 'firstName lastName profilePicture role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Event.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: events.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: events,
    });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message,
    });
  }
};

// @desc    Get upcoming events for ticker (next 7 days)
// @route   GET /api/events/upcoming/ticker
// @access  Public
export const getUpcomingForTicker = async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'upcoming-events-ticker';
    const cached = eventCache.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const events = await Event.find({
      status: 'upcoming',
      visibility: 'public',
      date: {
        $gte: now,
        $lte: nextWeek,
      },
    })
      .select('title description date startTime endTime venue location mode type _id')
      .sort({ date: 1 })
      .limit(5);

    // Cache for 2 minutes
    eventCache.set(cacheKey, events, 120000);

    res.status(200).json({
      success: true,
      data: events,
      cached: false,
    });
  } catch (error) {
    console.error('Get upcoming events for ticker error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'firstName lastName profilePicture role email')
      .populate('registeredParticipants.user', 'firstName lastName profilePicture role')
      .populate('comments.user', 'firstName lastName profilePicture');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message,
    });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private
export const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id,
      organizerName: `${req.user.firstName} ${req.user.lastName}`,
    };

    const event = await Event.create(eventData);

    // Clear cache
    eventCache.clear();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message,
    });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer only)
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this event',
      });
    }

    // Update event
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('organizer', 'firstName lastName profilePicture role');

    // Clear cache
    eventCache.clear();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent,
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message,
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private (Organizer only)
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this event',
      });
    }

    await event.deleteOne();

    // Clear cache
    eventCache.clear();

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message,
    });
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Check if event is full
    if (event.isFull) {
      return res.status(400).json({
        success: false,
        message: 'Event is full. No more registrations allowed.',
      });
    }

    // Check if registration deadline has passed
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline has passed',
      });
    }

    // Check if user is already registered
    const alreadyRegistered = event.registeredParticipants.some(
      (participant) => participant.user.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: 'You are already registered for this event',
      });
    }

    // Add user to registered participants
    event.registeredParticipants.push({
      user: req.user._id,
      registrationDate: new Date(),
      paymentStatus: event.registrationFee === 'Free' ? 'completed' : 'pending',
    });

    await event.save();

    // Clear cache
    eventCache.clear();

    res.status(200).json({
      success: true,
      message: 'Successfully registered for event',
      data: event,
    });
  } catch (error) {
    console.error('Register for event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering for event',
      error: error.message,
    });
  }
};

// @desc    Like/Unlike event
// @route   POST /api/events/:id/like
// @access  Private
export const toggleLikeEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const userIndex = event.likes.indexOf(req.user._id);

    if (userIndex > -1) {
      // User already liked, so unlike
      event.likes.splice(userIndex, 1);
    } else {
      // User hasn't liked, so like
      event.likes.push(req.user._id);
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: userIndex > -1 ? 'Event unliked' : 'Event liked',
      data: {
        likes: event.likes.length,
        isLiked: userIndex === -1,
      },
    });
  } catch (error) {
    console.error('Toggle like event error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message,
    });
  }
};

// @desc    Add comment to event
// @route   POST /api/events/:id/comment
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    event.comments.push({
      user: req.user._id,
      content,
    });

    await event.save();

    const populatedEvent = await Event.findById(req.params.id)
      .populate('comments.user', 'firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populatedEvent.comments[populatedEvent.comments.length - 1],
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};
