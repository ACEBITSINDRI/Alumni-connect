import api from './api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types
export interface TickerItem {
  _id: string;
  originalId?: string;
  title: string;
  message: string;
  type: 'announcement' | 'event' | 'job' | 'news' | 'achievement';
  source: 'manual' | 'auto-event' | 'auto-opportunity';
  variant: 'info' | 'success' | 'warning' | 'urgent';
  icon?: string;
  actionUrl?: string;
  actionLabel?: string;
  priority: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  viewCount?: number;
  clickCount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TickerFormData {
  title: string;
  message: string;
  type: 'announcement' | 'event' | 'job' | 'news' | 'achievement';
  variant: 'info' | 'success' | 'warning' | 'urgent';
  priority: number;
  actionUrl?: string;
  actionLabel?: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  icon?: string;
}

export interface TickerResponse {
  success: boolean;
  count?: number;
  total?: number;
  data: TickerItem | TickerItem[];
  cached?: boolean;
  message?: string;
}

// ===== API Functions =====

/**
 * Get all active ticker items (public, aggregated from all sources)
 */
export const getActiveTickerItems = async (): Promise<TickerResponse> => {
  const response = await api.get<TickerResponse>('/ticker');
  return response.data;
};

/**
 * Get all ticker items (admin view - manual items only)
 */
export const getAllTickerItems = async (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<TickerResponse> => {
  const response = await api.get<TickerResponse>('/ticker/admin/all', { params });
  return response.data;
};

/**
 * Get single ticker item by ID (admin only)
 */
export const getTickerItemById = async (id: string): Promise<TickerResponse> => {
  const response = await api.get<TickerResponse>(`/ticker/${id}`);
  return response.data;
};

/**
 * Create manual ticker item (admin only)
 */
export const createTickerItem = async (data: TickerFormData): Promise<TickerResponse> => {
  const response = await api.post<TickerResponse>('/ticker', data);
  return response.data;
};

/**
 * Update ticker item (admin only)
 */
export const updateTickerItem = async (
  id: string,
  data: Partial<TickerFormData>
): Promise<TickerResponse> => {
  const response = await api.put<TickerResponse>(`/ticker/${id}`, data);
  return response.data;
};

/**
 * Delete ticker item (admin only)
 */
export const deleteTickerItem = async (id: string): Promise<TickerResponse> => {
  const response = await api.delete<TickerResponse>(`/ticker/${id}`);
  return response.data;
};

/**
 * Toggle ticker item active status (admin only)
 */
export const toggleTickerItem = async (id: string): Promise<TickerResponse> => {
  const response = await api.patch<TickerResponse>(`/ticker/${id}/toggle`);
  return response.data;
};

/**
 * Track ticker item click (public)
 */
export const trackTickerClick = async (id: string): Promise<void> => {
  try {
    await api.post(`/ticker/${id}/track-click`);
  } catch (error) {
    // Silently fail - tracking errors shouldn't break UX
    console.warn('Failed to track ticker click:', error);
  }
};

/**
 * Track ticker item view (public)
 */
export const trackTickerView = async (id: string): Promise<void> => {
  try {
    await api.post(`/ticker/${id}/track-view`);
  } catch (error) {
    // Silently fail - tracking errors shouldn't break UX
    console.warn('Failed to track ticker view:', error);
  }
};

/**
 * Clear ticker cache (admin only)
 */
export const clearTickerCache = async (): Promise<TickerResponse> => {
  const response = await api.post<TickerResponse>('/ticker/admin/clear-cache');
  return response.data;
};

// ===== React Query Hooks =====

/**
 * Hook to fetch active ticker items with auto-refresh
 */
export const useTickerItems = () => {
  return useQuery<TickerResponse, Error>({
    queryKey: ['ticker', 'active'],
    queryFn: getActiveTickerItems,
    staleTime: 120000, // 2 minutes - match backend cache
    gcTime: 300000, // 5 minutes (formerly cacheTime)
    refetchInterval: 120000, // Auto-refresh every 2 minutes
    refetchOnWindowFocus: true,
    retry: 2,
  });
};

/**
 * Hook to fetch all ticker items (admin)
 */
export const useAllTickerItems = (params?: {
  page?: number;
  limit?: number;
  isActive?: boolean;
}) => {
  return useQuery<TickerResponse, Error>({
    queryKey: ['ticker', 'admin', 'all', params],
    queryFn: () => getAllTickerItems(params),
    staleTime: 60000, // 1 minute
    enabled: !!params, // Only fetch if params are provided
  });
};

/**
 * Hook to fetch single ticker item (admin)
 */
export const useTickerItem = (id: string) => {
  return useQuery<TickerResponse, Error>({
    queryKey: ['ticker', id],
    queryFn: () => getTickerItemById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create ticker item (admin)
 */
export const useCreateTickerItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTickerItem,
    onSuccess: () => {
      // Invalidate ticker queries to refetch
      queryClient.invalidateQueries({ queryKey: ['ticker'] });
    },
  });
};

/**
 * Hook to update ticker item (admin)
 */
export const useUpdateTickerItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TickerFormData> }) =>
      updateTickerItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticker'] });
    },
  });
};

/**
 * Hook to delete ticker item (admin)
 */
export const useDeleteTickerItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTickerItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticker'] });
    },
  });
};

/**
 * Hook to toggle ticker item (admin)
 */
export const useToggleTickerItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleTickerItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticker'] });
    },
  });
};

/**
 * Hook to clear cache (admin)
 */
export const useClearTickerCache = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearTickerCache,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticker'] });
    },
  });
};

export default {
  getActiveTickerItems,
  getAllTickerItems,
  getTickerItemById,
  createTickerItem,
  updateTickerItem,
  deleteTickerItem,
  toggleTickerItem,
  trackTickerClick,
  trackTickerView,
  clearTickerCache,
  useTickerItems,
  useAllTickerItems,
  useTickerItem,
  useCreateTickerItem,
  useUpdateTickerItem,
  useDeleteTickerItem,
  useToggleTickerItem,
  useClearTickerCache,
};
