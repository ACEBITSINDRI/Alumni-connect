import { logEvent, setUserId, setUserProperties } from 'firebase/analytics';
import { analytics } from '../../config/firebase';

/**
 * Log custom event to Firebase Analytics
 */
export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, params);
  }
};

/**
 * Set user ID for analytics
 */
export const setAnalyticsUserId = (userId: string) => {
  if (analytics) {
    setUserId(analytics, userId);
  }
};

/**
 * Set user properties for analytics
 */
export const setAnalyticsUserProperties = (properties: Record<string, any>) => {
  if (analytics) {
    setUserProperties(analytics, properties);
  }
};

/**
 * Track page view
 */
export const trackPageView = (pageName: string, pageTitle?: string) => {
  trackEvent('page_view', {
    page_name: pageName,
    page_title: pageTitle || pageName,
  });
};

/**
 * Track user login
 */
export const trackLogin = (method: 'email' | 'google' | 'github') => {
  trackEvent('login', { method });
};

/**
 * Track user signup
 */
export const trackSignup = (method: 'email' | 'google' | 'github', role: 'student' | 'alumni') => {
  trackEvent('sign_up', { method, role });
};

/**
 * Track post creation
 */
export const trackPostCreated = (postType?: string) => {
  trackEvent('post_created', { post_type: postType });
};

/**
 * Track job posting
 */
export const trackJobPosted = () => {
  trackEvent('job_posted');
};

/**
 * Track event creation
 */
export const trackEventCreated = (eventType?: string) => {
  trackEvent('event_created', { event_type: eventType });
};

/**
 * Track mentorship request
 */
export const trackMentorshipRequest = () => {
  trackEvent('mentorship_request');
};

/**
 * Track search
 */
export const trackSearch = (searchTerm: string, searchType?: string) => {
  trackEvent('search', {
    search_term: searchTerm,
    search_type: searchType,
  });
};

/**
 * Track profile view
 */
export const trackProfileView = (viewedUserId: string, viewedUserRole: 'student' | 'alumni') => {
  trackEvent('profile_view', {
    viewed_user_id: viewedUserId,
    viewed_user_role: viewedUserRole,
  });
};

/**
 * Track message sent
 */
export const trackMessageSent = (recipientId: string) => {
  trackEvent('message_sent', {
    recipient_id: recipientId,
  });
};
