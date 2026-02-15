import api from './api';

export interface Alumni {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'alumni' | 'student' | 'admin';
  profilePicture?: string;
  coverPhoto?: string;
  bio?: string;
  batch?: string;
  company?: string;
  currentRole?: string;
  location?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  skills?: string[];
  experience?: number;
  mentorshipAvailable?: boolean;
  phone?: string;
  department?: string;
  createdAt: string;
}

export interface AlumniFilters {
  batches?: string[];
  companies?: string[];
  locations?: string[];
  mentorshipAvailable?: boolean;
  search?: string;
  sortBy?: 'recent' | 'name-asc' | 'name-desc' | 'batch-desc' | 'batch-asc' | 'experience-desc';
  page?: number;
  limit?: number;
}

// Get all alumni
export const getAllAlumni = async (filters?: AlumniFilters) => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.batches?.length) params.append('batches', filters.batches.join(','));
    if (filters?.companies?.length) params.append('companies', filters.companies.join(','));
    if (filters?.locations?.length) params.append('locations', filters.locations.join(','));
    if (filters?.mentorshipAvailable) params.append('mentorshipAvailable', 'true');
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await api.get(`/api/users?role=alumni&${params.toString()}`);
    // API returns { success: true, data: { users: [...], pagination: {...} } }
    return {
      data: response.data.data.users || [],
      total: response.data.data.pagination?.totalUsers || 0,
    };
  } catch (error) {
    console.error('Error fetching alumni in service:', error);
    // Always return the expected structure even on error
    return {
      data: [],
      total: 0,
    };
  }
};

// Get alumni by ID
export const getAlumniById = async (id: string) => {
  const response = await api.get(`/api/users/${id}`);
  return response.data;
};

// Search alumni
export const searchAlumni = async (query: string) => {
  const response = await api.get(`/api/users/search?q=${query}&role=alumni`);
  return response.data;
};

// Get alumni stats
export const getAlumniStats = async () => {
  const response = await api.get('/api/users/stats?role=alumni');
  return response.data;
};
