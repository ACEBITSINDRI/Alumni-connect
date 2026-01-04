import TickerItem from '../models/TickerItem.js';
import Event from '../models/Event.js';
import Opportunity from '../models/Opportunity.js';
import { tickerCache } from '../utils/cache.js';

/**
 * Aggregate ticker items from multiple sources:
 * 1. Manual ticker items from TickerItem collection
 * 2. Upcoming events (next 7 days)
 * 3. Recent job opportunities (last 7 days)
 */
const aggregateTickerItems = async () => {
  const now = new Date();

  try {
    // 1. Get manual ticker items
    const manualItems = await TickerItem.find({
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: null }, { endDate: { $gte: now } }],
    })
      .sort({ priority: -1, startDate: -1 })
      .limit(10)
      .lean()
      .catch((err) => {
        console.log('❌ Error fetching manual ticker items:', err.message);
        return [];
      }); // Gracefully handle if collection doesn't exist

    console.log(`📊 Found ${manualItems.length} manual ticker items`);

    // 2. Get upcoming events (next 7 days) - Skip if Event model not ready
    let upcomingEvents = [];
    try {
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      upcomingEvents = await Event.find({
        status: 'upcoming',
        visibility: 'public',
        date: { $gte: now, $lte: nextWeek },
      })
        .sort({ date: 1 })
        .limit(5)
        .lean();
    } catch (err) {
      // Event collection might not exist yet - skip
      console.log('Event collection not available yet');
    }

    // 3. Get recent job opportunities (last 7 days) - Skip if Opportunity model not ready
    let recentJobs = [];
    try {
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      recentJobs = await Opportunity.find({
        status: 'active',
        isActive: true,
        createdAt: { $gte: lastWeek },
        deadline: { $gte: now },
      })
        .sort({ isFeatured: -1, createdAt: -1 })
        .limit(5)
        .lean();
    } catch (err) {
      // Opportunity collection might not exist yet - skip
      console.log('Opportunity collection not available yet');
    }

    // Transform events to ticker format
    const transformedEvents = upcomingEvents.map((event) => ({
      _id: `event-${event._id}`,
      originalId: event._id,
      title: `📅 Upcoming Event: ${event.title}`,
      message: `${event.type || 'Event'} on ${new Date(event.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} ${event.startTime ? `at ${event.startTime}` : ''}${event.venue ? ` | ${event.venue}` : ''}`,
      type: 'event',
      source: 'auto-event',
      variant: 'info',
      actionUrl: `/events/${event._id}`,
      actionLabel: 'View Details',
      priority: 4,
      isActive: true,
      icon: 'Calendar',
    }));

    // Transform opportunities to ticker format
    const transformedJobs = recentJobs.map((job) => ({
      _id: `job-${job._id}`,
      originalId: job._id,
      title: `💼 ${job.category === 'Internship' ? 'New Internship' : 'New Job'}: ${job.title}`,
      message: `${job.company} | ${job.location || 'Remote'}${job.type ? ` | ${job.type}` : ''}`,
      type: 'job',
      source: 'auto-opportunity',
      variant: job.isFeatured ? 'success' : 'info',
      actionUrl: `/opportunities/${job._id}`,
      actionLabel: 'Apply Now',
      priority: job.isFeatured ? 4 : 3,
      isActive: true,
      icon: 'Briefcase',
    }));

    // Format manual items
    const formattedManualItems = manualItems.map((item) => ({
      _id: item._id,
      originalId: item._id,
      title: item.title,
      message: item.message,
      type: item.type,
      source: item.source,
      variant: item.variant,
      actionUrl: item.actionUrl,
      actionLabel: item.actionLabel,
      priority: item.priority,
      isActive: item.isActive,
      icon: item.icon,
      viewCount: item.viewCount,
      clickCount: item.clickCount,
    }));

    // Merge all items and sort by priority
    const allItems = [
      ...formattedManualItems,
      ...transformedEvents,
      ...transformedJobs,
    ].sort((a, b) => {
      // Sort by priority (descending), then by creation/date
      if (b.priority !== a.priority) {
        return b.priority - a.priority;
      }
      // If priorities are equal, put manual items first
      if (a.source === 'manual' && b.source !== 'manual') return -1;
      if (b.source === 'manual' && a.source !== 'manual') return 1;
      return 0;
    });

    // Limit to maximum 20 ticker items
    return allItems.slice(0, 20);
  } catch (error) {
    console.error('Error aggregating ticker items:', error);
    throw error;
  }
};

// @desc    Get all active ticker items (aggregated from all sources)
// @route   GET /api/ticker
// @access  Public
export const getActiveTickerItems = async (req, res) => {
  try {
    const cacheKey = 'active-ticker-items';

    // Check cache first
    const cached = tickerCache.get(cacheKey);
    if (cached) {
      return res.status(200).json({
        success: true,
        count: cached.length,
        data: cached,
        cached: true,
      });
    }

    // Aggregate from all sources
    const items = await aggregateTickerItems();

    // Cache for 2 minutes
    tickerCache.set(cacheKey, items, 120000);

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
      cached: false,
    });
  } catch (error) {
    console.error('Get active ticker items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticker items',
      error: error.message,
    });
  }
};

// @desc    Get all ticker items (admin view - manual items only)
// @route   GET /api/ticker/admin
// @access  Private (Admin only)
export const getAllTickerItems = async (req, res) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt', isActive } = req.query;

    const filter = {};
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }

    const skip = (page - 1) * limit;

    const items = await TickerItem.find(filter)
      .populate('createdBy', 'firstName lastName email role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await TickerItem.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: items,
    });
  } catch (error) {
    console.error('Get all ticker items error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticker items',
      error: error.message,
    });
  }
};

// @desc    Get single ticker item by ID
// @route   GET /api/ticker/:id
// @access  Private (Admin only)
export const getTickerItemById = async (req, res) => {
  try {
    const item = await TickerItem.findById(req.params.id).populate(
      'createdBy',
      'firstName lastName email role'
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Ticker item not found',
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error('Get ticker item by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching ticker item',
      error: error.message,
    });
  }
};

// @desc    Create manual ticker item
// @route   POST /api/ticker
// @access  Private (Admin only)
export const createTickerItem = async (req, res) => {
  try {
    const tickerData = {
      ...req.body,
      source: 'manual',
      createdBy: req.user._id,
    };

    const ticker = await TickerItem.create(tickerData);

    // Clear cache
    tickerCache.clear();

    res.status(201).json({
      success: true,
      message: 'Ticker item created successfully',
      data: ticker,
    });
  } catch (error) {
    console.error('Create ticker item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating ticker item',
      error: error.message,
    });
  }
};

// @desc    Update ticker item
// @route   PUT /api/ticker/:id
// @access  Private (Admin only)
export const updateTickerItem = async (req, res) => {
  try {
    const item = await TickerItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Ticker item not found',
      });
    }

    // Prevent updating auto-generated items
    if (item.source !== 'manual') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update auto-generated ticker items',
      });
    }

    const updatedItem = await TickerItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('createdBy', 'firstName lastName email role');

    // Clear cache
    tickerCache.clear();

    res.status(200).json({
      success: true,
      message: 'Ticker item updated successfully',
      data: updatedItem,
    });
  } catch (error) {
    console.error('Update ticker item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating ticker item',
      error: error.message,
    });
  }
};

// @desc    Delete ticker item
// @route   DELETE /api/ticker/:id
// @access  Private (Admin only)
export const deleteTickerItem = async (req, res) => {
  try {
    const item = await TickerItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Ticker item not found',
      });
    }

    // Prevent deleting auto-generated items
    if (item.source !== 'manual') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete auto-generated ticker items',
      });
    }

    await item.deleteOne();

    // Clear cache
    tickerCache.clear();

    res.status(200).json({
      success: true,
      message: 'Ticker item deleted successfully',
    });
  } catch (error) {
    console.error('Delete ticker item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting ticker item',
      error: error.message,
    });
  }
};

// @desc    Toggle ticker item active status
// @route   PATCH /api/ticker/:id/toggle
// @access  Private (Admin only)
export const toggleTickerItem = async (req, res) => {
  try {
    const item = await TickerItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Ticker item not found',
      });
    }

    item.isActive = !item.isActive;
    await item.save();

    // Clear cache
    tickerCache.clear();

    res.status(200).json({
      success: true,
      message: `Ticker item ${item.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: item._id,
        isActive: item.isActive,
      },
    });
  } catch (error) {
    console.error('Toggle ticker item error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling ticker item',
      error: error.message,
    });
  }
};

// @desc    Track ticker item click
// @route   POST /api/ticker/:id/track-click
// @access  Public
export const trackClick = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it's a manual ticker item (has MongoDB ID)
    if (!id.startsWith('event-') && !id.startsWith('job-')) {
      const item = await TickerItem.findById(id);

      if (item) {
        await item.incrementClicks();
      }
    }

    // Return success without waiting
    res.status(200).json({
      success: true,
      message: 'Click tracked',
    });
  } catch (error) {
    console.error('Track click error:', error);
    // Don't fail on tracking errors
    res.status(200).json({
      success: true,
      message: 'Click tracking failed, but request processed',
    });
  }
};

// @desc    Track ticker item view
// @route   POST /api/ticker/:id/track-view
// @access  Public
export const trackView = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it's a manual ticker item (has MongoDB ID)
    if (!id.startsWith('event-') && !id.startsWith('job-')) {
      const item = await TickerItem.findById(id);

      if (item) {
        await item.incrementViews();
      }
    }

    // Return success without waiting
    res.status(200).json({
      success: true,
      message: 'View tracked',
    });
  } catch (error) {
    console.error('Track view error:', error);
    // Don't fail on tracking errors
    res.status(200).json({
      success: true,
      message: 'View tracking failed, but request processed',
    });
  }
};

// @desc    Clear ticker cache (utility endpoint for admin)
// @route   POST /api/ticker/clear-cache
// @access  Private (Admin only)
export const clearTickerCache = async (req, res) => {
  try {
    tickerCache.clear();

    res.status(200).json({
      success: true,
      message: 'Ticker cache cleared successfully',
    });
  } catch (error) {
    console.error('Clear cache error:', error);
    res.status(500).json({
      success: false,
      message: 'Error clearing cache',
      error: error.message,
    });
  }
};
