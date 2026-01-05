import api from './api';

// Types
export interface EmailStats {
  totalUsers: number;
  studentCount: number;
  alumniCount: number;
  batches: string[];
  departments: string[];
}

export interface EmailFilters {
  role?: 'student' | 'alumni' | 'admin';
  batch?: string;
  department?: string;
}

export interface EventEmailData {
  eventTitle: string;
  eventDate: string;
  eventTime?: string;
  venue?: string;
  eventType?: string;
  organizer?: string;
  registrationDeadline?: string;
  description?: string;
  customMessage?: string;
  eventUrl?: string;
  ctaText?: string;
}

export interface CustomEmailData {
  subject?: string;
  title: string;
  badge?: string;
  headerStyle?: 'info' | 'success' | 'warning';
  preMessage?: string;
  message: string;
  postMessage?: string;
  ctaText?: string;
  ctaUrl?: string;
  additionalInfo?: string;
}

export interface EmailCampaignResult {
  success: boolean;
  message: string;
  data?: {
    total: number;
    sent: number;
    failed: number;
    errors?: any[];
  };
}

/**
 * Get email campaign statistics
 */
export const getEmailStats = async (): Promise<EmailStats> => {
  const response = await api.get('/api/email-campaigns/stats');
  return response.data.data;
};

/**
 * Send welcome email campaign
 */
export const sendWelcomeEmail = async (
  filters?: EmailFilters
): Promise<EmailCampaignResult> => {
  const response = await api.post('/api/email-campaigns/welcome', filters);
  return response.data;
};

/**
 * Send event announcement campaign
 */
export const sendEventEmail = async (
  eventData: EventEmailData,
  filters?: EmailFilters
): Promise<EmailCampaignResult> => {
  const response = await api.post('/api/email-campaigns/event', {
    ...eventData,
    ...filters,
  });
  return response.data;
};

/**
 * Send custom announcement campaign
 */
export const sendCustomEmail = async (
  customData: CustomEmailData,
  filters?: EmailFilters
): Promise<EmailCampaignResult> => {
  const response = await api.post('/api/email-campaigns/custom', {
    ...customData,
    ...filters,
  });
  return response.data;
};

/**
 * Send test email
 */
export const sendTestEmail = async (
  recipientEmail: string,
  templateName: string,
  templateData: any
): Promise<{ success: boolean; message: string }> => {
  const response = await api.post('/api/email-campaigns/test', {
    recipientEmail,
    templateName,
    templateData,
  });
  return response.data;
};

export default {
  getEmailStats,
  sendWelcomeEmail,
  sendEventEmail,
  sendCustomEmail,
  sendTestEmail,
};
