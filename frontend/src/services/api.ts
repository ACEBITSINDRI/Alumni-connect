import axios, { type AxiosInstance, AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    console.log('[API Request]', config.url, 'Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Handle specific status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          console.error('[API 401 Error]', error.config?.url, 'Response:', error.response.data);
          console.error('[API 401] Token before clear:', localStorage.getItem('accessToken')?.substring(0, 20));
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');

          // Only redirect if not already on auth pages
          if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
            console.error('[API 401] Redirecting to /login');
            window.location.href = '/login';
          }
          break;
        case 403:
          // Forbidden - Check if email verification is required
          if ((error.response?.data as any)?.requiresVerification) {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const email = user.email || '';
            window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
          } else {
            console.error('Access denied');
          }
          break;
        case 404:
          // Not found
          console.error('Resource not found');
          break;
        case 500:
          // Server error
          console.error('Server error');
          break;
        default:
          console.error('An error occurred');
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - please check your connection');
    }
    return Promise.reject(error);
  }
);

export default api;

// Axios instance for file uploads with multipart/form-data
export const apiFormData: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  // Don't set Content-Type header - axios will set it automatically with FormData
});

apiFormData.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiFormData.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
