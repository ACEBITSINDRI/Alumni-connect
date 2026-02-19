import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building, MapPin, Upload, Briefcase, HardHat, GraduationCap, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Dropdown from '../../components/common/Dropdown';
import Badge from '../../components/common/Badge';
import { DEPARTMENT_INFO } from '../../utils/civilEngConstants';
import { registerStudent, registerAlumni } from '../../services/auth.service';
import { loginWithGoogle, loginWithLinkedIn } from '../../services/firebase/auth.service';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import SEOHead from '../../components/common/SEOHead';

// Import images
import alumniConnectLogo from '../../assets/logos/alumni_connect_logo-removebg-preview.png';
import aestheticBuilding from '../../assets/civil eng element/aesthetic building.jpeg';
import nightView from '../../assets/civil eng element/night view 🤍🪟.jpeg';
import multiFamousBuilding from '../../assets/civil eng element/multi famous building.jpeg';
import bridgesWithNames from '../../assets/civil eng element/bridges with names.jpeg';

interface SignupPageProps {
  userType?: 'student' | 'alumni';
}

const SignupPage: React.FC<SignupPageProps> = ({ userType = 'student' }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1 - Basic Info
    firstName: '',
    lastName: '',
    email: '',
    rollNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,

    // Step 2 - Academic/Professional Details
    currentYear: '',
    currentSemester: '',
    phone: '',
    graduationYear: '',
    company: '',
    jobRole: '',
    jobDomain: '',
    experience: '',
    city: '',
    state: '',
    country: 'India',
    linkedinUrl: '',

    // Step 3 - Profile Setup
    profilePicture: null as File | null,
    idCard: null as File | null, // For students only
    bio: '',
    skills: [] as string[],
    availableForMentorship: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 3;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'profilePicture' | 'idCard') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file based on field type
      if (fieldName === 'profilePicture') {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
          setErrors(prev => ({ ...prev, [fieldName]: 'Please upload a valid image (JPG, PNG, or WEBP)' }));
          return;
        }

        if (file.size > maxSize) {
          setErrors(prev => ({ ...prev, [fieldName]: 'Image size must be less than 5MB' }));
          return;
        }
      } else if (fieldName === 'idCard') {
        const maxSize = 10 * 1024 * 1024; // 10MB for PDF
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

        if (!allowedTypes.includes(file.type)) {
          setErrors(prev => ({ ...prev, [fieldName]: 'Please upload a valid PDF or image file' }));
          return;
        }

        if (file.size > maxSize) {
          setErrors(prev => ({ ...prev, [fieldName]: 'File size must be less than 10MB' }));
          return;
        }
      }

      setFormData(prev => ({ ...prev, [fieldName]: file }));
      // Clear error if file is valid
      if (errors[fieldName]) {
        setErrors(prev => ({ ...prev, [fieldName]: '' }));
      }
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.rollNumber) newErrors.rollNumber = 'Roll number is required';
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (userType === 'student') {
      if (!formData.currentYear) newErrors.currentYear = 'Current year is required';
      if (!formData.currentSemester) newErrors.currentSemester = 'Current semester is required';
    } else {
      if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required';
      if (!formData.company) newErrors.company = 'Company name is required';
      if (!formData.jobRole) newErrors.jobRole = 'Job role is required';
      if (!formData.jobDomain) newErrors.jobDomain = 'Job domain is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.linkedinUrl) {
        newErrors.linkedinUrl = 'LinkedIn profile is required';
      } else if (!formData.linkedinUrl.includes('linkedin.com')) {
        newErrors.linkedinUrl = 'Please enter a valid LinkedIn URL';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;

    setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;

      if (userType === 'student') {
        // Validate student-specific required fields
        if (!formData.idCard) {
          setErrors({ idCard: 'Student ID card is required' });
          setIsLoading(false);
          return;
        }

        response = await registerStudent({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          rollNumber: formData.rollNumber,
          currentYear: formData.currentYear,
          currentSemester: formData.currentSemester,
          phone: formData.phone,
          bio: formData.bio,
          skills: formData.skills,
          profilePicture: formData.profilePicture,
          idCard: formData.idCard,
        });
      } else {
        // Alumni registration
        response = await registerAlumni({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          rollNumber: formData.rollNumber,
          graduationYear: formData.graduationYear,
          company: formData.company,
          jobRole: formData.jobRole,
          jobDomain: formData.jobDomain,
          experience: formData.experience,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          phone: formData.phone,
          bio: formData.bio,
          skills: formData.skills,
          linkedinUrl: formData.linkedinUrl,
          profilePicture: formData.profilePicture,
          availableForMentorship: formData.availableForMentorship,
        });
      }

      if (response.success && response.data) {
        // CRITICAL: Ensure tokens are saved to localStorage BEFORE navigation
        // These should already be saved by auth.service, but double-check
        if (response.data.accessToken) {
          localStorage.setItem('accessToken', response.data.accessToken);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          console.log('[Signup] Tokens saved:', {
            hasAccessToken: !!localStorage.getItem('accessToken'),
            hasUser: !!localStorage.getItem('user'),
          });
        } else {
          console.error('[Signup] No tokens in response!', response.data);
        }

        // Set user in context
        setUser(response.data.user);

        // Small delay to ensure localStorage write completes
        await new Promise(resolve => setTimeout(resolve, 100));

        // Navigate to dashboard or verification page based on isEmailVerified status
        if (response.data.user.isEmailVerified) {
          navigate('/dashboard');
        } else {
          navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`);
        }
      } else {
        setErrors({ submit: response.message || 'Signup failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Signup failed. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = async (provider: 'google' | 'linkedin') => {
    setIsLoading(true);

    try {
      // Social Sign-In with Firebase (Google or LinkedIn)
      const result: any = provider === 'google'
        ? await loginWithGoogle(userType)
        : await loginWithLinkedIn(userType);

      if (result.user) {
        // CRITICAL: Save tokens explicitly
        if (result.accessToken) {
          localStorage.setItem('accessToken', result.accessToken);
          localStorage.setItem('refreshToken', result.refreshToken);
          localStorage.setItem('user', JSON.stringify(result.user));
          console.log(`[${provider} Signup] Tokens saved:`, {
            hasAccessToken: !!localStorage.getItem('accessToken'),
            hasUser: !!localStorage.getItem('user'),
          });
        } else {
          console.error(`[${provider} Signup] No tokens in response!`, result);
        }

        // Set user in context
        setUser(result.user);

        // Small delay to ensure localStorage write completes
        await new Promise(resolve => setTimeout(resolve, 100));

        // Show success message
        if (result.isNewUser) {
          toast.success(`Account created successfully with ${provider === 'google' ? 'Google' : 'LinkedIn'}!`);
          // New user - check if profile needs completion
          if (result.needsProfileCompletion) {
            toast('Please complete your profile to continue', { icon: 'ℹ️' });
            navigate('/profile/edit');
          } else {
            navigate('/dashboard');
          }
        } else {
          toast.success('Welcome back!');
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error(`${provider} signup error:`, error);

      // Handle specific Firebase errors
      let errorMessage = `Failed to sign up with ${provider === 'google' ? 'Google' : 'LinkedIn'}. Please try again.`;

      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by browser. Please allow popups for this site.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead
        title={`${userType === 'student' ? 'Student' : 'Alumni'} Registration - BIT Sindri Civil Engineering | Join ACE Alumni Network`}
        description={`Register as ${userType === 'student' ? 'a student of' : 'an alumnus from'} BIT Sindri Department of Civil Engineering.Connect with alumni, find mentorship, jobs, and networking opportunities.`}
        keywords={`BIT Sindri ${userType} registration, Civil Engineering ${userType} signup, BIT Dhanbad ${userType}, ACE BIT Sindri join, Alumni network registration, Engineering college ${userType}, BIT Sindri admission, Civil Engineering community`}
        url={`https://alumni-connect.bitsindri.ac.in/signup/${userType}`}
      />
      <div className="min-h-screen bg-gray-50 flex !dark:dark-none" style={{ colorScheme: 'light' }}>
        {/* Left Side - Hero Section with Civil Engineering Theme */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-orange-600 via-blue-700 to-orange-800 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <img
              src={aestheticBuilding}
              alt="Civil Engineering Building"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-blue-700/90 to-orange-800/90"></div>
          </div>

          {/* Decorative image overlays */}
          <div className="absolute top-20 right-10 w-48 h-48 rounded-lg overflow-hidden opacity-20 rotate-6">
            <img
              src={bridgesWithNames}
              alt="Famous Bridges"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-20 left-10 w-56 h-56 rounded-lg overflow-hidden opacity-15 -rotate-6">
            <img
              src={multiFamousBuilding}
              alt="Famous Buildings"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Night View Image - Top Left */}
          <div className="absolute top-32 left-12 w-40 h-40 rounded-lg overflow-hidden opacity-20 -rotate-12">
            <img
              src={nightView}
              alt="Night View"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Logo and Institution */}
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center ">
              <img
                src={alumniConnectLogo}
                alt="Alumni Connect Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">Alumni Connect</h1>
              <p className="text-orange-100 text-base font-semibold">ACE • BIT Sindri</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <Badge variant="success" className="mb-4 bg-yellow-400 text-orange-900">
              <Building size={16} className="mr-2" />
              Est. {DEPARTMENT_INFO.established}
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-3">
              Join Our Network
            </h2>
            <p className="text-orange-50 leading-relaxed text-sm">
              Connect with  civil engineering alumni from BIT Sindri. Build meaningful connections and grow your career.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: <GraduationCap />, text: ' Alumni Network' },
            { icon: <Building />, text: 'Top Companies' },
            { icon: <User />, text: 'Expert Mentorship' },
            { icon: <Briefcase />, text: 'Job Opportunities' },
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-2 text-white">
              {React.cloneElement(feature.icon, { size: 20, className: 'text-yellow-400 flex-shrink-0' })}
              <span className="text-sm">{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="relative z-10 text-center text-orange-100 text-sm">
          <p>© {new Date().getFullYear()} ACE BIT Sindri. All rights reserved.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>

          {/* Mobile Logo */}
          <div className="lg:hidden flex flex-col items-center justify-center mb-8">
            <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center shadow-xl p-4 mb-3">
              <img
                src={alumniConnectLogo}
                alt="Alumni Connect Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Alumni Connect</h1>
            <p className="text-sm text-orange-600 font-semibold">ACE BIT Sindri</p>
          </div>

          {/* Header - Visible on mobile only */}
          <div className="lg:hidden text-center mb-8">
            <Badge variant="primary" className="mb-4 bg-orange-600 text-white">
              <Building size={16} className="mr-2" />
              {DEPARTMENT_INFO.name}
            </Badge>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join the Alumni Network
            </h1>
          </div>

        <Card variant="elevated" className="p-6 sm:p-8 shadow-xl border-t-4 border-t-orange-600 bg-white text-gray-900">
          {/* Tab Selection */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => navigate('/signup/student')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                userType === 'student'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <GraduationCap size={18} />
              <span>Student Signup</span>
            </button>
            <button
              onClick={() => navigate('/signup/alumni')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                userType === 'alumni'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <HardHat size={18} />
              <span>Alumni Signup</span>
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                        currentStep >= step
                          ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    <span className={`text-xs mt-2 hidden sm:block font-medium ${
                      currentStep >= step ? 'text-orange-600' : 'text-gray-600'
                    }`}>
                      {step === 1 && 'Basic Info'}
                      {step === 2 && (userType === 'student' ? 'Academic' : 'Professional')}
                      {step === 3 && 'Profile'}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                        currentStep > step ? 'bg-gradient-to-r from-orange-600 to-orange-700' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {/* Social Signup */}
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={() => handleSocialSignup('google')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center justify-center w-5 h-5">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
                      {isLoading ? 'Signing up...' : 'Continue with Google'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialSignup('linkedin')}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-[#0A66C2] border-2 border-[#0A66C2] rounded-lg hover:bg-[#004182] hover:border-[#004182] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                  >
                    <div className="flex items-center justify-center w-5 h-5">
                      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-semibold text-white group-hover:text-white">
                      {isLoading ? 'Signing up...' : 'Continue with LinkedIn'}
                    </span>
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    error={errors.lastName}
                    required
                  />
                </div>

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={userType === 'student' ? 'yourroll@bitsindri.ac.in' : 'john.doe@example.com'}
                  leftIcon={<Mail size={20} />}
                  error={errors.email}
                  required
                />

                <Input
                  label="BIT Sindri Roll Number"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  placeholder="2021CE001"
                  helperText="For verification purposes"
                  error={errors.rollNumber}
                  required
                />

                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  leftIcon={<Lock size={20} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="focus:outline-none"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                  error={errors.password}
                  required
                />

                <Input
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  leftIcon={<Lock size={20} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="focus:outline-none"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  }
                  error={errors.confirmPassword}
                  required
                />

                <div className="pt-2">
                  <label className="flex items-start">
                    <input
                      type="checkbox"
                      name="termsAccepted"
                      checked={formData.termsAccepted}
                      onChange={handleChange}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                    />
                    <span className="ml-2 text-sm text-gray-600">
                      I accept the{' '}
                      <Link to="/terms" className="text-primary-600 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  {errors.termsAccepted && (
                    <p className="mt-1 text-sm text-red-600">{errors.termsAccepted}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Academic/Professional Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                {userType === 'student' ? (
                  <>
                    <Dropdown
                      label="Current Year"
                      options={[
                        { label: '1st Year', value: '1' },
                        { label: '2nd Year', value: '2' },
                        { label: '3rd Year', value: '3' },
                        { label: '4th Year', value: '4' },
                      ]}
                      value={formData.currentYear}
                      onChange={(value) => handleDropdownChange('currentYear', value)}
                      placeholder="Select your year"
                      error={errors.currentYear}
                      required
                    />

                    <Dropdown
                      label="Current Semester"
                      options={Array.from({ length: 8 }, (_, i) => ({
                        label: `Semester ${i + 1}`,
                        value: String(i + 1),
                      }))}
                      value={formData.currentSemester}
                      onChange={(value) => handleDropdownChange('currentSemester', value)}
                      placeholder="Select your semester"
                      error={errors.currentSemester}
                      required
                    />

                    <Input
                      label="Phone Number"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      leftIcon={<Phone size={20} />}
                      helperText="Optional"
                    />
                  </>
                ) : (
                  <>
                    <Dropdown
                      label="Graduation Year"
                      options={Array.from({ length: 25 }, (_, i) => {
                        const year = 2024 - i;
                        return { label: String(year), value: String(year) };
                      })}
                      value={formData.graduationYear}
                      onChange={(value) => handleDropdownChange('graduationYear', value)}
                      placeholder="Select batch year"
                      error={errors.graduationYear}
                      required
                    />

                    <Input
                      label="Current Company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Larsen & Toubro"
                      leftIcon={<Building size={20} />}
                      error={errors.company}
                      required
                    />

                    <Input
                      label="Job Role/Designation"
                      name="jobRole"
                      value={formData.jobRole}
                      onChange={handleChange}
                      placeholder="Senior Engineer"
                      leftIcon={<Briefcase size={20} />}
                      error={errors.jobRole}
                      required
                    />

                    <Dropdown
                      label="Job Domain"
                      options={[
                        { label: 'Construction', value: 'construction' },
                        { label: 'Consulting', value: 'consulting' },
                        { label: 'Government', value: 'government' },
                        { label: 'Research & Development', value: 'research' },
                        { label: 'Academia', value: 'academia' },
                        { label: 'IT/Software', value: 'it' },
                        { label: 'Startup/Entrepreneurship', value: 'startup' },
                        { label: 'Other', value: 'other' },
                      ]}
                      value={formData.jobDomain}
                      onChange={(value) => handleDropdownChange('jobDomain', value)}
                      placeholder="Select domain"
                      error={errors.jobDomain}
                      required
                    />

                    <Input
                      label="Years of Experience"
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="5"
                      min="0"
                      max="50"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Mumbai"
                        leftIcon={<MapPin size={20} />}
                        error={errors.city}
                        required
                      />
                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Maharashtra"
                      />
                    </div>

                    <Input
                      label="LinkedIn Profile URL"
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      error={errors.linkedinUrl}
                      required
                    />
                  </>
                )}
              </div>
            )}

            {/* Step 3: Profile Setup */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {formData.profilePicture ? (
                        <img
                          src={URL.createObjectURL(formData.profilePicture)}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User size={40} className="text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors inline-flex items-center space-x-2">
                        <Upload size={18} />
                        <span className="text-sm font-medium">Upload Photo</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'profilePicture')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                  {errors.profilePicture && (
                    <p className="mt-1 text-sm text-red-600">{errors.profilePicture}</p>
                  )}
                </div>

                {/* ID Card Upload - Students Only */}
                {userType === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Student ID Card <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {formData.idCard ? (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-300">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Upload size={20} className="text-gray-600" />
                              <span className="text-sm text-gray-700">{formData.idCard.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, idCard: null }))}
                              className="text-red-600 hover:text-red-700 text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <div className="px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-500 transition-colors flex items-center justify-center space-x-2">
                            <Upload size={18} />
                            <span className="text-sm font-medium">Upload ID Card</span>
                          </div>
                          <input
                            type="file"
                            accept="application/pdf,image/*"
                            onChange={(e) => handleFileChange(e, 'idCard')}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Upload your student ID card (PDF or image). Max size 10MB.
                    </p>
                    {errors.idCard && (
                      <p className="mt-1 text-sm text-red-600">{errors.idCard}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    maxLength={userType === 'student' ? 200 : 500}
                    placeholder="Tell us about yourself..."
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.bio.length} / {userType === 'student' ? 200 : 500} characters
                  </p>
                </div>

                {userType === 'alumni' && (
                  <div className="pt-2">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="availableForMentorship"
                        checked={formData.availableForMentorship}
                        onChange={handleChange}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500 mt-1"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        I am available for mentorship
                        <span className="block text-xs text-gray-500 mt-0.5">
                          Students will be able to reach out to you for guidance
                        </span>
                      </span>
                    </label>
                  </div>
                )}
              </div>
            )}

            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < totalSteps ? (
                <Button type="button" variant="primary" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="primary" isLoading={isLoading}>
                  {isLoading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to={`/login/${userType}`}
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Login here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  </div>
  </>
  );
};

export default SignupPage;
