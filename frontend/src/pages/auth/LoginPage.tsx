import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, HardHat, Building2, ArrowLeft, CheckCircle, GraduationCap } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { DEPARTMENT_INFO } from '../../utils/civilEngConstants';
import { login as loginApi } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

// Import images
import bitLogo from '../../assets/logos/logo.png';
import bigBuildingGreenish from '../../assets/civil eng element/big building greenish.png';
import multiFamousBuilding from '../../assets/civil eng element/multi famous building.jpeg';
import bridgesWithNames from '../../assets/civil eng element/bridges with names.jpeg';

interface LoginPageProps {
  userType?: 'student' | 'alumni';
}

const LoginPage: React.FC<LoginPageProps> = ({ userType = 'student' }) => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'student' | 'alumni'>(userType);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await loginApi(formData.email, formData.password, activeTab);

      if (response.success && response.data) {
        // Set user in context
        setUser(response.data.user);

        // Navigate to dashboard
        navigate('/dashboard');
      } else {
        setErrors({ submit: response.message || 'Login failed. Please try again.' });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Hero Section with Civil Engineering Theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-600 via-orange-700 to-blue-900 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <img
              src={bigBuildingGreenish}
              alt="Civil Engineering Building"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-orange-600/90 via-orange-700/90 to-blue-900/90"></div>
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
              <p className="text-orange-100 text-sm font-medium">ACE • BIT Sindri</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <Badge variant="success" className="mb-4 bg-yellow-400 text-orange-900">
              <Building2 size={16} className="mr-2" />
              Est. {DEPARTMENT_INFO.established}
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-3">
              {DEPARTMENT_INFO.name}
            </h2>
            <p className="text-orange-50 leading-relaxed text-sm">
              {DEPARTMENT_INFO.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: <CheckCircle />, text: '1,250+ Alumni Network' },
            { icon: <CheckCircle />, text: 'Top Infrastructure Companies' },
            { icon: <CheckCircle />, text: 'Expert Mentorship' },
            { icon: <CheckCircle />, text: 'Exclusive Job Opportunities' },
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

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
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

          <Card variant="elevated" className="p-8 shadow-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your account to continue
              </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => setActiveTab('student')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'student'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <GraduationCap size={18} />
                <span>Student</span>
              </button>
              <button
                onClick={() => setActiveTab('alumni')}
                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'alumni'
                    ? 'bg-white text-orange-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <HardHat size={18} />
                <span>Alumni</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  leftIcon={<Mail size={18} />}
                  placeholder="your.email@example.com"
                  error={errors.email}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  leftIcon={<Lock size={18} />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                  placeholder="Enter your password"
                  error={errors.password}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">Or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to={`/signup/${activeTab}`}
                className="font-medium text-orange-600 hover:text-orange-700"
              >
                Create Account
              </Link>
            </p>
          </Card>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our{' '}
              <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
