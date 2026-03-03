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
  attachments?: File[];
}

export interface NewsletterEmailData {
  subject: string;
  title: string;
  content: string; // HTML content from rich text editor
  attachments?: File[];
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
  const formData = new FormData();

  // Append text data
  Object.entries(customData).forEach(([key, value]) => {
    if (value !== undefined && key !== 'attachments') {
      formData.append(key, value as string);
    }
  });

  // Append filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
  }

  // Append attachments
  if (customData.attachments && customData.attachments.length > 0) {
    customData.attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const response = await api.post('/api/email-campaigns/custom', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

/**
 * Send newsletter announcement campaign
 */
export const sendNewsletterEmail = async (
  newsletterData: NewsletterEmailData,
  filters?: EmailFilters
): Promise<EmailCampaignResult> => {
  const formData = new FormData();

  // Append text data
  Object.entries(newsletterData).forEach(([key, value]) => {
    if (value !== undefined && key !== 'attachments') {
      formData.append(key, value as string);
    }
  });

  // Append filters
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, value as string);
      }
    });
  }

  // Append attachments
  if (newsletterData.attachments && newsletterData.attachments.length > 0) {
    newsletterData.attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const response = await api.post('/api/email-campaigns/newsletter', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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
  sendNewsletterEmail,
  sendTestEmail,
};
