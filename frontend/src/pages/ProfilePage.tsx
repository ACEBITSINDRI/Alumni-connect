import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, Briefcase, Calendar, Mail, Phone, Linkedin, Edit, MessageCircle,
  UserPlus, MoreVertical, FileText, Users as UsersIcon, Award
} from 'lucide-react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Card from '../components/common/Card';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import PostCard from '../components/dashboard/PostCard';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('about');
  const [isConnected, setIsConnected] = useState(false);

  // Check if viewing own profile
  const isOwnProfile = !userId || userId === currentUser?.id;

  // Mock user data - replace with API call
  const profileUser = {
    id: userId || currentUser?.id || '1',
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 9876543210',
    role: 'alumni' as const,
    profilePicture: undefined,
    coverPhoto: undefined,
    batch: '2015',
    currentRole: 'Senior Engineer',
    company: 'Larsen & Toubro',
    location: 'Mumbai, Maharashtra',
    linkedinUrl: 'https://linkedin.com/in/rahulsharma',
    bio: 'Passionate civil engineer with 9+ years of experience in structural design and project management. Love mentoring students and contributing to infrastructure development.',
    skills: ['Structural Design', 'Project Management', 'AutoCAD', 'STAAD Pro', 'Quality Control', 'Site Management'],
    experience: [
      {
        id: '1',
        title: 'Senior Engineer',
        company: 'Larsen & Toubro',
        location: 'Mumbai, Maharashtra',
        type: 'Full-time',
        startDate: 'Jan 2019',
        endDate: 'Present',
        duration: '5 years',
        description: 'Leading structural design team for metro rail projects. Managing quality control and site coordination.',
      },
      {
        id: '2',
        title: 'Project Engineer',
        company: 'Tata Projects',
        location: 'Bangalore, Karnataka',
        type: 'Full-time',
        startDate: 'Jul 2015',
        endDate: 'Dec 2018',
        duration: '3 years 6 months',
        description: 'Worked on highway and bridge construction projects. Handled site supervision and contractor management.',
      },
    ],
    education: [
      {
        id: '1',
        degree: 'B.Tech in Civil Engineering',
        institution: 'BIT Sindri, Dhanbad',
        year: '2015',
      },
    ],
    stats: {
      posts: 24,
      connections: 156,
      eventsAttended: 8,
    },
    mentorshipAvailable: true,
  };

  // Mock posts - replace with API call
  const userPosts = [
    {
      id: '1',
      author: {
        id: profileUser.id,
        name: `${profileUser.firstName} ${profileUser.lastName}`,
        role: profileUser.currentRole,
        company: profileUser.company,
        batch: profileUser.batch,
        avatar: profileUser.profilePicture,
      },
      type: 'advice' as const,
      title: 'Career Growth Tips for Civil Engineers',
      content: 'After 9 years in the industry, here are my top 5 tips...',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      images: [],
      likes: 89,
      comments: 23,
      isLiked: false,
      isSaved: false,
    },
  ];

  const tabs = [
    { id: 'about', label: 'About', icon: <FileText size={18} /> },
    { id: 'posts', label: 'Posts', icon: <FileText size={18} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
  ];

  const handleConnect = () => {
    // TODO: API call
    setIsConnected(!isConnected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={true}
        userRole={currentUser?.role}
        userName={`${currentUser?.firstName} ${currentUser?.lastName}`}
        userAvatar={currentUser?.profilePicture}
        unreadNotifications={3}
        unreadMessages={2}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Profile Header Card */}
        <Card variant="elevated" className="overflow-hidden mb-6">
          {/* Cover Photo */}
          <div className="h-48 md:h-64 bg-gradient-to-r from-primary-500 to-primary-700 relative">
            {profileUser.coverPhoto && (
              <img
                src={profileUser.coverPhoto}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Profile Info */}
          <div className="px-4 sm:px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:space-x-6 -mt-16 sm:-mt-20">
              <Avatar
                src={profileUser.profilePicture}
                alt={`${profileUser.firstName} ${profileUser.lastName}`}
                size="2xl"
                fallback={`${profileUser.firstName[0]}${profileUser.lastName[0]}`}
                className="border-4 border-white mx-auto sm:mx-0"
              />

              <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                  <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {profileUser.firstName} {profileUser.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                      {profileUser.currentRole} @ {profileUser.company}
                    </p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2 text-sm text-gray-500">
                      <Badge variant="primary">Batch of {profileUser.batch}</Badge>
                      <span className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {profileUser.location}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-center sm:justify-start space-x-2 mt-4 sm:mt-0">
                    {isOwnProfile ? (
                      <Button
                        variant="primary"
                        onClick={() => navigate('/profile/edit')}
                      >
                        <Edit size={18} className="mr-2" />
                        Edit Profile
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant={isConnected ? 'outline' : 'primary'}
                          onClick={handleConnect}
                        >
                          <UserPlus size={18} className="mr-2" />
                          {isConnected ? 'Connected' : 'Connect'}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/messages?user=${profileUser.id}`)}
                        >
                          <MessageCircle size={18} className="mr-2" />
                          Message
                        </Button>
                      </>
                    )}
                    <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Stats Bar */}
                <div className="flex items-center justify-center sm:justify-start space-x-6 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profileUser.stats.posts}</p>
                    <p className="text-sm text-gray-600">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profileUser.stats.connections}</p>
                    <p className="text-sm text-gray-600">Connections</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{profileUser.stats.eventsAttended}</p>
                    <p className="text-sm text-gray-600">Events</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mt-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Tab */}
            {activeTab === 'about' && (
              <>
                {/* Bio */}
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">About</h2>
                  <p className="text-gray-700 whitespace-pre-wrap">{profileUser.bio}</p>
                </Card>

                {/* Skills */}
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {profileUser.skills.map((skill, index) => (
                      <Badge key={index} variant="primary" size="md">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </Card>

                {/* Contact Info */}
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Mail size={20} className="text-gray-400" />
                      <span>{profileUser.email}</span>
                    </div>
                    {profileUser.phone && (
                      <div className="flex items-center space-x-3 text-gray-700">
                        <Phone size={20} className="text-gray-400" />
                        <span>{profileUser.phone}</span>
                      </div>
                    )}
                    {profileUser.linkedinUrl && (
                      <div className="flex items-center space-x-3">
                        <Linkedin size={20} className="text-gray-400" />
                        <a
                          href={profileUser.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>
                </Card>
              </>
            )}

            {/* Posts Tab */}
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Experience Tab */}
            {activeTab === 'experience' && (
              <>
                {/* Experience */}
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Professional Experience</h2>
                  <div className="space-y-6">
                    {profileUser.experience.map((exp) => (
                      <div key={exp.id} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                            <Briefcase size={24} className="text-primary-600" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {exp.startDate} - {exp.endDate} • {exp.duration}
                          </p>
                          <p className="text-sm text-gray-500">{exp.location}</p>
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Education */}
                <Card variant="elevated" className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Education</h2>
                  <div className="space-y-4">
                    {profileUser.education.map((edu) => (
                      <div key={edu.id} className="flex space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Award size={24} className="text-blue-600" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-gray-600">{edu.institution}</p>
                          <p className="text-sm text-gray-500">{edu.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="space-y-6">
            {/* Mentorship Badge */}
            {profileUser.mentorshipAvailable && (
              <Card variant="elevated" className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Award size={20} className="text-green-600" />
                  <h3 className="font-semibold text-green-900">Available for Mentorship</h3>
                </div>
                <p className="text-sm text-green-700">
                  This alumni is available to mentor students and share their experience.
                </p>
              </Card>
            )}

            {/* Education Card */}
            <Card variant="elevated" className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Education</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Award size={16} className="text-gray-400" />
                  <span className="text-gray-700">B.Tech in Civil Engineering</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="text-gray-700">BIT Sindri • {profileUser.batch}</span>
                </div>
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
