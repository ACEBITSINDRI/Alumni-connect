import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  Shield,
  Globe,
  Mail,
  Smartphone,
  Trash2,
  Download,
  Save,
  Camera,
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { updateProfile, uploadProfilePicture } from '../services/user.service';
import toast from 'react-hot-toast';

const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Profile settings state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: typeof user?.location === 'object'
      ? `${user.location.city}, ${user.location.state}`
      : (user?.location || ''),
    linkedinUrl: user?.linkedinUrl || '',
    currentRole: user?.currentRole || '',
    company: user?.company || '',
  });

  // Privacy settings state
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public' as 'public' | 'connections' | 'private',
    showEmail: true,
    showPhone: false,
    showExperience: true,
    allowMessages: 'everyone' as 'everyone' | 'connections' | 'none',
    showOnlineStatus: true,
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: {
      connections: true,
      messages: true,
      posts: false,
      events: true,
      opportunities: true,
      newsletter: false,
    },
    pushNotifications: {
      connections: true,
      messages: true,
      posts: false,
      events: true,
      opportunities: false,
    },
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User size={18} /> },
    { id: 'account', label: 'Account & Security', icon: <Lock size={18} /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Call API to update profile
      const response = await updateProfile({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        bio: profileData.bio,
        linkedinUrl: profileData.linkedinUrl,
        currentRole: profileData.currentRole,
        company: profileData.company,
      });

      if (response.success && response.data) {
        // Update AuthContext with new user data (real-time update)
        updateUser(response.data);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePrivacy = async () => {
    setIsSaving(true);
    // TODO: API call to update privacy settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Privacy settings updated!');
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    // TODO: API call to update notification settings
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Notification settings updated!');
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    setIsSaving(true);
    // TODO: API call to change password
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Password changed successfully!');
  };

  const handleExportData = () => {
    alert('Your data export has been initiated. You will receive an email with the download link.');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (confirmed) {
      // TODO: API call to delete account
      alert('Account deletion initiated. You will receive a confirmation email.');
    }
  };

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
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Tabs */}
          <Card variant="elevated" className="lg:col-span-1 p-4 h-fit">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>

          {/* Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Profile Information
                  </h2>

                  {/* Profile Picture */}
                  <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
                    <Avatar
                      src={user?.profilePicture}
                      alt={`${user?.firstName} ${user?.lastName}`}
                      size="2xl"
                      fallback={`${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`}
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Profile Photo</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Camera size={16} className="mr-2" />
                          Upload Photo
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <Input
                        value={profileData.firstName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, firstName: e.target.value })
                        }
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <Input
                        value={profileData.lastName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, lastName: e.target.value })
                        }
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData({ ...profileData, bio: e.target.value })
                        }
                        rows={4}
                        placeholder="Tell us about yourself..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Role
                      </label>
                      <Input
                        value={profileData.currentRole}
                        onChange={(e) =>
                          setProfileData({ ...profileData, currentRole: e.target.value })
                        }
                        placeholder="e.g., Senior Engineer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <Input
                        value={profileData.company}
                        onChange={(e) =>
                          setProfileData({ ...profileData, company: e.target.value })
                        }
                        placeholder="e.g., Larsen & Toubro"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <Input
                        value={profileData.location}
                        onChange={(e) =>
                          setProfileData({ ...profileData, location: e.target.value })
                        }
                        placeholder="City, State"
                        leftIcon={<Globe size={18} />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <Input
                        value={profileData.linkedinUrl}
                        onChange={(e) =>
                          setProfileData({ ...profileData, linkedinUrl: e.target.value })
                        }
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      <Save size={18} className="mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </Card>
              </>
            )}

            {/* Account & Security Tab */}
            {activeTab === 'account' && (
              <>
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({ ...profileData, email: e.target.value })
                          }
                          leftIcon={<Mail size={18} />}
                        />
                        <Badge variant="success" size="sm">
                          Verified
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        leftIcon={<Smartphone size={18} />}
                      />
                    </div>
                  </div>
                </Card>

                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Change Password
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <Input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        leftIcon={<Lock size={18} />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        leftIcon={<Lock size={18} />}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        leftIcon={<Lock size={18} />}
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="primary"
                      onClick={handleChangePassword}
                      disabled={isSaving}
                    >
                      Update Password
                    </Button>
                  </div>
                </Card>

                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Account Actions
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Download size={24} className="text-blue-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Export Your Data</h3>
                          <p className="text-sm text-gray-600">
                            Download a copy of your account data
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleExportData}>
                        Export
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Trash2 size={24} className="text-red-600" />
                        <div>
                          <h3 className="font-medium text-gray-900">Delete Account</h3>
                          <p className="text-sm text-gray-600">
                            Permanently delete your account and all data
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                        onClick={handleDeleteAccount}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <Card variant="elevated" className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Privacy Settings
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Profile Visibility</h3>
                    <div className="space-y-2">
                      {['public', 'connections', 'private'].map((option) => (
                        <label
                          key={option}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <input
                            type="radio"
                            name="profileVisibility"
                            value={option}
                            checked={privacySettings.profileVisibility === option}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                profileVisibility: e.target.value as any,
                              })
                            }
                            className="text-primary-600 focus:ring-primary-500"
                          />
                          <div>
                            <p className="font-medium text-gray-900 capitalize">{option}</p>
                            <p className="text-sm text-gray-600">
                              {option === 'public' &&
                                'Anyone can view your profile'}
                              {option === 'connections' &&
                                'Only your connections can view'}
                              {option === 'private' && 'Only you can view your profile'}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">
                      Information Visibility
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'showEmail', label: 'Show email address on profile' },
                        { key: 'showPhone', label: 'Show phone number on profile' },
                        { key: 'showExperience', label: 'Show work experience' },
                        { key: 'showOnlineStatus', label: 'Show online status' },
                      ].map((item) => (
                        <label
                          key={item.key}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        >
                          <span className="text-gray-900">{item.label}</span>
                          <input
                            type="checkbox"
                            checked={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                            onChange={(e) =>
                              setPrivacySettings({
                                ...privacySettings,
                                [item.key]: e.target.checked,
                              })
                            }
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3">Messaging</h3>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Who can send you messages?
                    </label>
                    <select
                      value={privacySettings.allowMessages}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          allowMessages: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="connections">Only Connections</option>
                      <option value="none">No One</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSavePrivacy}
                    disabled={isSaving}
                  >
                    <Save size={18} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <Card variant="elevated" className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Notification Preferences
                </h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Mail size={18} className="mr-2" />
                      Email Notifications
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(notificationSettings.emailNotifications).map(
                        ([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <span className="text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  emailNotifications: {
                                    ...notificationSettings.emailNotifications,
                                    [key]: e.target.checked,
                                  },
                                })
                              }
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Bell size={18} className="mr-2" />
                      Push Notifications
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(notificationSettings.pushNotifications).map(
                        ([key, value]) => (
                          <label
                            key={key}
                            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                          >
                            <span className="text-gray-900 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) =>
                                setNotificationSettings({
                                  ...notificationSettings,
                                  pushNotifications: {
                                    ...notificationSettings.pushNotifications,
                                    [key]: e.target.checked,
                                  },
                                })
                              }
                              className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                            />
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                  >
                    <Save size={18} className="mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SettingsPage;
