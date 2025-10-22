import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, UserPlus, ExternalLink, Heart } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

const RightSidebar: React.FC = () => {
  const navigate = useNavigate();

  // Mock data - replace with actual API calls
  const trendingTopics = [
    { tag: '#CivilEngineering', posts: 234 },
    { tag: '#JobOpportunities', posts: 189 },
    { tag: '#MetroProjects', posts: 156 },
    { tag: '#Internships', posts: 142 },
    { tag: '#ConstructionTech', posts: 98 },
  ];

  const featuredAlumni = {
    id: 'featured1',
    name: 'Dr. Rajesh Gupta',
    role: 'Chief Engineer',
    company: 'National Highways Authority of India',
    batch: '2005',
    avatar: undefined,
    description: 'Leading infrastructure development projects across India',
  };

  const suggestedConnections = [
    {
      id: '1',
      name: 'Anjali Mehta',
      role: 'Structural Engineer',
      company: 'Tata Projects',
      batch: '2018',
      avatar: undefined,
      mutualConnections: 5,
    },
    {
      id: '2',
      name: 'Vikram Reddy',
      role: 'Site Engineer',
      company: 'L&T Construction',
      batch: '2019',
      avatar: undefined,
      mutualConnections: 3,
    },
    {
      id: '3',
      name: 'Sneha Patel',
      role: '3rd Year Student',
      company: 'BIT Sindri',
      batch: '2025',
      avatar: undefined,
      mutualConnections: 8,
    },
  ];

  const handleConnect = (userId: string) => {
    // TODO: API call to send connection request
    console.log('Connect with user:', userId);
  };

  return (
    <div className="space-y-6 sticky top-20">
      {/* Trending Topics */}
      <Card variant="elevated" className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TrendingUp size={20} className="text-primary-600" />
          <h3 className="font-semibold text-gray-900">Trending Topics</h3>
        </div>
        <div className="space-y-3">
          {trendingTopics.map((topic, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => navigate(`/search?q=${encodeURIComponent(topic.tag)}`)}
            >
              <div>
                <p className="text-sm font-medium text-primary-600">{topic.tag}</p>
                <p className="text-xs text-gray-500">{topic.posts} posts</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Featured Alumni */}
      <Card variant="elevated" className="p-4">
        <Badge variant="warning" size="sm" className="mb-3">
          Alumni of the Month
        </Badge>
        <div className="text-center">
          <Avatar
            src={featuredAlumni.avatar}
            alt={featuredAlumni.name}
            size="xl"
            fallback={featuredAlumni.name}
            className="mx-auto mb-3"
          />
          <h4 className="font-semibold text-gray-900 mb-1">{featuredAlumni.name}</h4>
          <p className="text-sm text-gray-600 mb-1">{featuredAlumni.role}</p>
          <p className="text-sm text-gray-500 mb-2">{featuredAlumni.company}</p>
          <Badge variant="primary" size="sm" className="mb-3">
            Batch of {featuredAlumni.batch}
          </Badge>
          <p className="text-xs text-gray-600 mb-4">{featuredAlumni.description}</p>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => navigate(`/profile/${featuredAlumni.id}`)}
          >
            View Profile
          </Button>
        </div>
      </Card>

      {/* Suggested Connections */}
      <Card variant="elevated" className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <UserPlus size={20} className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">Suggested Connections</h3>
          </div>
        </div>
        <div className="space-y-4">
          {suggestedConnections.map((user) => (
            <div key={user.id} className="flex items-start space-x-3">
              <Avatar
                src={user.avatar}
                alt={user.name}
                size="md"
                fallback={user.name}
                className="cursor-pointer"
                onClick={() => navigate(`/profile/${user.id}`)}
              />
              <div className="flex-1 min-w-0">
                <h4
                  className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:text-primary-600"
                  onClick={() => navigate(`/profile/${user.id}`)}
                >
                  {user.name}
                </h4>
                <p className="text-xs text-gray-600 truncate">{user.role}</p>
                <p className="text-xs text-gray-500 truncate">{user.company}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {user.mutualConnections} mutual connections
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => handleConnect(user.id)}
                >
                  <UserPlus size={14} className="mr-1" />
                  Connect
                </Button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => navigate('/alumni')}
          className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          View All Alumni →
        </button>
      </Card>

      {/* Quick Actions */}
      <Card variant="elevated" className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <QuickActionButton
            icon={<Heart size={16} />}
            label="Donate to ACE"
            onClick={() => navigate('/donations')}
          />
          <QuickActionButton
            icon={<UserPlus size={16} />}
            label="Refer Alumni"
            onClick={() => navigate('/refer')}
          />
        </div>
      </Card>

      {/* ACE Website Link */}
      <Card variant="elevated" className="p-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Visit ACE BIT Sindri</h3>
          <ExternalLink size={18} />
        </div>
        <p className="text-sm text-gray-100 mb-4">
          Explore more about the Association of Civil Engineers
        </p>
        <a
          href="https://acebits.in"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full px-4 py-2 bg-white text-primary-700 text-center rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Visit Website
        </a>
      </Card>
    </div>
  );
};

// QuickActionButton Component
interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default RightSidebar;
