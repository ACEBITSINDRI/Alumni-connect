import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  UserPlus,
  MessageCircle,
  Heart,
  Calendar,
  Briefcase,
  Award,
  Settings,
  Check,
  Trash2,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

interface Notification {
  id: string;
  type: 'connection' | 'message' | 'like' | 'comment' | 'event' | 'opportunity' | 'mention' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');

  // Mock notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'connection',
      title: 'New Connection Request',
      message: 'Priya Sharma wants to connect with you',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      isRead: false,
      actionUrl: '/profile/user123',
      actor: {
        id: 'user123',
        name: 'Priya Sharma',
        avatar: undefined,
      },
    },
    {
      id: '2',
      type: 'like',
      title: 'Post Liked',
      message: 'Rahul Sharma and 12 others liked your post',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isRead: false,
      actionUrl: '/post/post123',
      actor: {
        id: 'user456',
        name: 'Rahul Sharma',
        avatar: undefined,
      },
    },
    {
      id: '3',
      type: 'comment',
      title: 'New Comment',
      message: 'Amit Kumar commented on your post: "Great insights! Thanks for sharing."',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      isRead: false,
      actionUrl: '/post/post123',
      actor: {
        id: 'user789',
        name: 'Amit Kumar',
        avatar: undefined,
      },
    },
    {
      id: '4',
      type: 'event',
      title: 'Event Reminder',
      message: 'Civil Engineering Workshop 2024 starts tomorrow at 10:00 AM',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
      isRead: true,
      actionUrl: '/events/1',
    },
    {
      id: '5',
      type: 'opportunity',
      title: 'New Job Opportunity',
      message: 'A new job posting matches your profile: Senior Civil Engineer at L&T',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12),
      isRead: true,
      actionUrl: '/opportunities/1',
    },
    {
      id: '6',
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from Neha Singh',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      isRead: true,
      actionUrl: '/messages',
      actor: {
        id: 'user101',
        name: 'Neha Singh',
        avatar: undefined,
      },
    },
    {
      id: '7',
      type: 'achievement',
      title: 'Achievement Unlocked',
      message: 'You have reached 100 connections! Keep networking.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      isRead: true,
    },
  ]);

  const getNotificationIcon = (type: Notification['type']) => {
    const iconClass = 'text-white';
    switch (type) {
      case 'connection':
        return <UserPlus size={20} className={iconClass} />;
      case 'message':
        return <MessageCircle size={20} className={iconClass} />;
      case 'like':
        return <Heart size={20} className={iconClass} />;
      case 'comment':
        return <MessageCircle size={20} className={iconClass} />;
      case 'event':
        return <Calendar size={20} className={iconClass} />;
      case 'opportunity':
        return <Briefcase size={20} className={iconClass} />;
      case 'achievement':
        return <Award size={20} className={iconClass} />;
      default:
        return <Bell size={20} className={iconClass} />;
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'connection':
        return 'bg-blue-500';
      case 'message':
        return 'bg-green-500';
      case 'like':
        return 'bg-red-500';
      case 'comment':
        return 'bg-purple-500';
      case 'event':
        return 'bg-orange-500';
      case 'opportunity':
        return 'bg-indigo-500';
      case 'achievement':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return timestamp.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications(
      notifications.map((n) =>
        n.id === notification.id ? { ...n, isRead: true } : n
      )
    );

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications =
    activeFilter === 'unread'
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={true}
        userRole={user?.role}
        userName={`${user?.firstName} ${user?.lastName}`}
        userAvatar={user?.profilePicture}
        unreadNotifications={unreadCount}
        unreadMessages={2}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Notifications
              </h1>
              <p className="text-gray-600 mt-1">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${
                      unreadCount > 1 ? 's' : ''
                    }`
                  : 'All caught up!'}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/settings/notifications')}
            >
              <Settings size={18} className="mr-2" />
              Settings
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1 bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter('unread')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeFilter === 'unread'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* Actions */}
            {notifications.length > 0 && (
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead}>
                    <Check size={16} className="mr-1" />
                    Mark all as read
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleClearAll}>
                  <Trash2 size={16} className="mr-1" />
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.length === 0 ? (
            <Card variant="elevated" className="p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-gray-600">
                  {activeFilter === 'unread'
                    ? "You're all caught up! No unread notifications."
                    : "You don't have any notifications yet."}
                </p>
              </div>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                variant="elevated"
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  !notification.isRead ? 'bg-blue-50 border-l-4 border-primary-500' : ''
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 ${getNotificationColor(
                      notification.type
                    )} rounded-full flex items-center justify-center`}
                  >
                    {getNotificationIcon(notification.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {notification.actor && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar
                              src={notification.actor.avatar}
                              alt={notification.actor.name}
                              size="xs"
                              fallback={notification.actor.name[0]}
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {notification.actor.name}
                            </span>
                          </div>
                        )}
                        <h4 className="text-sm font-semibold text-gray-900 mb-1">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatTimestamp(notification.timestamp)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(notification.id, e)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default NotificationsPage;
