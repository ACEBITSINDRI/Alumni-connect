import React, { useState, useEffect } from 'react';
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
  Loader,
  AlertCircle,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import * as notificationService from '../services/notification.service';

interface Notification {
  _id: string;
  type: 'connection' | 'message' | 'like' | 'comment' | 'event' | 'opportunity' | 'mention' | 'achievement';
  title: string;
  message: string;
  actor?: {
    _id: string;
    name: string;
    profilePicture?: string;
  };
  actionUrl?: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await notificationService.getNotifications();
        setNotifications(data as any);
      } catch (err) {
        setError('Failed to load notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

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

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      try {
        await notificationService.markAsRead(notification._id);
        setNotifications(
          notifications.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n
          )
        );
      } catch (err) {
        console.error('Failed to mark as read:', err);
      }
    }

    // Navigate to action URL if available
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    } else if (notification.actor) {
      // Default navigation to actor's profile for notifications with an actor
      navigate(`/profile/${notification.actor._id}`);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await notificationService.deleteAllNotifications();
      setNotifications([]);
    } catch (err) {
      console.error('Failed to clear all notifications:', err);
    }
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
        unreadMessages={0}
      />

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

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
            {notifications.length > 0 && !loading && (
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
          {loading ? (
            <Card variant="elevated" className="p-12 text-center">
              <Loader size={32} className="animate-spin text-primary-600 mx-auto" />
              <p className="text-gray-500 mt-4">Loading notifications...</p>
            </Card>
          ) : filteredNotifications.length === 0 ? (
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
                key={notification._id}
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
                              src={notification.actor.profilePicture}
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
                          {notificationService.formatNotificationTime(
                            notification.createdAt
                          )}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-2 ml-4">
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification._id, e)}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Mark as read"
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDelete(notification._id, e)}
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
