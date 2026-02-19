import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '../../config/firebase';
import toast from 'react-hot-toast';
import Card from '../../components/common/Card';
import { Loader2 } from 'lucide-react';

const LinkedInCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Check for error
        const error = searchParams.get('error');
        if (error) {
          setStatus('error');
          setErrorMessage(decodeURIComponent(error));
          toast.error(decodeURIComponent(error));
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Get tokens and user data from URL params
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');
        const firebaseToken = searchParams.get('firebaseToken');
        const userJson = searchParams.get('user');
        const isNewUser = searchParams.get('isNewUser') === 'true';
        const needsProfileCompletion = searchParams.get('needsProfileCompletion') === 'true';

        if (!accessToken || !refreshToken || !firebaseToken || !userJson) {
          setStatus('error');
          setErrorMessage('Missing authentication data');
          toast.error('Authentication failed: Missing data');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userJson));

        // Save tokens to localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isNewUser', isNewUser.toString());
        localStorage.setItem('needsProfileCompletion', needsProfileCompletion.toString());

        console.log('[LinkedIn Callback] Tokens saved:', {
          hasAccessToken: !!localStorage.getItem('accessToken'),
          hasUser: !!localStorage.getItem('user'),
        });

        // Notify parent window if this was opened as a popup
        if (window.opener) {
          window.opener.postMessage({
            type: 'linkedin-auth-success',
            accessToken,
            refreshToken,
            user,
            isNewUser,
            needsProfileCompletion,
          }, window.location.origin);
        }

        // Sign in to Firebase with custom token
        await signInWithCustomToken(auth, firebaseToken);
        console.log('[LinkedIn Callback] Firebase sign-in successful');

        // Set user in context
        setUser(user);

        setStatus('success');

        // Navigate based on profile completion status
        if (isNewUser && needsProfileCompletion) {
          toast.success('Account created successfully!');
          toast('Please complete your profile to continue', { icon: 'ℹ️' });
          setTimeout(() => navigate('/profile/edit'), 1000);
        } else {
          toast.success('Welcome back!');
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      } catch (error: any) {
        console.error('[LinkedIn Callback] Error:', error);
        setStatus('error');
        setErrorMessage(error.message || 'Authentication failed');
        toast.error('Authentication failed. Please try again.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    processCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card variant="elevated" className="p-8 shadow-xl max-w-md w-full">
        <div className="text-center">
          {status === 'processing' && (
            <>
              <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Completing LinkedIn Sign-In
              </h2>
              <p className="text-gray-600">
                Please wait while we set up your account...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Success!
              </h2>
              <p className="text-gray-600">
                Redirecting you now...
              </p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-4">
                {errorMessage}
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to login page...
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default LinkedInCallback;
