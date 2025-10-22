import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building, MapPin, Chrome, Upload, Briefcase, HardHat, GraduationCap, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Dropdown from '../../components/common/Dropdown';
import Badge from '../../components/common/Badge';
import { DEPARTMENT_INFO } from '../../utils/civilEngConstants';

// Import images
import bitLogo from '../../assets/logos/logo.png';
import aestheticBuilding from '../../assets/civil eng element/aesthetic building.jpeg';
import nightView from '../../assets/civil eng element/night view 🤍🪟.jpeg';
import multiFamousBuilding from '../../assets/civil eng element/multi famous building.jpeg';
import bridgesWithNames from '../../assets/civil eng element/bridges with names.jpeg';

interface SignupPageProps {
  userType?: 'student' | 'alumni';
}

const SignupPage: React.FC<SignupPageProps> = ({ userType = 'student' }) => {
  const navigate = useNavigate();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
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
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Signup data:', formData);

      // Navigate to email verification page
      navigate('/verify-email');
    } catch (error) {
      setErrors({ submit: 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: 'google' | 'linkedin') => {
    console.log(`Signup with ${provider}`);
    // TODO: Implement social signup
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center border-2 border-white/50 shadow-lg">
                <HardHat className="text-orange-600" size={32} />
              </div>
              <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center p-2 border-2 border-white/50 shadow-lg">
                <img
                  src={bitLogo}
                  alt="BIT Sindri Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Alumni Connect</h1>
              <p className="text-orange-100 text-sm font-medium">ACE BIT Sindri</p>
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
              Connect with 1,250+ civil engineering alumni from BIT Sindri. Build meaningful connections and grow your career.
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: <GraduationCap />, text: '1,250+ Alumni Network' },
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
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center shadow-lg">
                <HardHat className="text-white" size={28} />
              </div>
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
                <img
                  src={bitLogo}
                  alt="BIT Sindri Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
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
            <p className="text-gray-600">
              Connect with {userType === 'student' ? 'fellow students and' : ''} 1,250+ civil engineering alumni
            </p>
          </div>

        <Card variant="elevated" className="p-6 sm:p-8 shadow-xl border-t-4 border-t-orange-600">
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
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Chrome size={20} className="text-red-500" />
                    <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
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
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">JPG, PNG or GIF. Max size 5MB.</p>
                </div>

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
  );
};

export default SignupPage;
