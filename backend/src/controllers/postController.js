import Post from '../models/Post.js';
import { getUserModel } from '../models/User.js';
import { uploadPostImage, deleteFromCloudinary, deleteMultipleFromCloudinary } from '../config/cloudinary.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const { content, title, type, jobDetails, visibility } = req.body;

    // Validate content
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Post content is required',
      });
    }

    // Prepare post data
    const postData = {
      author: req.user._id,
      authorRole: req.user.role,
      content,
      type: type || 'general',
      visibility: visibility || 'public',
    };

    if (title) postData.title = title;
    if (jobDetails) postData.jobDetails = JSON.parse(jobDetails);

    // Handle image uploads
    const uploadedImages = [];
    if (req.files && req.files.length > 0) {
      try {
        for (const file of req.files) {
          const result = await uploadPostImage(file.buffer, req.user._id.toString());
          uploadedImages.push({
            url: result.url,
            publicId: result.publicId,
          });
        }
        postData.images = uploadedImages;
      } catch (uploadError) {
        console.error('Image upload error:', uploadError);
        // Clean up any uploaded images
        if (uploadedImages.length > 0) {
          const publicIds = uploadedImages.map(img => img.publicId);
          await deleteMultipleFromCloudinary(publicIds);
        }
        return res.status(500).json({
          success: false,
          message: 'Failed to upload images',
        });
      }
    }

    // Create post
    const post = await Post.create(postData);

    // Populate author details
    await post.populate({
      path: 'author',
      select: 'firstName lastName profilePicture currentRole company batch role',
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating post',
    });
  }
};

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type;
    const authorId = req.query.author;

    // Build query
    const query = { isActive: true };
    if (type) query.type = type;
    if (authorId) query.author = authorId;

    // Get total count
    const total = await Post.countDocuments(query);

    // Get posts with pagination
    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'author',
        select: 'firstName lastName profilePicture currentRole company batch role',
      })
      .populate({
        path: 'comments.user',
        select: 'firstName lastName profilePicture role',
      })
      .populate({
        path: 'comments.replies.user',
        select: 'firstName lastName profilePicture role',
      })
      .populate({
        path: 'likes.user',
        select: 'firstName lastName profilePicture role',
      });

    res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          postsPerPage: limit,
          hasNextPage: page < Math.ceil(total / limit),
          hasPrevPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching posts',
    });
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'author',
        select: 'firstName lastName profilePicture currentRole company batch role bio',
      })
      .populate({
        path: 'comments.user',
        select: 'firstName lastName profilePicture role',
      })
      .populate({
        path: 'comments.replies.user',
        select: 'firstName lastName profilePicture role',
      })
      .populate({
        path: 'likes.user',
        select: 'firstName lastName profilePicture role',
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Increment view count
    post.views += 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Get post by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching post',
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this post',
      });
    }

    const { content, title, type, visibility } = req.body;

    // Update fields
    if (content) post.content = content;
    if (title !== undefined) post.title = title;
    if (type) post.type = type;
    if (visibility) post.visibility = visibility;

    await post.save();

    // Populate author details
    await post.populate({
      path: 'author',
      select: 'firstName lastName profilePicture currentRole company batch role',
    });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating post',
    });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this post',
      });
    }

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      try {
        const publicIds = post.images.map(img => img.publicId).filter(id => id);
        if (publicIds.length > 0) {
          await deleteMultipleFromCloudinary(publicIds);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting images from Cloudinary:', cloudinaryError);
        // Continue with post deletion even if Cloudinary deletion fails
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting post',
    });
  }
};

// @desc    Like/Unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    let message;
    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
      message = 'Post unliked';
    } else {
      // Like the post
      post.likes.push({ user: req.user._id });
      message = 'Post liked';
    }

    await post.save();

    // Populate the post
    await post.populate({
      path: 'author',
      select: 'firstName lastName profilePicture currentRole company batch role',
    });

    res.status(200).json({
      success: true,
      message,
      data: {
        postId: post._id,
        likeCount: post.likes.length,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking post',
    });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
// @access  Private
export const commentOnPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required',
      });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = {
      user: req.user._id,
      content,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();

    // Populate the newly added comment
    await post.populate({
      path: 'comments.user',
      select: 'firstName lastName profilePicture role',
    });

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: newComment,
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding comment',
    });
  }
};

// @desc    Like/Unlike a comment
// @route   POST /api/posts/:id/comments/:commentId/like
// @access  Private
export const likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user already liked the comment
    const likeIndex = comment.likes.findIndex(
      like => like.user.toString() === req.user._id.toString()
    );

    let message;
    if (likeIndex > -1) {
      // Unlike the comment
      comment.likes.splice(likeIndex, 1);
      message = 'Comment unliked';
    } else {
      // Like the comment
      comment.likes.push({ user: req.user._id });
      message = 'Comment liked';
    }

    await post.save();

    res.status(200).json({
      success: true,
      message,
      data: {
        commentId: comment._id,
        likeCount: comment.likes.length,
        isLiked: likeIndex === -1,
      },
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error liking comment',
    });
  }
};

// @desc    Delete comment
// @route   DELETE /api/posts/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if user is the comment author or post author
    if (
      comment.user.toString() !== req.user._id.toString() &&
      post.author.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this comment',
      });
    }

    comment.deleteOne();
    await post.save();

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting comment',
    });
  }
};
