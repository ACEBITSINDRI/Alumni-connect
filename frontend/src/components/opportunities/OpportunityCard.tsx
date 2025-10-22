import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, DollarSign, Clock, Users, Bookmark, ExternalLink, Calendar } from 'lucide-react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Button from '../common/Button';

interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  jobType: string;
  experienceRequired: string;
  salary: string;
  description: string;
  requirements: string[];
  skills: string[];
  postedBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  postedDate: Date;
  deadline?: string;
  applicants: number;
  isSaved: boolean;
}

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity }) => {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(opportunity.isSaved);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
    // TODO: API call to save/unsave
  };

  const getRelativeTime = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getJobTypeBadge = (type: string) => {
    const config: Record<string, { variant: any; label: string }> = {
      'Full-time': { variant: 'success', label: 'Full-time' },
      'Part-time': { variant: 'warning', label: 'Part-time' },
      'Internship': { variant: 'info', label: 'Internship' },
      'Contract': { variant: 'secondary', label: 'Contract' },
    };
    const { variant, label } = config[type] || config['Full-time'];
    return <Badge variant={variant} size="sm">{label}</Badge>;
  };

  const isDeadlineSoon = () => {
    if (!opportunity.deadline) return false;
    const deadline = new Date(opportunity.deadline);
    const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft > 0;
  };

  return (
    <Card
      variant="elevated"
      className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
      onClick={() => navigate(`/opportunity/${opportunity.id}`)}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            {/* Company Logo */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              {opportunity.companyLogo ? (
                <img
                  src={opportunity.companyLogo}
                  alt={opportunity.company}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Briefcase size={24} className="text-gray-400" />
              )}
            </div>

            {/* Title & Company */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-primary-600 flex-1">
                  {opportunity.title}
                </h3>
                {getJobTypeBadge(opportunity.jobType)}
              </div>
              <p className="text-gray-700 font-medium mb-1">{opportunity.company}</p>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {opportunity.location}
                </span>
                <span className="flex items-center">
                  <Briefcase size={14} className="mr-1" />
                  {opportunity.experienceRequired}
                </span>
                <span className="flex items-center">
                  <DollarSign size={14} className="mr-1" />
                  {opportunity.salary}
                </span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className={`p-2 rounded-lg transition-colors ${
              isSaved
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 mb-4">
          {showFullDescription || opportunity.description.length <= 150
            ? opportunity.description
            : `${opportunity.description.substring(0, 150)}...`}
          {opportunity.description.length > 150 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFullDescription(!showFullDescription);
              }}
              className="text-primary-600 hover:text-primary-700 font-medium ml-1"
            >
              {showFullDescription ? 'Read less' : 'Read more'}
            </button>
          )}
        </p>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-4">
          {opportunity.skills.map((skill, index) => (
            <Badge key={index} variant="default" size="sm">
              {skill}
            </Badge>
          ))}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-200">
          {/* Posted Info */}
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Avatar
                src={opportunity.postedBy.avatar}
                alt={opportunity.postedBy.name}
                size="sm"
                fallback={opportunity.postedBy.name}
              />
              <span>Posted by {opportunity.postedBy.name}</span>
            </div>
            <span className="flex items-center">
              <Clock size={14} className="mr-1" />
              {getRelativeTime(opportunity.postedDate)}
            </span>
          </div>

          {/* Stats & Actions */}
          <div className="flex items-center space-x-3">
            {opportunity.deadline && (
              <span
                className={`flex items-center text-sm ${
                  isDeadlineSoon() ? 'text-orange-600 font-medium' : 'text-gray-600'
                }`}
              >
                <Calendar size={14} className="mr-1" />
                Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
              </span>
            )}
            <span className="flex items-center text-sm text-gray-600">
              <Users size={14} className="mr-1" />
              {opportunity.applicants} applied
            </span>
            <Button
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/opportunity/${opportunity.id}`);
              }}
            >
              View Details
              <ExternalLink size={14} className="ml-1" />
            </Button>
          </div>
        </div>

        {/* Deadline Warning */}
        {isDeadlineSoon() && (
          <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800 flex items-center">
              <Clock size={16} className="mr-2" />
              Application deadline approaching! Apply soon.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default OpportunityCard;
