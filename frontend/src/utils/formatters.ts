import { formatDistanceToNow, format } from 'date-fns';

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

/**
 * Format date to readable format
 */
export const formatDate = (date: string | Date, formatString: string = 'PPP'): string => {
  return format(new Date(date), formatString);
};

/**
 * Format date and time
 */
export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'PPP p');
};

/**
 * Format currency (INR)
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format large numbers with K, M suffixes
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Convert duration to readable format
 */
export const formatDuration = (startDate: Date, endDate: Date | null): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth() + (years * 12);

  const yearsPart = Math.floor(months / 12);
  const monthsPart = months % 12;

  if (yearsPart === 0) {
    return `${monthsPart} month${monthsPart !== 1 ? 's' : ''}`;
  }

  if (monthsPart === 0) {
    return `${yearsPart} year${yearsPart !== 1 ? 's' : ''}`;
  }

  return `${yearsPart} year${yearsPart !== 1 ? 's' : ''} ${monthsPart} month${monthsPart !== 1 ? 's' : ''}`;
};

/**
 * Generate color from string (for avatars)
 */
export const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b',
    '#10b981', '#06b6d4', '#6366f1', '#f97316',
  ];

  return colors[Math.abs(hash) % colors.length];
};
