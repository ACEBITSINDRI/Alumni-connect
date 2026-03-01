import api from './api';

export interface ProfileStatus {
  profileComplete: boolean;
  completionPercentage: number;
  completedFields: string[];
  missingFields: string[];
  hasSeenModal: boolean;
}

// Get profile completion status
export const getProfileStatus = async (): Promise<ProfileStatus> => {
  try {
    const response = await api.get('/api/auth/profile-status');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching profile status:', error);
    throw error;
  }
};

// Mark profile completion modal as seen
export const markModalAsSeen = async (): Promise<void> => {
  try {
    await api.patch('/api/auth/mark-modal-seen');
  } catch (error) {
    console.error('Error marking modal as seen:', error);
    throw error;
  }
};

// Check if should show modal (only once per session)
export const shouldShowProfileModal = (): boolean => {
  const hasShownInSession = sessionStorage.getItem('profileModalShownInSession');
  return !hasShownInSession;
};

// Mark modal as shown in current session
export const markModalShownInSession = (): void => {
  sessionStorage.setItem('profileModalShownInSession', 'true');
};

// Clear session flag (for testing or logout)
export const clearProfileModalSessionFlag = (): void => {
  sessionStorage.removeItem('profileModalShownInSession');
};
