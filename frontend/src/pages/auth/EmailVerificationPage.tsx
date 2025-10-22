import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, CheckCircle, XCircle, Loader } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const EmailVerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(!!token);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [email] = useState('user@example.com'); // This should come from auth context

  // Auto-verify if token is present
  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    setError('');

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Email verified with token:', verificationToken);

      setIsVerified(true);

      // Auto-redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError('Verification failed. The link may be expired or invalid.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Verification email resent to:', email);

      // Start countdown
      setCountdown(60);
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
      setError('Failed to resend email. Please try again.');
    }
  };

  // If currently verifying
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card variant="elevated" className="p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader size={32} className="text-primary-600 animate-spin" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Your Email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address
            </p>
          </Card>
        </div>
      </div>
    );
  }

  // If verification successful
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card variant="elevated" className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={32} className="text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 mb-8">
              Your email has been verified. Welcome to Alumni Connect!
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Redirecting to your dashboard in 3 seconds...
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // If verification failed or awaiting verification
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
          {error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle size={32} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail size={32} className="text-primary-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Check Your Email
              </h1>
              <p className="text-gray-600 mb-6">
                We've sent a verification link to
              </p>
              <p className="text-primary-600 font-medium mb-8">{email}</p>
            </>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              Click the link in the email to verify your account. The link will expire in 24 hours.
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
                onClick={handleResendEmail}
                className="w-full"
              >
                Resend Verification Email
              </Button>
            )}

            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Change Email Address
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Back to Login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerificationPage;
