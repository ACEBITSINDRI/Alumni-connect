import api from './api';

export interface Opportunity {
  _id: string;
  title: string;
  company: string;
  description: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Freelance';
  category: 'Job' | 'Internship';
  location: string;
  workMode: 'On-site' | 'Remote' | 'Hybrid';
  experience: {
    min: number;
    max?: number;
    level: 'Entry Level' | 'Mid Level' | 'Senior Level' | 'Executive';
  };
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  skills: string[];
  qualifications: string[];
  postedBy: string;
  postedDate: string;
  deadline: string;
  applicants?: number;
  isActive: boolean;
}

export interface OpportunityFilters {
  jobTypes?: string[];
  companies?: string[];
  locations?: string[];
  experience?: string;
  search?: string;
  sortBy?: 'recent' | 'salary-high' | 'salary-low';
  page?: number;
  limit?: number;
}

// Get all opportunities
export const getAllOpportunities = async (filters?: OpportunityFilters) => {
  try {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.jobTypes?.length) params.append('types', filters.jobTypes.join(','));
    if (filters?.companies?.length) params.append('companies', filters.companies.join(','));
    if (filters?.locations?.length) params.append('locations', filters.locations.join(','));
    if (filters?.experience) params.append('experience', filters.experience);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    params.append('status', 'active');

    const response = await api.get(`/api/opportunities?${params.toString()}`);
    // API returns { success: true, data: [...], total: ..., page: ..., pages: ... }
    return {
      data: response.data.data || [],
      total: response.data.total || 0,
    };
  } catch (error) {
    console.error('Error fetching opportunities in service:', error);
    // Always return the expected structure even on error
    return {
      data: [],
      total: 0,
    };
  }
};

// Get opportunity by ID
export const getOpportunityById = async (id: string) => {
  const response = await api.get(`/api/opportunities/${id}`);
  return response.data;
};

// Search opportunities
export const searchOpportunities = async (query: string) => {
  const response = await api.get(`/api/opportunities/search?q=${query}`);
  return response.data;
};

// Get opportunity stats
export const getOpportunityStats = async () => {
  const response = await api.get('/api/opportunities/stats');
  return response.data;
};
