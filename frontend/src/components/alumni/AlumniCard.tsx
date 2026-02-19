import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Briefcase, UserPlus, MessageCircle, Star } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface Alumni {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  batch: string;
  avatar?: string;
  coverPhoto?: string;
  skills: string[];
  mentorshipAvailable: boolean;
  experience: number;
  domain: string;
}

interface AlumniCardProps {
  alumni: Alumni;
  viewMode?: 'grid' | 'list';
}

const AlumniCard: React.FC<AlumniCardProps> = ({ alumni, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConnecting(true);

    try {
      // TODO: API call to send connection request
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/messages?user=${alumni.id}`);
  };

  const handleViewProfile = () => {
    navigate(`/profile/${alumni.id}`);
  };

  if (viewMode === 'list') {
    return (
      <Card
        variant="elevated"
        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={handleViewProfile}
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-start space-x-4">
            <Avatar
              src={alumni.avatar}
              alt={alumni.name}
              size="lg"
              fallback={alumni.name}
              className="flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 truncate">
                    {alumni.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate">{alumni.role}</p>
                </div>
                <Badge variant="primary" size="sm" className="ml-2 flex-shrink-0">
                  {alumni.batch}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Briefcase size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{alumni.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{alumni.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {alumni.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="default" size="sm">
                    {skill}
                  </Badge>
                ))}
                {alumni.skills.length > 4 && (
                  <Badge variant="default" size="sm">
                    +{alumni.skills.length - 4}
                  </Badge>
                )}
              </div>

              {alumni.mentorshipAvailable && (
                <Badge variant="success" size="sm" className="mb-3">
                  <Star size={14} className="mr-1" />
                  Available for Mentorship
                </Badge>
              )}

              <div className="flex space-x-2">
                {isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMessage}
                    className="flex-1"
                  >
                    <MessageCircle size={16} className="mr-1" />
                    Message
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConnect}
                    isLoading={isConnecting}
                    className="flex-1"
                  >
                    <UserPlus size={16} className="mr-1" />
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile();
                  }}
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid View
  return (
    <Card
      variant="elevated"
      className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
      onClick={handleViewProfile}
    >
      {/* Cover Photo */}
      <div className="h-24 bg-gradient-to-r from-primary-500 to-primary-700">
        {alumni.coverPhoto && (
          <img
            src={alumni.coverPhoto}
            alt={`${alumni.name} cover`}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Picture */}
      <div className="px-4 -mt-12">
        <Avatar
          src={alumni.avatar}
          alt={alumni.name}
          size="xl"
          fallback={alumni.name}
          className="border-4 border-white"
        />
      </div>

      {/* Content */}
      <div className="p-4 pt-2">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 truncate flex-1">
            {alumni.name}
          </h3>
          <Badge variant="primary" size="sm" className="ml-2 flex-shrink-0">
            {alumni.batch}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 mb-1 truncate">{alumni.role}</p>
        <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
          <Briefcase size={14} />
          <span className="truncate">{alumni.company}</span>
        </div>

        <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
          <MapPin size={14} />
          <span className="truncate">{alumni.location}</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {alumni.skills.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="default" size="sm">
              {skill}
            </Badge>
          ))}
          {alumni.skills.length > 3 && (
            <Badge variant="default" size="sm">
              +{alumni.skills.length - 3}
            </Badge>
          )}
        </div>

        {/* Mentorship Badge */}
        {alumni.mentorshipAvailable && (
          <Badge variant="success" size="sm" className="mb-4">
            <Star size={12} className="mr-1" />
            Mentorship Available
          </Badge>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {isConnected ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMessage}
              className="w-full"
            >
              <MessageCircle size={16} className="mr-1" />
              Message
            </Button>
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={handleConnect}
              isLoading={isConnecting}
              className="w-full"
            >
              <UserPlus size={16} className="mr-1" />
              {isConnecting ? 'Connecting...' : 'Connect'}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewProfile();
            }}
            className="w-full"
          >
            View Profile
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AlumniCard;
