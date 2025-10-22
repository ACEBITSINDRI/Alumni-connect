import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bookmark, Users, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: 'student' | 'alumni';
  profilePicture?: string;
  batch?: string;
  company?: string;
}

interface LeftSidebarProps {
  user: User | null;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ user }) => {
  const navigate = useNavigate();

  // Mock stats - replace with actual API data
  const stats = {
    posts: 12,
    connections: 45,
    saved: 8,
    events: 3,
  };

  // Mock upcoming events - replace with actual API data
  const upcomingEvents = [
    {
      id: '1',
      title: 'Civil Engineering Workshop',
      date: '25 Oct',
      time: '10:00 AM',
    },
    {
      id: '2',
      title: 'Alumni Meetup 2024',
      date: '30 Oct',
      time: '6:00 PM',
    },
  ];

  if (!user) return null;

  return (
    <div className="space-y-6 sticky top-20">
      {/* User Profile Card */}
      <Card variant="elevated" className="overflow-hidden">
        {/* Cover */}
        <div className="h-16 bg-gradient-to-r from-primary-500 to-primary-700"></div>

        {/* Profile Info */}
        <div className="px-4 pb-4 -mt-8">
          <Avatar
            src={user.profilePicture}
            alt={`${user.firstName} ${user.lastName}`}
            size="xl"
            fallback={`${user.firstName?.[0]}${user.lastName?.[0]}`}
            className="border-4 border-white cursor-pointer"
            onClick={() => navigate('/profile')}
          />

          <div className="mt-3">
            <h3
              className="font-semibold text-gray-900 cursor-pointer hover:text-primary-600"
              onClick={() => navigate('/profile')}
            >
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-600">
              {user.role === 'student' ? 'Student' : 'Alumni'}
              {user.batch && ` • Batch of ${user.batch}`}
            </p>
            {user.company && (
              <p className="text-sm text-gray-500 mt-1">{user.company}</p>
            )}
          </div>

          <button
            onClick={() => navigate('/profile/edit')}
            className="w-full mt-4 px-4 py-2 text-sm font-medium text-primary-600 border border-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </Card>

      {/* Quick Stats */}
      <Card variant="elevated" className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
        <div className="space-y-3">
          <StatItem
            icon={<FileText size={18} />}
            label="Posts Created"
            value={stats.posts}
            onClick={() => navigate('/profile?tab=posts')}
          />
          <StatItem
            icon={<Users size={18} />}
            label="Connections"
            value={stats.connections}
            onClick={() => navigate('/profile?tab=connections')}
          />
          <StatItem
            icon={<Bookmark size={18} />}
            label="Saved Posts"
            value={stats.saved}
            onClick={() => navigate('/saved')}
          />
          <StatItem
            icon={<Calendar size={18} />}
            label="Events Registered"
            value={stats.events}
            onClick={() => navigate('/events?filter=my-events')}
          />
        </div>
      </Card>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <Card variant="elevated" className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming Events</h3>
            <button
              onClick={() => navigate('/events')}
              className="text-xs text-primary-600 hover:text-primary-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-xs text-primary-600 font-semibold">
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="text-xs text-primary-600">
                      {event.date.split(' ')[1]}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Links */}
      <Card variant="elevated" className="p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Links</h3>
        <div className="space-y-2">
          <QuickLink
            label="My Posts"
            onClick={() => navigate('/profile?tab=posts')}
          />
          <QuickLink
            label="Saved Posts"
            onClick={() => navigate('/saved')}
          />
          <QuickLink
            label="My Connections"
            onClick={() => navigate('/profile?tab=connections')}
          />
          <QuickLink
            label="Settings"
            onClick={() => navigate('/settings')}
          />
        </div>
      </Card>
    </div>
  );
};

// StatItem Component
interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onClick: () => void;
}

const StatItem: React.FC<StatItemProps> = ({ icon, label, value, onClick }) => (
  <div
    className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <div className="text-primary-600">{icon}</div>
      <span className="text-sm text-gray-700">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-900">{value}</span>
  </div>
);

// QuickLink Component
interface QuickLinkProps {
  label: string;
  onClick: () => void;
}

const QuickLink: React.FC<QuickLinkProps> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
  >
    {label}
  </button>
);

export default LeftSidebar;
