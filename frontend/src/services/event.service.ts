import api from './api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  duration?: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  venue: string;
  location: string;
  meetingLink?: string;
  type: 'Workshop' | 'Seminar' | 'Webinar' | 'Meetup' | 'Conference' | 'Other';
  image?: {
    url: string;
  };
  banner?: {
    url: string;
  };
  organizer: string;
  organizerName: string;
  registrationFee?: string;
  maxParticipants?: number;
  registeredCount?: number;
  registrationDeadline?: string;
  speakers?: Array<{
    name: string;
    designation?: string;
  }>;
  isRegistered?: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface EventFilters {
  eventTypes?: string[];
  mode?: string[];
  dateRange?: 'upcoming' | 'past' | 'all';
  search?: string;
  sortBy?: 'date-asc' | 'date-desc' | 'recent';
  page?: number;
  limit?: number;
}

// Get all events
export const getAllEvents = async (filters?: EventFilters) => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.eventTypes?.length) params.append('type', filters.eventTypes.join(','));
    if (filters?.mode?.length) params.append('mode', filters.mode.join(','));
    if (filters?.dateRange && filters.dateRange !== 'all') params.append('dateRange', filters.dateRange);
    if (filters?.sortBy) params.append('sort', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    params.append('status', 'upcoming');

    const response = await api.get(`/api/events?${params.toString()}`);
    // API returns { success: true, data: [...], total: ..., page: ..., pages: ... }
    return {
      data: response.data.data || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching events in service:', error);
    // Always return the expected structure even on error
    return {
      data: [],
      total: 0,
    };
  }
};

// Get event by ID
export const getEventById = async (id: string) => {
  const response = await api.get(`/api/events/${id}`);
  return response.data;
};

// Search events
export const searchEvents = async (query: string) => {
  const response = await api.get(`/api/events/search?q=${query}`);
  return response.data;
};

// Get upcoming events
export const getUpcomingEvents = async (limit?: number) => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  params.append('dateRange', 'upcoming');
  params.append('isActive', 'true');

  const response = await api.get(`/api/events?${params.toString()}`);
  return response.data;
};

// Register for event
export const registerForEvent = async (eventId: string) => {
  const response = await api.post(`/api/events/${eventId}/register`, {});
  return response.data;
};

// Unregister from event
export const unregisterFromEvent = async (eventId: string) => {
  const response = await api.post(`/api/events/${eventId}/unregister`, {});
  return response.data;
};
