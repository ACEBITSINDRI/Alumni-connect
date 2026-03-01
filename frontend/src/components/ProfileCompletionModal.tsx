import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, AlertCircle, GraduationCap, ArrowRight, UserCircle } from 'lucide-react';
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
      className={`fixed inset-0 bg-black transition-opacity z-50 ${isClosing ? 'bg-opacity-0' : 'bg-opacity-40'
        } ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={handleDismiss}
    >
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
          }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 m-4">
          {/* Header */}
          <div className="bg-[#0B1A30] px-5 py-5 sm:py-6 flex flex-col items-center justify-center relative border-b border-gray-100">
            {/* Background Academic Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1.5 hover:bg-white/10 rounded-full transition-colors text-gray-300 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3 ring-4 ring-white/5 shadow-inner">
              <GraduationCap size={24} className="text-white drop-shadow-md" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-white text-center tracking-tight">Complete Your Profile</h2>
            <p className="text-gray-300 text-xs sm:text-sm mt-1 text-center font-medium">Build trust and unlock your full academic network</p>
          </div>

          {/* Body */}
          <div className="p-5 sm:p-6 pb-4 sm:pb-5">
            {/* Progress Section */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  <UserCircle size={16} className="text-gray-500" />
                  Profile Strength
                </span>
                <span className="text-sm font-bold text-[#0B1A30]">{completionPercentage}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200 shadow-inner">
                <div
                  className="bg-[#0B1A30] h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Missing Fields */}
            {missingFields.length > 0 && (
              <div className="mb-5 bg-orange-50/50 border border-orange-100 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertCircle size={14} className="text-orange-600 flex-shrink-0" />
                  <h3 className="text-xs font-semibold text-orange-900 uppercase">Missing Info</h3>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-3">
                  {missingFields.map((field) => (
                    <div key={field} className="flex items-center space-x-2 text-xs text-gray-700">
                      <div className="w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0 shadow-sm" />
                      <span className="font-medium truncate">{getFieldLabel(field)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            <div className="mb-6 pl-1">
              <h3 className="text-xs font-semibold text-gray-900 mb-2.5 tracking-wide uppercase">Why complete your profile?</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 size={14} className="text-[#0B1A30] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">Increase visibility to top recruiters</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 size={14} className="text-[#0B1A30] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">Build credibility within the network</span>
                </li>
                <li className="flex items-start space-x-2.5">
                  <CheckCircle2 size={14} className="text-[#0B1A30] flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">Unlock personalized mentorship</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 sm:space-y-0 sm:flex sm:space-x-3 mt-auto">
              <Button
                onClick={handleDismiss}
                className="w-full sm:w-1/3 py-2 text-sm font-medium border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-200 transition-colors shadow-sm"
                variant="outline"
              >
                Skip
              </Button>
              <Button
                onClick={handleCompleteClick}
                className="w-full sm:w-2/3 py-2 text-sm font-semibold bg-[#0B1A30] text-white hover:bg-[#152a4a] hover:shadow-md transition-all flex justify-center items-center gap-2 group"
              >
                Complete Now
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            {/* Footer note */}
            <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-4 font-medium">
              You can update these details anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
