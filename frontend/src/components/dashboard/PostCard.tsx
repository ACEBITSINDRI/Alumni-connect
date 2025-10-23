import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Bookmark, MoreVertical, Briefcase, MapPin, DollarSign, Send } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { likePost, unlikePost, addComment } from '../../services/post.service';
import { useAuth } from '../../context/AuthContext';

interface PostAuthor {
  id: string;
  name: string;
  role: string;
  company: string;
  batch: string;
  avatar?: string;
}

interface JobDetails {
  company: string;
  location: string;
  type: string;
  salary?: string;
}

interface Post {
  id: string;
  author: PostAuthor;
  type: 'job' | 'internship' | 'advice' | 'event' | 'question' | 'general';
  title: string;
  content: string;
  timestamp: Date;
  images?: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  isSaved: boolean;
  jobDetails?: JobDetails;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likes, setLikes] = useState(post.likes);
  const [comments, setComments] = useState(post.comments);
  const [showFullContent, setShowFullContent] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLikingPost, setIsLikingPost] = useState(false);

  const handleLike = async () => {
    if (!user || isLikingPost) return;

    setIsLikingPost(true);
    const previousLiked = isLiked;
    const previousLikes = likes;

    // Optimistic update
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);

    try {
      if (isLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (error) {
      console.error('Like/unlike error:', error);
      // Revert on error
      setIsLiked(previousLiked);
      setLikes(previousLikes);
    } finally {
      setIsLikingPost(false);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: API call to save/unsave post
  };

  const handleAddComment = async () => {
    if (!user || !commentText.trim() || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      const response = await addComment(post.id, commentText);

      if (response.success) {
        // Update comment count
        setComments(comments + 1);
        setCommentText('');
        setShowCommentBox(false);
        // Optionally navigate to post detail to show the new comment
        // navigate(`/post/${post.id}`);
      }
    } catch (error) {
      console.error('Add comment error:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share post:', post.id);
  };

  const getPostTypeBadge = () => {
    const typeConfig = {
      job: { label: 'Job Opportunity', variant: 'success' as const },
      internship: { label: 'Internship', variant: 'info' as const },
      advice: { label: 'Career Advice', variant: 'primary' as const },
      event: { label: 'Event', variant: 'warning' as const },
      question: { label: 'Question', variant: 'secondary' as const },
      general: { label: 'Post', variant: 'default' as const },
    };

    const config = typeConfig[post.type];
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getRelativeTime = (timestamp: Date) => {
    const seconds = Math.floor((Date.now() - timestamp.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return timestamp.toLocaleDateString();
  };

  const truncateContent = (text: string, maxLength: number = 200) => {
    if (text.length <= maxLength || showFullContent) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Card variant="elevated" className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Post Header */}
      <div className="p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-3 flex-1">
            <Avatar
              src={post.author.avatar}
              alt={post.author.name}
              size="md"
              fallback={post.author.name}
              className="cursor-pointer"
              onClick={() => navigate(`/profile/${post.author.id}`)}
            />
            <div className="flex-1 min-w-0">
              <h3
                className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer truncate"
                onClick={() => navigate(`/profile/${post.author.id}`)}
              >
                {post.author.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {post.author.role} {post.author.company && `@ ${post.author.company}`}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500 mt-0.5">
                <span>Batch of {post.author.batch}</span>
                <span>•</span>
                <span>{getRelativeTime(post.timestamp)}</span>
              </div>
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Post Type Badge */}
        <div className="mb-3">{getPostTypeBadge()}</div>

        {/* Post Title */}
        <h2
          className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-primary-600"
          onClick={() => navigate(`/post/${post.id}`)}
        >
          {post.title}
        </h2>

        {/* Post Content */}
        <p className="text-gray-700 mb-3 whitespace-pre-wrap">
          {truncateContent(post.content)}
          {post.content.length > 200 && !showFullContent && (
            <button
              onClick={() => setShowFullContent(true)}
              className="text-primary-600 hover:text-primary-700 font-medium ml-1"
            >
              Read more
            </button>
          )}
        </p>

        {/* Job Details (if applicable) */}
        {post.type === 'job' && post.jobDetails && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <Briefcase size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{post.jobDetails.company}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-blue-600 flex-shrink-0" />
                <span className="text-gray-700">{post.jobDetails.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="info" size="sm">{post.jobDetails.type}</Badge>
              </div>
              {post.jobDetails.salary && (
                <div className="flex items-center space-x-2">
                  <DollarSign size={16} className="text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{post.jobDetails.salary}</span>
                </div>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full mt-3"
              onClick={() => navigate(`/opportunity/${post.id}`)}
            >
              View Details & Apply
            </Button>
          </div>
        )}

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className={`grid gap-2 mb-3 ${
            post.images.length === 1 ? 'grid-cols-1' :
            post.images.length === 2 ? 'grid-cols-2' :
            'grid-cols-2'
          }`}>
            {post.images.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
              >
                <img
                  src={image}
                  alt={`Post image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {post.images!.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">
                      +{post.images!.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 py-3 border-t border-gray-200">
          <span>{likes} likes</span>
          <span>{comments} comments</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
          <button
            onClick={handleLike}
            disabled={isLikingPost}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? 'text-red-600 bg-red-50'
                : 'text-gray-600 hover:bg-gray-100'
            } ${isLikingPost ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="font-medium">Like</span>
          </button>

          <button
            onClick={() => setShowCommentBox(!showCommentBox)}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <MessageCircle size={20} />
            <span className="font-medium">Comment</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Share2 size={20} />
            <span className="font-medium hidden sm:inline">Share</span>
          </button>

          <button
            onClick={handleSave}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isSaved
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
            <span className="font-medium hidden sm:inline">Save</span>
          </button>
        </div>

        {/* Comment Box */}
        {showCommentBox && (
          <div className="pt-4 border-t border-gray-200 mt-3">
            <div className="flex space-x-3">
              <Avatar
                src={user?.profilePicture}
                alt={user ? `${user.firstName} ${user.lastName}` : 'User'}
                size="sm"
                fallback={user ? `${user.firstName[0]}${user.lastName[0]}` : 'U'}
              />
              <div className="flex-1">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <div className="flex justify-end mt-2 space-x-2">
                  <button
                    onClick={() => {
                      setShowCommentBox(false);
                      setCommentText('');
                    }}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || isSubmittingComment}
                    className={`flex items-center space-x-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
                      commentText.trim() && !isSubmittingComment
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={14} />
                    <span>{isSubmittingComment ? 'Posting...' : 'Post'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PostCard;
