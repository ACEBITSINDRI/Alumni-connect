import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, Building, MapPin, Calendar, Chrome, Upload, Briefcase } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Dropdown from '../../components/common/Dropdown';

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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">AC</span>
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Your Account
          </h1>
          <p className="text-gray-600">
            Join the ACE community as a {userType}
          </p>
        </div>

        <Card variant="elevated" className="p-6 sm:p-8">
          {/* Tab Selection */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => navigate('/signup/student')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'student'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Student Signup
            </button>
            <button
              onClick={() => navigate('/signup/alumni')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                userType === 'alumni'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Alumni Signup
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                        currentStep >= step
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    <span className="text-xs mt-2 text-gray-600 hidden sm:block">
                      {step === 1 && 'Basic Info'}
                      {step === 2 && (userType === 'student' ? 'Academic' : 'Professional')}
                      {step === 3 && 'Profile'}
                    </span>
                  </div>
                  {step < totalSteps && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        currentStep > step ? 'bg-primary-600' : 'bg-gray-200'
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
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Login here
            </Link>
          </p>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
