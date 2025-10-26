import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LeftSidebar from '../components/dashboard/LeftSidebar';
import RightSidebar from '../components/dashboard/RightSidebar';
import PostCard from '../components/dashboard/PostCard';
import CreatePostModal from '../components/posts/CreatePostModal';
import Button from '../components/common/Button';
import { SkeletonPost } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { getPosts, type Post } from '../services/post.service';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string>('');

  // Fetch posts on component mount and when filter changes
  useEffect(() => {
    fetchPosts();
  }, [activeFilter, currentPage]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getPosts(currentPage, 10, activeFilter);

      if (response.success && response.data) {
        setPosts(response.data.posts);
        setTotalPages(response.data.pages);
      } else {
        setError(response.message || 'Failed to fetch posts');
      }
    } catch (err: any) {
      console.error('Fetch posts error:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = () => {
    // Refresh posts after creating a new one
    fetchPosts();
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const filters = [
    { label: 'All Posts', value: 'all' },
    { label: 'Jobs', value: 'job' },
    { label: 'Internships', value: 'internship' },
    { label: 'Advice', value: 'advice' },
    { label: 'Events', value: 'event' },
    { label: 'Questions', value: 'question' },
  ];

  // Transform API post data to match PostCard interface
  const transformPost = (post: Post) => {
    return {
      id: post._id,
      author: {
        id: post.author._id,
        name: `${post.author.firstName} ${post.author.lastName}`,
        role: post.author.currentRole || (post.author.role === 'student' ? 'Student' : 'Alumni'),
        company: post.author.company || 'BIT Sindri',
        batch: post.author.batch || '',
        avatar: post.author.profilePicture,
      },
      type: post.type,
      title: post.title,
      content: post.content,
      timestamp: new Date(post.createdAt),
      images: post.images,
      likes: post.likes.length,
      comments: post.comments.length,
      isLiked: user ? post.likes.includes(user._id) : false,
      isSaved: false, // TODO: Implement saved posts feature
      jobDetails: post.jobDetails,
    };
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar
        isAuthenticated={true}
        userRole={user?.role}
        userName={`${user?.firstName} ${user?.lastName}`}
        userAvatar={user?.profilePicture}
        unreadNotifications={0}
        unreadMessages={0}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <LeftSidebar user={user} />
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6">
            {/* Create Post Button (Alumni Only) */}
            {user?.role === 'alumni' && (
              <div className="bg-white rounded-xl shadow-soft p-4 mb-6 border border-neutral-100">
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-all text-left group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                    <Plus size={20} className="text-white" />
                  </div>
                  <span className="text-neutral-600 font-medium">What do you want to share?</span>
                </button>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-soft mb-6 overflow-x-auto border border-neutral-100">
              <div className="flex space-x-1 p-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                      activeFilter === filter.value
                        ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {isLoading ? (
                <>
                  <SkeletonPost />
                  <SkeletonPost />
                  <SkeletonPost />
                </>
              ) : error ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button variant="primary" onClick={fetchPosts}>
                    Try Again
                  </Button>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                  <p className="text-gray-600 mb-4">No posts found</p>
                  {user?.role === 'alumni' && (
                    <Button variant="primary" onClick={() => setIsCreatePostOpen(true)}>
                      Create First Post
                    </Button>
                  )}
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard key={post._id} post={transformPost(post)} />
                ))
              )}
            </div>

            {/* Load More */}
            {!isLoading && posts.length > 0 && currentPage < totalPages && (
              <div className="mt-6 text-center">
                <Button variant="outline" size="lg" onClick={handleLoadMore}>
                  Load More Posts
                </Button>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <RightSidebar />
          </aside>
        </div>
      </div>

      {/* Create Post Modal */}
      {isCreatePostOpen && (
        <CreatePostModal
          isOpen={isCreatePostOpen}
          onClose={() => setIsCreatePostOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}

      <Footer />
    </div>
  );
};

export default DashboardPage;
