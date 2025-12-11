import type { UserProfile } from '../services/user.service';

export interface ProfileCompletionScore {
  percentage: number;
  completedFields: string[];
  missingFields: string[];
}

export const calculateProfileCompletion = (user: UserProfile): ProfileCompletionScore => {
  const fields = {
    // Basic Info (30 points)
    'Profile Picture': { value: user.profilePicture, weight: 10 },
    'Bio': { value: user.bio, weight: 10 },
    'Phone Number': { value: user.phone, weight: 5 },
    'Location': { value: user.location, weight: 5 },

    // Professional Info (40 points)
    'Current Role': { value: user.currentRole, weight: 10 },
    'Company': { value: user.company, weight: 10 },
    'Skills': { value: user.skills && user.skills.length > 0, weight: 10 },
    'Experience': { value: user.experience && user.experience.length > 0, weight: 10 },

    // Social Links (20 points)
    'LinkedIn Profile': { value: user.linkedinUrl, weight: 10 },
    'GitHub Profile': { value: user.githubUrl, weight: 5 },
    'Portfolio Website': { value: user.portfolioUrl, weight: 5 },

    // Additional (10 points)
    'Cover Photo': { value: user.coverPhoto, weight: 5 },
    'Education': { value: user.education && user.education.length > 0, weight: 5 },
  };

  const completedFields: string[] = [];
  const missingFields: string[] = [];
  let totalScore = 0;

  Object.entries(fields).forEach(([fieldName, fieldData]) => {
    if (fieldData.value) {
      completedFields.push(fieldName);
      totalScore += fieldData.weight;
    } else {
      missingFields.push(fieldName);
    }
  });

  return {
    percentage: totalScore,
    completedFields,
    missingFields,
  };
};

export const getProfileCompletionColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 50) return 'text-yellow-600';
  return 'text-red-600';
};

export const getProfileCompletionBgColor = (percentage: number): string => {
  if (percentage >= 80) return 'bg-green-600';
  if (percentage >= 50) return 'bg-yellow-600';
  return 'bg-red-600';
};

export const getProfileCompletionMessage = (percentage: number): string => {
  if (percentage >= 90) return 'Excellent! Your profile is almost complete.';
  if (percentage >= 70) return 'Great! A few more details will make your profile stand out.';
  if (percentage >= 50) return 'Good start! Complete your profile to connect better.';
  return 'Let\'s complete your profile to maximize opportunities.';
};
