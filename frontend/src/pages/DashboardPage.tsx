import React, { useState } from 'react';
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

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock posts data - replace with actual API call
  const mockPosts = [
    {
      id: '1',
      author: {
        id: 'user1',
        name: 'Rahul Sharma',
        role: 'Senior Engineer',
        company: 'Larsen & Toubro',
        batch: '2015',
        avatar: undefined,
      },
      type: 'job',
      title: 'Hiring: Civil Engineers for Metro Project',
      content: 'We are looking for experienced civil engineers to join our team for the Mumbai Metro Rail Project. Great opportunity for fresh graduates as well!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      images: [],
      likes: 45,
      comments: 12,
      isLiked: false,
      isSaved: false,
      jobDetails: {
        company: 'Larsen & Toubro',
        location: 'Mumbai, Maharashtra',
        type: 'Full-time',
        salary: '₹6-10 LPA',
      },
    },
    {
      id: '2',
      author: {
        id: 'user2',
        name: 'Priya Singh',
        role: '4th Year Student',
        company: 'BIT Sindri',
        batch: '2024',
        avatar: undefined,
      },
      type: 'question',
      title: 'Need advice on choosing between offers',
      content: 'I have received two job offers - one from a PSU and another from a private construction company. Can alumni help me understand the pros and cons of each?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      images: [],
      likes: 28,
      comments: 34,
      isLiked: true,
      isSaved: false,
    },
    {
      id: '3',
      author: {
        id: 'user3',
        name: 'Amit Kumar',
        role: 'Project Manager',
        company: 'AECOM',
        batch: '2010',
        avatar: undefined,
      },
      type: 'advice',
      title: 'Career Growth in Construction Industry',
      content: 'After 14 years in the construction industry, here are my top 5 tips for career growth: 1) Never stop learning 2) Build strong networks 3) Take calculated risks 4) Focus on leadership skills 5) Stay updated with technology',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 10),
      images: [],
      likes: 156,
      comments: 45,
      isLiked: false,
      isSaved: true,
    },
  ];

  const filters = [
    { label: 'All Posts', value: 'all' },
    { label: 'Jobs', value: 'jobs' },
    { label: 'Internships', value: 'internships' },
    { label: 'Advice', value: 'advice' },
    { label: 'Events', value: 'events' },
    { label: 'Questions', value: 'questions' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={true}
        userRole={user?.role}
        userName={`${user?.firstName} ${user?.lastName}`}
        userAvatar={user?.profilePicture}
        unreadNotifications={3}
        unreadMessages={2}
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
              <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <button
                  onClick={() => setIsCreatePostOpen(true)}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Plus size={20} className="text-primary-600" />
                  </div>
                  <span className="text-gray-600">What do you want to share?</span>
                </button>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6 overflow-x-auto">
              <div className="flex space-x-1 p-2">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === filter.value
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
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
              ) : (
                mockPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))
              )}
            </div>

            {/* Load More */}
            <div className="mt-6 text-center">
              <Button variant="outline" size="lg">
                Load More Posts
              </Button>
            </div>
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
        />
      )}

      <Footer />
    </div>
  );
};

export default DashboardPage;
