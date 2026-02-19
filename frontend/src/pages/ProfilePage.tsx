import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Calendar, Mail, Phone, Linkedin, Edit, MessageCircle,
  UserPlus, FileText, Award, Github, Globe, Loader2, CheckCircle,
  ExternalLink, Users, Clock
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { getUserById, type UserProfile } from '../services/user.service';
import { sendConnectionRequest } from '../services/connection.service';
import { calculateProfileCompletion, getProfileCompletionColor, getProfileCompletionBgColor, getProfileCompletionMessage } from '../utils/profileCompletion';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState('about');
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');

  const isOwnProfile = !userId || userId === currentUser?._id;
  const targetUserId = userId || currentUser?._id;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!targetUserId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        if (isOwnProfile && currentUser) {
          setProfileData(currentUser as UserProfile);
        } else if (targetUserId) {
          const response = await getUserById(targetUserId);
          if (response.success && response.data) {
            setProfileData(response.data);
          } else {
            setError('Failed to load profile');
          }
        }
      } catch (err: any) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Error loading profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [targetUserId, isOwnProfile, currentUser]);

  const tabs = [
    { id: 'about', label: 'About', icon: <FileText size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
  ];

  const profileCompletion = profileData ? calculateProfileCompletion(profileData) : null;

  const handleConnect = async () => {
    if (!profileData) return;

    try {
      setIsConnecting(true);
      const response = await sendConnectionRequest(profileData._id);

      if (response.success) {
        setProfileData(prev => prev ? { ...prev, hasPendingRequest: true } : null);
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar
          isAuthenticated={true}
          userRole={currentUser?.role}
          userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
          userAvatar={currentUser?.profilePicture}
          unreadNotifications={0}
          unreadMessages={0}
        />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center">
            <Loader2 size={48} className="animate-spin text-primary-600" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <Navbar
          isAuthenticated={true}
          userRole={currentUser?.role}
          userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
          userAvatar={currentUser?.profilePicture}
          unreadNotifications={0}
          unreadMessages={0}
        />
        <div className="container mx-auto px-4 py-20">
          <Card variant="elevated" className="p-8 text-center max-w-md mx-auto">
            <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
            <Button variant="primary" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const locationString = profileData.location
    ? `${profileData.location.city || ''}${profileData.location.city && profileData.location.state ? ', ' : ''}${profileData.location.state || ''}${(profileData.location.city || profileData.location.state) && profileData.location.country ? ', ' : ''}${profileData.location.country || ''}`
    : '';

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar
        isAuthenticated={true}
        userRole={currentUser?.role}
        userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
        userAvatar={currentUser?.profilePicture}
        unreadNotifications={0}
        unreadMessages={0}
      />

      <div className="container mx-auto px-4 py-6">
        <Card variant="elevated" className="overflow-hidden mb-6 border border-neutral-100">
          <div className="h-48 md:h-64 bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 relative">
            {profileData.coverPhoto && (
              <img src={profileData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
            )}
          </div>

          <div className="px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 sm:-mt-20">
              <Avatar
                src={profileData.profilePicture}
                alt={`${profileData.firstName} ${profileData.lastName}`}
                size="2xl"
                fallback={`${profileData.firstName[0]}${profileData.lastName[0]}`}
                className="border-4 border-white mx-auto sm:mx-0 shadow-strong ring-2 ring-primary-100"
              />

              <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">
                      {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="text-lg text-neutral-700 mt-1 font-medium">
                      {profileData.currentRole || (profileData.role === 'student' ? 'Student' : 'Alumni')}
                      {profileData.company && ` @ ${profileData.company}`}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-neutral-600">
                      <Badge variant="primary" size="md">Batch of {profileData.batch}</Badge>
                      {locationString && (
                        <span className="flex items-center">
                          <MapPin size={16} className="mr-1" />
                          {locationString}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-4 sm:mt-0">
                    {isOwnProfile ? (
                      <Button
                        variant="primary"
                        onClick={() => navigate('/profile/edit')}
                        className="bg-gradient-to-r from-primary-600 to-primary-500"
                      >
                        <Edit size={18} className="mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant={profileData.isConnected ? 'outline' : 'primary'}
                          onClick={handleConnect}
                          disabled={isConnecting || profileData.hasPendingRequest}
                          className={!profileData.isConnected && !profileData.hasPendingRequest ? 'bg-gradient-to-r from-primary-600 to-primary-500' : ''}
                        >
                          {isConnecting ? (
                            <>
                              <Loader2 size={18} className="mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : profileData.isConnected ? (
                            <>
                              <CheckCircle size={18} className="mr-2" />
                              Connected
                            </>
                          ) : profileData.hasPendingRequest ? (
                            <>
                              <Clock size={18} className="mr-2" />
                              Pending
                            </>
                          ) : (
                            <>
                              <UserPlus size={18} className="mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={() => navigate(`/messages?user=${profileData._id}`)}>
                          <MessageCircle size={18} className="mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {isOwnProfile && profileCompletion && profileCompletion.percentage < 100 && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-neutral-900 text-sm">Profile Strength</h3>
                      <span className={`font-bold ${getProfileCompletionColor(profileCompletion.percentage)}`}>
                        {profileCompletion.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2.5 mb-2">
                      <div
                        className={`h-2.5 rounded-full ${getProfileCompletionBgColor(profileCompletion.percentage)}`}
                        style={{ width: `${profileCompletion.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-neutral-600">{getProfileCompletionMessage(profileCompletion.percentage)}</p>
                    {profileCompletion.missingFields.length > 0 && (
                      <p className="text-xs text-neutral-500 mt-2">
                        Missing: {profileCompletion.missingFields.slice(0, 3).join(', ')}
                        {profileCompletion.missingFields.length > 3 && ` +${profileCompletion.missingFields.length - 3} more`}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex border-b border-neutral-200 mt-6 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-6 py-3 border-b-2 font-semibold text-sm transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-primary-600 text-primary-600'
                          : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:border-neutral-300'
                      }`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'about' && (
              <>
                {profileData.bio && (
                  <Card variant="elevated" className="p-6 border border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">About</h2>
                    <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{profileData.bio}</p>
                  </Card>
                )}

                {profileData.skills && profileData.skills.length > 0 && (
                  <Card variant="elevated" className="p-6 border border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-900 mb-4">Skills & Expertise</h2>
                    <div className="flex flex-wrap gap-2">
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="primary" size="md">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                )}

                <Card variant="elevated" className="p-6 border border-neutral-100">
                  <h2 className="text-xl font-bold text-neutral-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-neutral-700">
                      <Mail size={20} className="text-primary-600" />
                      <span>{profileData.email}</span>
                    </div>
                    {profileData.phone && (
                      <div className="flex items-center space-x-3 text-neutral-700">
                        <Phone size={20} className="text-primary-600" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                    {profileData.linkedinUrl && (
                      <div className="flex items-center space-x-3">
                        <Linkedin size={20} className="text-primary-600" />
                        <a href={profileData.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center">
                          LinkedIn Profile <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    )}
                    {profileData.githubUrl && (
                      <div className="flex items-center space-x-3">
                        <Github size={20} className="text-primary-600" />
                        <a href={profileData.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center">
                          GitHub Profile <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    )}
                    {profileData.portfolioUrl && (
                      <div className="flex items-center space-x-3">
                        <Globe size={20} className="text-primary-600" />
                        <a href={profileData.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline flex items-center">
                          Portfolio Website <ExternalLink size={14} className="ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}

            {activeTab === 'experience' && (
              <>
                {profileData.experience && profileData.experience.length > 0 && (
                  <Card variant="elevated" className="p-6 border border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">Professional Experience</h2>
                    <div className="space-y-6">
                      {profileData.experience.map((exp, index) => (
                        <div key={exp._id || index} className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-primary-200 rounded-xl flex items-center justify-center shadow-sm">
                              <Briefcase size={24} className="text-primary-600" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-neutral-900 text-lg">{exp.title}</h3>
                            <p className="text-neutral-700 font-medium">{exp.company}</p>
                            <p className="text-sm text-neutral-500 mt-1">
                              {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                              {exp.type && ` • ${exp.type}`}
                            </p>
                            {exp.location && <p className="text-sm text-neutral-500">{exp.location}</p>}
                            {exp.description && <p className="text-neutral-700 mt-2 leading-relaxed">{exp.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {profileData.education && profileData.education.length > 0 && (
                  <Card variant="elevated" className="p-6 border border-neutral-100">
                    <h2 className="text-xl font-bold text-neutral-900 mb-6">Education</h2>
                    <div className="space-y-4">
                      {profileData.education.map((edu, index) => (
                        <div key={edu._id || index} className="flex space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center shadow-sm">
                              <Award size={24} className="text-blue-600" />
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{edu.degree}</h3>
                            <p className="text-neutral-700">{edu.institution}</p>
                            {edu.fieldOfStudy && <p className="text-sm text-neutral-600">{edu.fieldOfStudy}</p>}
                            <p className="text-sm text-neutral-500">
                              {edu.startYear && edu.endYear ? `${edu.startYear} - ${edu.endYear}` : edu.endYear || ''}
                              {edu.grade && ` • ${edu.grade}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            )}
          </div>

          <aside className="space-y-6">
            {profileData.mentorshipAvailable && (
              <Card variant="elevated" className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Award size={20} className="text-green-600" />
                  <h3 className="font-semibold text-green-900">Available for Mentorship</h3>
                </div>
                <p className="text-sm text-green-700">
                  This {profileData.role === 'alumni' ? 'alumni is' : 'person is'} available to mentor and share their experience.
                </p>
              </Card>
            )}

            <Card variant="elevated" className="p-4 border border-neutral-100">
              <h3 className="font-semibold text-neutral-900 mb-3">Profile Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Award size={16} className="text-neutral-400" />
                  <span className="text-neutral-700 capitalize">{profileData.role}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-neutral-400" />
                  <span className="text-neutral-700">Batch of {profileData.batch}</span>
                </div>
                {profileData.connections && (
                  <div className="flex items-center space-x-2">
                    <Users size={16} className="text-neutral-400" />
                    <span className="text-neutral-700">{profileData.connections.length} connections</span>
                  </div>
                )}
              </div>
            </Card>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProfilePage;
