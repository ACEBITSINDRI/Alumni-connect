import Opportunity from '../models/Opportunity.js';
import { opportunityCache } from '../utils/cache.js';

// @desc    Get all opportunities with filters
// @route   GET /api/opportunities
// @access  Public
export const getOpportunities = async (req, res) => {
  try {
    const {
      status,
      type,
      category,
      location,
      workMode,
      page = 1,
      limit = 10,
      sort = '-createdAt',
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

    if (category) {
      filter.category = category;
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (workMode) {
      filter.workMode = workMode;
    }

    // Search by title, company, or description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const opportunities = await Opportunity.find(filter)
      .populate('postedBy', 'firstName lastName profilePicture role company')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Opportunity.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: opportunities.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: opportunities,
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunities',
      error: error.message,
    });
  }
};

// @desc    Get recent opportunities for ticker (last 7 days)
// @route   GET /api/opportunities/recent/ticker
// @access  Public
export const getRecentForTicker = async (req, res) => {
  try {
    // Check cache first
    const cacheKey = 'recent-opportunities-ticker';
    const cached = opportunityCache.get(cacheKey);

    if (cached) {
      return res.status(200).json({
        success: true,
        data: cached,
        cached: true,
      });
    }

    const now = new Date();
    const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const opportunities = await Opportunity.find({
      status: 'active',
      isActive: true,
      createdAt: {
        $gte: lastWeek,
      },
      deadline: {
        $gte: now, // Not expired
      },
    })
      .select('title company type category location workMode deadline _id')
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(5);

    // Cache for 2 minutes
    opportunityCache.set(cacheKey, opportunities, 120000);

    res.status(200).json({
      success: true,
      data: opportunities,
      cached: false,
    });
  } catch (error) {
    console.error('Get recent opportunities for ticker error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent opportunities',
      error: error.message,
    });
  }
};

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Public
export const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id)
      .populate('postedBy', 'firstName lastName profilePicture role email company')
      .populate('applications.user', 'firstName lastName profilePicture role email');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    // Increment view count
    opportunity.views += 1;
    await opportunity.save();

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error('Get opportunity by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching opportunity',
      error: error.message,
    });
  }
};

// @desc    Create new opportunity
// @route   POST /api/opportunities
// @access  Private
export const createOpportunity = async (req, res) => {
  try {
    const opportunityData = {
      ...req.body,
      postedBy: req.user._id,
      postedByRole: req.user.role,
    };

    const opportunity = await Opportunity.create(opportunityData);

    // Clear cache
    opportunityCache.clear();

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      data: opportunity,
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating opportunity',
      error: error.message,
    });
  }
};

// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Posted by user only)
export const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    // Check if user is the one who posted it
    if (opportunity.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this opportunity',
      });
    }

    // Update opportunity
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('postedBy', 'firstName lastName profilePicture role');

    // Clear cache
    opportunityCache.clear();

    res.status(200).json({
      success: true,
      message: 'Opportunity updated successfully',
      data: updatedOpportunity,
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating opportunity',
      error: error.message,
    });
  }
};

// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Posted by user only)
export const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    // Check if user is the one who posted it
    if (opportunity.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this opportunity',
      });
    }

    await opportunity.deleteOne();

    // Clear cache
    opportunityCache.clear();

    res.status(200).json({
      success: true,
      message: 'Opportunity deleted successfully',
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting opportunity',
      error: error.message,
    });
  }
};

// @desc    Apply to opportunity
// @route   POST /api/opportunities/:id/apply
// @access  Private
export const applyToOpportunity = async (req, res) => {
  try {
    const { resume, coverLetter } = req.body;

    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    // Check if opportunity is active
    if (opportunity.status !== 'active' || !opportunity.isActive) {
      return res.status(400).json({
        success: false,
        message: 'This opportunity is no longer active',
      });
    }

    // Check if deadline has passed
    if (opportunity.isExpired) {
      return res.status(400).json({
        success: false,
        message: 'Application deadline has passed',
      });
    }

    // Check if user has already applied
    const alreadyApplied = opportunity.applications.some(
      (app) => app.user.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied to this opportunity',
      });
    }

    // Add application
    opportunity.applications.push({
      user: req.user._id,
      applicationDate: new Date(),
      status: 'applied',
      resume,
      coverLetter,
    });

    await opportunity.save();

    // Clear cache
    opportunityCache.clear();

    res.status(200).json({
      success: true,
      message: 'Application submitted successfully',
      data: opportunity,
    });
  } catch (error) {
    console.error('Apply to opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting application',
      error: error.message,
    });
  }
};

// @desc    Save/Unsave opportunity
// @route   POST /api/opportunities/:id/save
// @access  Private
export const toggleSaveOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    const userIndex = opportunity.savedBy.indexOf(req.user._id);

    if (userIndex > -1) {
      // User already saved, so unsave
      opportunity.savedBy.splice(userIndex, 1);
    } else {
      // User hasn't saved, so save
      opportunity.savedBy.push(req.user._id);
    }

    await opportunity.save();

    res.status(200).json({
      success: true,
      message: userIndex > -1 ? 'Opportunity unsaved' : 'Opportunity saved',
      data: {
        saveCount: opportunity.savedBy.length,
        isSaved: userIndex === -1,
      },
    });
  } catch (error) {
    console.error('Toggle save opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling save',
      error: error.message,
    });
  }
};

// @desc    Update application status
// @route   PATCH /api/opportunities/:id/applications/:applicationId
// @access  Private (Posted by user only)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id, applicationId } = req.params;

    if (!['applied', 'shortlisted', 'rejected', 'hired'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    const opportunity = await Opportunity.findById(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found',
      });
    }

    // Check if user is the one who posted it
    if (opportunity.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update applications',
      });
    }

    // Find and update the application
    const application = opportunity.applications.id(applicationId);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    application.status = status;
    await opportunity.save();

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application,
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating application status',
      error: error.message,
    });
  }
};
