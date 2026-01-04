import api, { apiFormData } from './api';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
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
  isEmailVerified?: boolean;
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
  // alias used across UI
  phone?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  availableForMentorship?: boolean;
  // UI uses mentorshipAvailable in some places
  mentorshipAvailable?: boolean;
  // Additional profile fields used in ProfileEditPage
  department?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  experience?: any[];
  education?: any[];
  createdAt: string;
}

// Login
export const login = async (email: string, password: string, role: 'student' | 'alumni'): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/login', { email, password, role });

  // Store token and user data
  if (response.data.success && response.data.data) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

// Student Registration
export const registerStudent = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rollNumber: string;
  currentYear?: string;
  currentSemester?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  profilePicture?: File | null;
  idCard?: File | null;
}): Promise<AuthResponse> => {
  const data = new FormData();

  // Append basic fields
  data.append('firstName', formData.firstName);
  data.append('lastName', formData.lastName);
  data.append('email', formData.email);
  data.append('password', formData.password);
  data.append('role', 'student');
  data.append('enrollmentNumber', formData.rollNumber);

  // Append optional fields
  if (formData.currentYear) data.append('batch', formData.currentYear);
  if (formData.currentSemester) data.append('currentSemester', formData.currentSemester);
  if (formData.phone) data.append('phone', formData.phone);
  if (formData.bio) data.append('bio', formData.bio);
  if (formData.skills && formData.skills.length > 0) {
    data.append('skills', JSON.stringify(formData.skills));
  }

  // Append files
  if (formData.profilePicture) {
    data.append('profilePicture', formData.profilePicture);
  }
  if (formData.idCard) {
    data.append('idCard', formData.idCard);
  }

  const response = await apiFormData.post<AuthResponse>('/api/auth/register', data);

  // Store token and user data
  if (response.data.success && response.data.data) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

// Alumni Registration
export const registerAlumni = async (formData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rollNumber: string;
  graduationYear?: string;
  company?: string;
  jobRole?: string;
  jobDomain?: string;
  experience?: string;
  city?: string;
  state?: string;
  country?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  profilePicture?: File | null;
  availableForMentorship?: boolean;
}): Promise<AuthResponse> => {
  const data = new FormData();

  // Append basic fields
  data.append('firstName', formData.firstName);
  data.append('lastName', formData.lastName);
  data.append('email', formData.email);
  data.append('password', formData.password);
  data.append('role', 'alumni');
  data.append('enrollmentNumber', formData.rollNumber);

  // Append alumni-specific fields
  if (formData.graduationYear) data.append('batch', formData.graduationYear);
  if (formData.company) data.append('company', formData.company);
  if (formData.jobRole) data.append('currentRole', formData.jobRole);
  if (formData.jobDomain) data.append('jobDomain', formData.jobDomain);
  if (formData.experience) data.append('experience', formData.experience);
  if (formData.phone) data.append('phone', formData.phone);
  if (formData.bio) data.append('bio', formData.bio);

  // Location
  const location: any = {};
  if (formData.city) location.city = formData.city;
  if (formData.state) location.state = formData.state;
  if (formData.country) location.country = formData.country;
  if (Object.keys(location).length > 0) {
    data.append('location', JSON.stringify(location));
  }

  // Skills
  if (formData.skills && formData.skills.length > 0) {
    data.append('skills', JSON.stringify(formData.skills));
  }

  // URLs
  if (formData.linkedinUrl) data.append('linkedinUrl', formData.linkedinUrl);
  if (formData.githubUrl) data.append('githubUrl', formData.githubUrl);

  // Mentorship
  if (formData.availableForMentorship !== undefined) {
    data.append('availableForMentorship', formData.availableForMentorship.toString());
  }

  // Append profile picture
  if (formData.profilePicture) {
    data.append('profilePicture', formData.profilePicture);
  }

  const response = await apiFormData.post<AuthResponse>('/api/auth/register', data);

  // Store token and user data
  if (response.data.success && response.data.data) {
    localStorage.setItem('accessToken', response.data.data.accessToken);
    localStorage.setItem('refreshToken', response.data.data.refreshToken);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

// Logout
export const logout = async (): Promise<void> => {
  await api.post('/api/auth/logout');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
};

// Verify Email
export const verifyEmail = async (token: string): Promise<AuthResponse> => {
  const response = await api.get<AuthResponse>(`/api/auth/verify-email/${token}`);
  return response.data;
};

// Resend Verification Email
export const resendVerificationEmail = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/resend-verification', { email });
  return response.data;
};

// Forgot Password
export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/api/auth/forgot-password', { email });
  return response.data;
};

// Reset Password
export const resetPassword = async (token: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`/api/auth/reset-password/${token}`, { password });
  return response.data;
};

// Get Current User
export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<{ success: boolean; data: User }>('/api/auth/me');
  return response.data.data;
};

// Social Login (Google, LinkedIn)
export const socialLogin = async (provider: 'google' | 'linkedin', token: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(`/auth/${provider}`, { token });
  return response.data;
};
