import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, HardHat, Building2 } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { DEPARTMENT_INFO } from '../../utils/civilEngConstants';

// Import images
import bitLogo from '../../assets/logos/logo.png';
import buildingOpenness from '../../assets/civil eng element/buildingopenness.jpeg';
import architecture3d from '../../assets/civil eng element/3d architecture design.jpeg';
import bitTshirt from '../../assets/civil eng element/bit tshirt.png';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log('Password reset email sent to:', email);

      setIsSubmitted(true);
      setCountdown(60);

      // Start countdown
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsSubmitted(false);
    setCountdown(0);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-4">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-2xl">AC</span>
              </div>
            </Link>
          </div>

          <Card variant="elevated" className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to
            </p>
            <p className="text-primary-600 font-medium mb-8">{email}</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Click the link in the email to reset your password. The link will expire in 1 hour.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Didn't receive the email?
              </p>
              {countdown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend available in {countdown} seconds
                </p>
              ) : (
                <Button
                  variant="outline"
                  onClick={handleResend}
                  className="w-full"
                >
                  Resend Email
                </Button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/login"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-2"
              >
                <ArrowLeft size={16} />
                <span>Back to Login</span>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Hero Section with Civil Engineering Theme */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-orange-700 to-orange-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Images */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <img
              src={buildingOpenness}
              alt="Civil Engineering"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-orange-700/90 to-orange-600/90"></div>
          </div>

          {/* BIT Tshirt Image - Center Right */}
          <div className="absolute top-1/2 right-12 transform -translate-y-1/2 w-80 h-80">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-blue-400/30 rounded-full blur-3xl"></div>
            <img
              src={bitTshirt}
              alt="BIT Sindri T-Shirt"
              className="relative z-10 w-full h-full object-contain drop-shadow-2xl opacity-40 animate-float"
            />
          </div>

          {/* Decorative image overlay */}
          <div className="absolute bottom-20 left-10 w-48 h-48 rounded-lg overflow-hidden opacity-15 -rotate-6">
            <img
              src={architecture3d}
              alt="3D Architecture"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Logo and Institution */}
        <div className="relative z-10">
          <div class="flex items-center space-x-4 mb-6">
            <div class="w-24 h-24 rounded-2xl flex items-center justify-center ">
              <img alt="Alumni Connect Logo" class="w-full h-full object-contain" src="/assets/alumni_connect_logo-removebg-preview-B3U9VPj1.png"/>
            </div>
            <div>
              <h1 class="text-3xl font-bold text-white drop-shadow-lg">Alumni Connect</h1>
              <p class="text-orange-100 text-base font-semibold">ACE • BIT Sindri</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <Badge variant="success" className="mb-4 bg-yellow-400 text-orange-900">
              <Building2 size={16} className="mr-2" />
              Est. {DEPARTMENT_INFO.established}
            </Badge>
            <h2 className="text-3xl font-bold text-white mb-3">
              Account Recovery
            </h2>
            <p className="text-orange-50 leading-relaxed text-sm">
              We'll help you regain access to your account securely. A password reset link will be sent to your registered email address.
            </p>
          </div>
        </div>

        {/* Security Features */}
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: <CheckCircle />, text: 'Secure Password Reset' },
            { icon: <CheckCircle />, text: 'Email Verification' },
            { icon: <CheckCircle />, text: 'Account Protection' },
            { icon: <CheckCircle />, text: '24/7 Support' },
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 text-gray-600 hover:text-orange-600 mb-6 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Login</span>
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

          <Card variant="elevated" className="p-8 shadow-xl border-t-4 border-t-orange-600">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-orange-600" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Forgot Password?
              </h1>
              <p className="text-gray-600">
                No worries, we'll send you reset instructions
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                placeholder="your.email@example.com"
                leftIcon={<Mail size={20} />}
                error={error}
                required
              />

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{' '}
                <Link
                  to="/login"
                  className="text-orange-600 hover:text-orange-700 font-medium"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
