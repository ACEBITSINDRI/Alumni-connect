import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Send,
  MapPin,
  Briefcase,
  Calendar,
  DollarSign,
  ExternalLink,
  Flag,
  Trash2,
  Edit,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

interface Comment {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    batch?: string;
    avatar?: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface Post {
  id: string;
  author: {
    id: string;
    name: string;
    role: string;
    company?: string;
    batch?: string;
    avatar?: string;
  };
  type: 'general' | 'advice' | 'achievement' | 'job';
  title?: string;
  content: string;
  timestamp: Date;
  images?: string[];
  likes: number;
  commentsCount: number;
  shares: number;
  isLiked: boolean;
  isSaved: boolean;
  jobDetails?: {
    company: string;
    location: string;
    type: string;
    experience: string;
    salary?: string;
    applyUrl?: string;
  };
}

const PostDetailPage: React.FC = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [commentInput, setCommentInput] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  // Mock post data
  const [post, setPost] = useState<Post>({
    id: postId || '1',
    author: {
      id: 'user1',
      name: 'Rahul Sharma',
      role: 'Senior Engineer',
      company: 'Larsen & Toubro',
      batch: '2015',
      avatar: undefined,
    },
    type: 'advice',
    title: 'Career Growth Tips for Civil Engineers',
    content: `After 9 years in the industry, here are my top 5 tips for civil engineers looking to grow their careers:

1. **Master Project Management**: Technical skills are important, but understanding project management, budgeting, and stakeholder communication will set you apart.

2. **Learn Modern Tools**: Beyond AutoCAD, familiarize yourself with BIM software like Revit, structural analysis tools like STAAD Pro, and project management software.

3. **Build Your Network**: Attend industry events, join professional organizations like ICE or ASCE, and stay connected with your college alumni network.

4. **Get Site Experience**: Don't shy away from site work. Understanding on-ground challenges makes you a better designer and project manager.

5. **Keep Learning**: The construction industry is evolving with new materials, sustainability practices, and technologies. Stay updated through courses and certifications.

Remember, every project is a learning opportunity. Stay curious, ask questions, and don't be afraid to take on challenging assignments.

What are your experiences? What would you add to this list?`,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    images: [],
    likes: 156,
    commentsCount: 34,
    shares: 23,
    isLiked: false,
    isSaved: true,
  });

  // Mock comments data
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      author: {
        id: 'user2',
        name: 'Priya Singh',
        role: 'Project Manager',
        batch: '2016',
        avatar: undefined,
      },
      content:
        'Excellent advice! I would also add the importance of understanding sustainability and green building practices. It\'s becoming increasingly crucial in modern projects.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
      likes: 23,
      isLiked: false,
      replies: [
        {
          id: 'c1r1',
          author: {
            id: 'user1',
            name: 'Rahul Sharma',
            role: 'Senior Engineer',
            batch: '2015',
            avatar: undefined,
          },
          content:
            'Absolutely! Sustainability is no longer optional. LEED and GRIHA certifications are great additions to any civil engineer\'s profile.',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 30),
          likes: 8,
          isLiked: false,
        },
      ],
    },
    {
      id: 'c2',
      author: {
        id: 'user3',
        name: 'Amit Kumar',
        role: 'Final Year Student',
        batch: '2025',
        avatar: undefined,
      },
      content:
        'Thank you so much for sharing this! As a final year student, this is exactly the kind of guidance I needed. Could you recommend some good online courses for project management?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20),
      likes: 15,
      isLiked: true,
    },
    {
      id: 'c3',
      author: {
        id: 'user4',
        name: 'Neha Gupta',
        role: 'Structural Designer',
        batch: '2018',
        avatar: undefined,
      },
      content:
        'Point #4 is so important! My site experience has helped me design better structures because I understand construction challenges.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      likes: 19,
      isLiked: false,
    },
  ]);

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleLike = () => {
    setPost({ ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked });
  };

  const handleSave = () => {
    setPost({ ...post, isSaved: !post.isSaved });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Post link copied to clipboard!');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    const newComment: Comment = {
      id: `c${Date.now()}`,
      author: {
        id: currentUser?.id || 'me',
        name: `${currentUser?.firstName} ${currentUser?.lastName}`,
        role: currentUser?.currentRole || 'User',
        batch: currentUser?.batch,
        avatar: currentUser?.profilePicture,
      },
      content: commentInput,
      timestamp: new Date(),
      likes: 0,
      isLiked: false,
    };

    if (replyingTo) {
      // Add as reply
      setComments(
        comments.map((comment) => {
          if (comment.id === replyingTo) {
            return {
              ...comment,
              replies: [...(comment.replies || []), newComment],
            };
          }
          return comment;
        })
      );
      setReplyingTo(null);
    } else {
      // Add as new comment
      setComments([newComment, ...comments]);
    }

    setCommentInput('');
    setPost({ ...post, commentsCount: post.commentsCount + 1 });
  };

  const handleCommentLike = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked,
          };
        }
        return comment;
      })
    );
  };

  const isOwnPost = post.author.id === currentUser?.id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={true}
        userRole={currentUser?.role}
        userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
        userAvatar={currentUser?.profilePicture}
        unreadNotifications={3}
        unreadMessages={2}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Card */}
            <Card variant="elevated" className="overflow-hidden">
              {/* Post Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <Avatar
                      src={post.author.avatar}
                      alt={post.author.name}
                      size="lg"
                      fallback={post.author.name[0]}
                      onClick={() => navigate(`/profile/${post.author.id}`)}
                      className="cursor-pointer"
                    />
                    <div className="flex-1">
                      <h3
                        className="font-semibold text-gray-900 hover:text-primary-600 cursor-pointer"
                        onClick={() => navigate(`/profile/${post.author.id}`)}
                      >
                        {post.author.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {post.author.role}
                        {post.author.company && ` @ ${post.author.company}`}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {post.author.batch && (
                          <Badge variant="primary" size="sm">
                            Batch {post.author.batch}
                          </Badge>
                        )}
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(post.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="relative">
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="p-6">
                {post.title && (
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{post.title}</h2>
                )}
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>

                {/* Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {post.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                {/* Job Details */}
                {post.type === 'job' && post.jobDetails && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <Briefcase size={16} className="text-gray-500" />
                        <span>{post.jobDetails.company}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin size={16} className="text-gray-500" />
                        <span>{post.jobDetails.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span>
                          {post.jobDetails.type} • {post.jobDetails.experience}
                        </span>
                      </div>
                      {post.jobDetails.salary && (
                        <div className="flex items-center space-x-2">
                          <DollarSign size={16} className="text-gray-500" />
                          <span>{post.jobDetails.salary}</span>
                        </div>
                      )}
                    </div>
                    {post.jobDetails.applyUrl && (
                      <a
                        href={post.jobDetails.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <span>Apply Now</span>
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Post Actions */}
              <div className="px-6 pb-6">
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={handleLike}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        post.isLiked
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Heart size={20} fill={post.isLiked ? 'currentColor' : 'none'} />
                      <span className="font-medium">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                      <MessageCircle size={20} />
                      <span className="font-medium">{post.commentsCount}</span>
                    </button>
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <Share2 size={20} />
                      <span className="font-medium">{post.shares}</span>
                    </button>
                  </div>
                  <button
                    onClick={handleSave}
                    className={`p-2 rounded-lg transition-colors ${
                      post.isSaved
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Bookmark size={20} fill={post.isSaved ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </Card>

            {/* Comments Section */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Comments ({post.commentsCount})
              </h3>

              {/* Comment Input */}
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex items-start space-x-3">
                  <Avatar
                    src={currentUser?.profilePicture}
                    alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
                    size="md"
                    fallback={`${currentUser?.firstName?.[0] || ''}${
                      currentUser?.lastName?.[0] || ''
                    }`}
                  />
                  <div className="flex-1">
                    {replyingTo && (
                      <div className="mb-2 text-sm text-gray-600">
                        Replying to comment...
                        <button
                          type="button"
                          onClick={() => setReplyingTo(null)}
                          className="ml-2 text-primary-600 hover:underline"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Write a comment..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                    <div className="mt-2 flex justify-end">
                      <Button type="submit" variant="primary" size="sm">
                        <Send size={16} className="mr-2" />
                        Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id}>
                    <div className="flex items-start space-x-3">
                      <Avatar
                        src={comment.author.avatar}
                        alt={comment.author.name}
                        size="md"
                        fallback={comment.author.name[0]}
                      />
                      <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {comment.author.name}
                              </h4>
                              <p className="text-xs text-gray-600">
                                {comment.author.role}
                                {comment.author.batch && ` • Batch ${comment.author.batch}`}
                              </p>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 ml-4">
                          <button
                            onClick={() => handleCommentLike(comment.id)}
                            className={`text-sm font-medium transition-colors ${
                              comment.isLiked
                                ? 'text-red-600'
                                : 'text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {comment.isLiked ? 'Liked' : 'Like'} ({comment.likes})
                          </button>
                          <button
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                          >
                            Reply
                          </button>
                        </div>

                        {/* Replies */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="mt-4 space-y-4 ml-8">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-3">
                                <Avatar
                                  src={reply.author.avatar}
                                  alt={reply.author.name}
                                  size="sm"
                                  fallback={reply.author.name[0]}
                                />
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                      <h5 className="text-sm font-semibold text-gray-900">
                                        {reply.author.name}
                                      </h5>
                                      <span className="text-xs text-gray-500">
                                        {formatTimestamp(reply.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-700">{reply.content}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 mt-1 ml-3">
                                    <button className="text-xs font-medium text-gray-600 hover:text-gray-900">
                                      Like ({reply.likes})
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Author Info */}
            <Card variant="elevated" className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Author</h3>
              <div className="text-center mb-4">
                <Avatar
                  src={post.author.avatar}
                  alt={post.author.name}
                  size="xl"
                  fallback={post.author.name[0]}
                  className="mx-auto mb-3"
                />
                <h4 className="font-semibold text-gray-900">{post.author.name}</h4>
                <p className="text-sm text-gray-600">
                  {post.author.role}
                  {post.author.company && ` @ ${post.author.company}`}
                </p>
                {post.author.batch && (
                  <Badge variant="primary" size="sm" className="mt-2">
                    Batch {post.author.batch}
                  </Badge>
                )}
              </div>
              {!isOwnPost && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/profile/${post.author.id}`)}
                >
                  View Profile
                </Button>
              )}
            </Card>

            {/* Post Actions */}
            {isOwnPost && (
              <Card variant="elevated" className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Post Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                    <Edit size={16} />
                    <span>Edit Post</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={16} />
                    <span>Delete Post</span>
                  </button>
                </div>
              </Card>
            )}

            {!isOwnPost && (
              <Card variant="elevated" className="p-4">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <Flag size={16} />
                  <span>Report Post</span>
                </button>
              </Card>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PostDetailPage;
