import api from './api';
import { LoginFormData, StudentSignupFormData, AlumniSignupFormData } from '../utils/validation';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'alumni';
  isVerified: boolean;
  profilePicture?: string;
  coverPhoto?: string;
  // Student specific
  rollNumber?: string;
  currentYear?: string;
  currentSemester?: string;
  // Alumni specific
  graduationYear?: string;
  currentCompany?: string;
  jobRole?: string;
  jobDomain?: string;
  yearsOfExperience?: number;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  linkedinUrl?: string;
  // Common
  phoneNumber?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  availableForMentorship?: boolean;
  createdAt: string;
}

// Login
export const login = async (data: LoginFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

// Student Signup
export const studentSignup = async (data: StudentSignupFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup/student', data);
  return response.data;
};

// Alumni Signup
export const alumniSignup = async (data: AlumniSignupFormData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/signup/alumni', data);
  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Verify Email
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>(`/auth/verify-email/${token}`);
  return response.data;
};

// Resend Verification Email
export const resendVerificationEmail = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/resend-verification', { email });
  return response.data;
};

// Forgot Password
export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/forgot-password', { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (token: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`/auth/reset-password/${token}`, { password });
  return response.data;
};

// Get Current User
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ success: boolean; data: User }>('/auth/me');
  return response.data.data;
};

// Social Login (Google, LinkedIn)
export const socialLogin = async (provider: 'google' | 'linkedin', token: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`/auth/${provider}`, { token });
  return response.data;
};
