import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LeftSidebar from '../components/dashboard/LeftSidebar';
import RightSidebar from '../components/dashboard/RightSidebar';
import PostCard from '../components/dashboard/PostCard';
import CreatePostModal from '../components/posts/CreatePostModal';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import Button from '../components/common/Button';
import { SkeletonPost } from '../components/common/Skeleton';
import { useAuth } from '../context/AuthContext';
import { getPosts, type Post } from '../services/post.service';
import * as profileCompletionService from '../services/profileCompletion.service';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<string>('');

  // Profile Completion Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileStatus, setProfileStatus] = useState<profileCompletionService.ProfileStatus | null>(null);
  const [loadingProfileStatus, setLoadingProfileStatus] = useState(true);

  // Fetch profile completion status on mount
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        setLoadingProfileStatus(true);
        const status = await profileCompletionService.getProfileStatus();
        setProfileStatus(status);

        // Show modal only if:
        // 1. Profile is incomplete (< 100%)
        // 2. User hasn't seen modal before in this session
        // 3. User hasn't permanently dismissed it
        if (
          status.completionPercentage < 100 &&
          profileCompletionService.shouldShowProfileModal()
        ) {
          setShowProfileModal(true);
          profileCompletionService.markModalShownInSession();
        }
      } catch (err) {
        console.error('Failed to check profile status:', err);
      } finally {
        setLoadingProfileStatus(false);
      }
    };

    checkProfileCompletion();
  }, []);

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
      // Transform images from object array to string array
      images: post.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
      likes: post.likes.length,
      comments: post.comments.length,
      commentsData: post.comments || [], // Pass actual comments data
      isLiked: user ? post.likes.includes(user._id) : false,
      isSaved: Boolean(user && post.savedBy?.includes(user._id)),
      jobDetails: post.jobDetails,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-slate-900 animate-fadeIn animate-gradient transition-colors duration-300">
      <Navbar
        isAuthenticated={true}
        userRole={user?.role}
        userName={`${user?.firstName} ${user?.lastName}`}
        userAvatar={user?.profilePicture}
        unreadNotifications={0}
        unreadMessages={0}
      />

      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-6">
          {/* Left Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 animate-stagger-1">
            <LeftSidebar user={user} />
          </aside>

          {/* Main Feed */}
          <main className="lg:col-span-6 animate-stagger-2">
            {/* Posts Container with Professional Background */}
            <div className="bg-gradient-to-b from-white/50 via-sky-50/40 to-blue-50/50 dark:from-gray-800/70 dark:via-gray-700/40 dark:to-slate-800/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-lg border border-white/70 dark:border-gray-700/50 bg-dot-pattern relative overflow-hidden transition-colors duration-300">
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 dark:from-white/5 via-transparent to-transparent pointer-events-none"></div>
              <div className="relative z-10">
            {/* Create Post Section (Alumni Only) */}
            {user?.role === 'alumni' && (
              <div className="bg-gradient-to-br from-white via-white to-orange-50/30 dark:from-gray-800 dark:via-gray-700 dark:to-orange-900/20 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-orange-100 dark:border-orange-800/30 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="mb-3 sm:mb-4">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white flex items-center">
                    <Plus size={20} className="mr-2 text-orange-600 dark:text-orange-400" />
                    Share with the Community
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">Post updates, job opportunities, or advice to help students and fellow alumni</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  {/* Job Posting Button */}
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="font-bold text-xs sm:text-sm">Post a Job</p>
                      <p className="text-xs opacity-90 mt-0.5 sm:mt-1 hidden sm:block">Share job openings</p>
                    </div>
                  </button>

                  {/* Internship Posting Button */}
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="font-bold text-xs sm:text-sm">Post Internship</p>
                      <p className="text-xs opacity-90 mt-0.5 sm:mt-1 hidden sm:block">Share internships</p>
                    </div>
                  </button>

                  {/* General Post Button */}
                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg sm:rounded-xl p-3 sm:p-4 transition-all transform hover:scale-105 hover:shadow-xl"
                  >
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                    <div className="relative">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <p className="font-bold text-xs sm:text-sm">Create Post</p>
                      <p className="text-xs opacity-90 mt-0.5 sm:mt-1 hidden sm:block">Share updates & advice</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl mb-4 sm:mb-6 overflow-x-auto border-2 border-sky-100/80 dark:border-gray-700/80 hover:shadow-2xl transition-all duration-300 hover:border-sky-200 dark:hover:border-gray-600 scrollbar-hide">
              <div className="flex space-x-1 sm:space-x-1 p-2 sm:p-3 min-w-max sm:min-w-0">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-300 transform hover:scale-105 ${
                      activeFilter === filter.value
                        ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-200/50 dark:shadow-blue-900/50'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-sky-50 dark:hover:bg-gray-700 hover:text-sky-700 dark:hover:text-sky-400'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="space-y-3 sm:space-y-6">
              {isLoading ? (
                <>
                  <SkeletonPost />
                  <SkeletonPost />
                  <SkeletonPost />
                </>
              ) : error ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 text-center transition-colors duration-300">
                  <p className="text-red-600 dark:text-red-400 mb-4 text-sm sm:text-base">{error}</p>
                  <Button variant="primary" size="sm" onClick={fetchPosts}>
                    Try Again
                  </Button>
                </div>
              ) : posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 sm:p-8 text-center transition-colors duration-300">
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm sm:text-base">No posts found</p>
                  {user?.role === 'alumni' && (
                    <Button variant="primary" size="sm" onClick={() => setIsCreatePostOpen(true)}>
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
              <div className="mt-4 sm:mt-6 text-center">
                <Button variant="outline" size="md" onClick={handleLoadMore} className="w-full sm:w-auto">
                  Load More Posts
                </Button>
              </div>
            )}
              </div>
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 animate-stagger-3">
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

      {/* Profile Completion Modal */}
      {profileStatus && (
        <ProfileCompletionModal
          isOpen={showProfileModal}
          completionPercentage={profileStatus.completionPercentage}
          missingFields={profileStatus.missingFields}
          onComplete={async () => {
            try {
              await profileCompletionService.markModalAsSeen();
            } catch (err) {
              console.error('Error marking modal as seen:', err);
            }
          }}
          onDismiss={() => {
            setShowProfileModal(false);
          }}
        />
      )}

      <Footer />
    </div>
  );
};

export default DashboardPage;
