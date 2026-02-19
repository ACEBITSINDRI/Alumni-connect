import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from './common/Button';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  completionPercentage: number;
  missingFields: string[];
  onComplete: () => void;
  onDismiss: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  completionPercentage,
  missingFields,
  onComplete,
  onDismiss,
}) => {
  const navigate = useNavigate();
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen) return null;

  const handleCompleteClick = () => {
    onComplete();
    navigate('/profile/edit?source=onboarding');
  };

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss();
      setIsClosing(false);
    }, 300);
  };

  const fieldLabels: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    batch: 'Batch/Year',
    currentRole: 'Current Role',
    company: 'Company',
    bio: 'Bio',
    profilePicture: 'Profile Picture',
  };

  const getFieldLabel = (field: string): string => {
    return fieldLabels[field] || field;
  };

  return (
    <div
      className={`fixed inset-0 bg-black transition-opacity z-50 ${
        isClosing ? 'bg-opacity-0' : 'bg-opacity-40'
      } ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleDismiss}
    >
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors text-white"
                >
                  <X size={24} />
                </button>
              </div>
              <p className="text-primary-100">
                Help other students and alumni discover you better
              </p>
            </div>
          </div>

          {/* Body */}
          <div className="p-6">
            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                <span className="text-sm font-bold text-primary-600">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>

            {/* Missing Fields */}
            {missingFields.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle size={18} className="text-orange-500 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-gray-900">Missing Information</h3>
                </div>
                <div className="space-y-2">
                  {missingFields.map((field) => (
                    <div key={field} className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                      <span>{getFieldLabel(field)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Why complete your profile?</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Better visibility in search results</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Connect with relevant alumni & students</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle2 size={16} className="text-primary-600 flex-shrink-0 mt-0.5" />
                  <span>Get mentorship & job opportunities</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={handleCompleteClick}
                className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                Complete Profile Now
              </Button>
              <Button
                onClick={handleDismiss}
                variant="outline"
                className="w-full"
              >
                I'll do this later
              </Button>
            </div>

            {/* Footer note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              We'll remind you next time you log in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
