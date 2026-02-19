import { z } from 'zod';
import { REGEX, CHAR_LIMITS, FILE_LIMITS } from './constants';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const studentSignupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  currentYear: z.string().min(1, 'Please select your current year'),
  currentSemester: z.string().min(1, 'Please select your current semester'),
  phoneNumber: z.string().regex(REGEX.PHONE, 'Invalid phone number').optional(),
  bio: z.string().max(CHAR_LIMITS.BIO_STUDENT, `Bio must be less than ${CHAR_LIMITS.BIO_STUDENT} characters`).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const alumniSignupSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  rollNumber: z.string().min(1, 'Roll number is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  graduationYear: z.string().min(1, 'Please select your graduation year'),
  currentCompany: z.string().min(1, 'Company name is required'),
  jobRole: z.string().min(1, 'Job role is required'),
  jobDomain: z.string().min(1, 'Please select your job domain'),
  yearsOfExperience: z.number().min(0, 'Years of experience must be 0 or greater'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  linkedinUrl: z.string().regex(REGEX.LINKEDIN, 'Invalid LinkedIn URL'),
  phoneNumber: z.string().regex(REGEX.PHONE, 'Invalid phone number').optional(),
  bio: z.string().max(CHAR_LIMITS.BIO_ALUMNI, `Bio must be less than ${CHAR_LIMITS.BIO_ALUMNI} characters`).optional(),
  availableForMentorship: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Post Schemas
export const createPostSchema = z.object({
  type: z.enum(['general', 'job', 'internship', 'advice', 'event', 'question']),
  title: z.string().min(5, 'Title must be at least 5 characters').max(CHAR_LIMITS.POST_TITLE, `Title must be less than ${CHAR_LIMITS.POST_TITLE} characters`),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.array(z.string()).max(CHAR_LIMITS.POST_TAGS, `Maximum ${CHAR_LIMITS.POST_TAGS} tags allowed`).optional(),
  targetAudience: z.string().optional(),
  // Job/Internship specific fields
  companyName: z.string().optional(),
  jobLocation: z.string().optional(),
  jobType: z.enum(['full-time', 'part-time', 'internship', 'contract']).optional(),
  experienceRequired: z.string().optional(),
  salaryRange: z.string().optional(),
  applyLink: z.string().url('Invalid URL').optional(),
  applyEmail: z.string().email('Invalid email').optional(),
  applicationDeadline: z.string().optional(),
});

export const commentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(CHAR_LIMITS.COMMENT, `Comment must be less than ${CHAR_LIMITS.COMMENT} characters`),
});

// Profile Schemas
export const editProfileSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().regex(REGEX.PHONE, 'Invalid phone number').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  currentCompany: z.string().optional(),
  jobRole: z.string().optional(),
  jobDomain: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  linkedinUrl: z.string().regex(REGEX.LINKEDIN, 'Invalid LinkedIn URL').optional().or(z.literal('')),
});

// Contact Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Donation Schema
export const donationSchema = z.object({
  amount: z.number().min(1, 'Amount must be greater than 0'),
  purpose: z.string().min(1, 'Please select a purpose'),
  isAnonymous: z.boolean().optional(),
  message: z.string().max(CHAR_LIMITS.DONATION_MESSAGE, `Message must be less than ${CHAR_LIMITS.DONATION_MESSAGE} characters`).optional(),
  panNumber: z.string().optional(),
  wantTaxReceipt: z.boolean().optional(),
});

// File Validation
export const validateImageFile = (file: File): string | null => {
  if (!FILE_LIMITS.ALLOWED_IMAGE_TYPES.includes(file.type as any)) {
    return 'Only JPEG, JPG, PNG, and WebP images are allowed';
  }
  if (file.size > FILE_LIMITS.IMAGE_MAX_SIZE) {
    return `Image size must be less than ${FILE_LIMITS.IMAGE_MAX_SIZE / (1024 * 1024)}MB`;
  }
  return null;
};

export const validateDocumentFile = (file: File): string | null => {
  if (!FILE_LIMITS.ALLOWED_DOCUMENT_TYPES.includes(file.type as any)) {
    return 'Only PDF files are allowed';
  }
  if (file.size > FILE_LIMITS.DOCUMENT_MAX_SIZE) {
    return `File size must be less than ${FILE_LIMITS.DOCUMENT_MAX_SIZE / (1024 * 1024)}MB`;
  }
  return null;
};

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type StudentSignupFormData = z.infer<typeof studentSignupSchema>;
export type AlumniSignupFormData = z.infer<typeof alumniSignupSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type CommentFormData = z.infer<typeof commentSchema>;
export type EditProfileFormData = z.infer<typeof editProfileSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type DonationFormData = z.infer<typeof donationSchema>;
