import api from './api';

export interface ConnectionRequest {
  _id: string;
  from: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    currentRole?: string;
    company?: string;
    batch?: string;
    department?: string;
    location?: string;
    role: 'student' | 'alumni';
  };
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface SentRequest {
  _id: string;
  to: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture?: string;
    currentRole?: string;
    company?: string;
    batch?: string;
    department?: string;
    location?: string;
    role: 'student' | 'alumni';
  };
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface MutualConnection {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  currentRole?: string;
  company?: string;
  batch?: string;
  department?: string;
  role: 'student' | 'alumni';
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

// Send connection request
export const sendConnectionRequest = async (userId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.post(`/api/connections/request/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Send connection request error:', error);
    throw error;
  }
};

// Get received connection requests
export const getConnectionRequests = async (): Promise<ApiResponse<ConnectionRequest[]>> => {
  try {
    const response = await api.get('/api/connections/requests');
    return response.data;
  } catch (error: any) {
    console.error('Get connection requests error:', error);
    throw error;
  }
};

// Get sent connection requests
export const getSentRequests = async (): Promise<ApiResponse<SentRequest[]>> => {
  try {
    const response = await api.get('/api/connections/sent');
    return response.data;
  } catch (error: any) {
    console.error('Get sent requests error:', error);
    throw error;
  }
};

// Accept connection request
export const acceptConnectionRequest = async (requestId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.put(`/api/connections/accept/${requestId}`);
    return response.data;
  } catch (error: any) {
    console.error('Accept connection request error:', error);
    throw error;
  }
};

// Reject connection request
export const rejectConnectionRequest = async (requestId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.put(`/api/connections/reject/${requestId}`);
    return response.data;
  } catch (error: any) {
    console.error('Reject connection request error:', error);
    throw error;
  }
};

// Remove connection
export const removeConnection = async (userId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await api.delete(`/api/connections/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Remove connection error:', error);
    throw error;
  }
};

// Get mutual connections
export const getMutualConnections = async (userId: string): Promise<ApiResponse<{ count: number; connections: MutualConnection[] }>> => {
  try {
    const response = await api.get(`/api/connections/mutual/${userId}`);
    return response.data;
  } catch (error: any) {
    console.error('Get mutual connections error:', error);
    throw error;
  }
};
