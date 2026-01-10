import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, UserPlus, ExternalLink, Heart, Loader2 } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { getSuggestedConnections, type SuggestedConnection } from '../../services/user.service';
import { sendConnectionRequest } from '../../services/connection.service';

const RightSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [suggestedConnections, setSuggestedConnections] = useState<SuggestedConnection[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
  const [connectingUserId, setConnectingUserId] = useState<string | null>(null);

  // Fetch suggested connections
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await getSuggestedConnections(3);
        if (response.success && response.data) {
          setSuggestedConnections(response.data);
        }
      } catch (error) {
        console.error('Error fetching suggested connections:', error);
      } finally {
        setIsLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, []);

  // Trending topics - TODO: Implement trending topics API
  const trendingTopics: { tag: string; posts: number }[] = [];

  // Featured alumni - TODO: Implement featured alumni API
  const featuredAlumni = null;

  const handleConnect = async (userId: string) => {
    try {
      setConnectingUserId(userId);
      const response = await sendConnectionRequest(userId);

      if (response.success) {
        // Remove from suggestions after successful connection request
        setSuggestedConnections(prev => prev.filter(user => user._id !== userId));
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setConnectingUserId(null);
    }
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
      <Card variant="elevated" className="p-4 border border-neutral-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <UserPlus size={20} className="text-primary-600" />
            <h3 className="font-bold text-neutral-900 text-base">Suggested Connections</h3>
          </div>
        </div>
        <div className="space-y-4">
          {isLoadingSuggestions ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-primary-600" />
            </div>
          ) : suggestedConnections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-500">No suggestions available</p>
            </div>
          ) : (
            suggestedConnections.map((user) => (
              <div key={user._id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200">
                <Avatar
                  src={user.profilePicture}
                  alt={`${user.firstName} ${user.lastName}`}
                  size="md"
                  fallback={`${user.firstName[0]}${user.lastName[0]}`}
                  className="cursor-pointer ring-2 ring-neutral-100"
                  onClick={() => navigate(`/profile/${user._id}`)}
                />
                <div className="flex-1 min-w-0">
                  <h4
                    className="text-sm font-semibold text-neutral-900 truncate cursor-pointer hover:text-primary-600 transition-colors"
                    onClick={() => navigate(`/profile/${user._id}`)}
                  >
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-xs text-neutral-600 truncate font-medium">{user.currentRole || (user.role === 'student' ? 'Student' : 'Alumni')}</p>
                  <p className="text-xs text-neutral-500 truncate">{user.company || `Batch ${user.batch}`}</p>
                  {user.mutualConnections !== undefined && user.mutualConnections > 0 && (
                    <p className="text-xs text-neutral-400 mt-1">
                      {user.mutualConnections} mutual {user.mutualConnections === 1 ? 'connection' : 'connections'}
                    </p>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full font-semibold hover:bg-gradient-to-r hover:from-primary-600 hover:to-primary-500 hover:text-white hover:border-primary-600 transition-all"
                    onClick={() => handleConnect(user._id)}
                    disabled={connectingUserId === user._id}
                  >
                    {connectingUserId === user._id ? (
                      <>
                        <Loader2 size={14} className="mr-1 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <UserPlus size={14} className="mr-1" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
        <button
          onClick={() => navigate('/alumni')}
          className="w-full mt-4 text-sm text-primary-600 hover:text-primary-700 font-semibold transition-colors"
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
