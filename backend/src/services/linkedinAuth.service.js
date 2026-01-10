import axios from 'axios';
import { auth } from '../config/firebase.js';

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';

/**
 * Generate LinkedIn OAuth authorization URL
 */
export const getLinkedInAuthUrl = (state, redirectUri) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;

  // Validate environment variables
  if (!clientId) {
    console.error('❌ LINKEDIN_CLIENT_ID environment variable is not set!');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('LINKEDIN')));
    throw new Error('LinkedIn OAuth is not configured. Missing LINKEDIN_CLIENT_ID environment variable.');
  }

  console.log('✅ LinkedIn OAuth URL generation:', {
    clientId: clientId.substring(0, 5) + '...',
    redirectUri,
    hasState: !!state
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: 'openid profile email',
  });

  return `${LINKEDIN_AUTH_URL}?${params.toString()}`;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForToken = async (code, redirectUri) => {
  try {
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

    // Validate environment variables
    if (!clientId || !clientSecret) {
      console.error('❌ LinkedIn OAuth credentials not configured!');
      console.error('Missing:', {
        clientId: !clientId,
        clientSecret: !clientSecret
      });
      throw new Error('LinkedIn OAuth credentials are not configured');
    }

    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    });

    console.log('🔄 Exchanging LinkedIn code for token...');
    const response = await axios.post(LINKEDIN_TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    console.log('✅ LinkedIn token exchange successful');
    console.log('Token response keys:', Object.keys(response.data));
    console.log('Has access_token:', !!response.data.access_token);
    console.log('Has id_token:', !!response.data.id_token);
    console.log('Token type:', response.data.token_type);
    console.log('Scope:', response.data.scope);

    return response.data;
  } catch (error) {
    console.error('❌ LinkedIn token exchange error:', error.response?.data || error.message);
    throw new Error('Failed to exchange LinkedIn authorization code for token');
  }
};

/**
 * Get LinkedIn user profile
 */
export const getLinkedInUserInfo = async (accessToken) => {
  try {
    console.log('🔄 Fetching LinkedIn user info...');
    console.log('Access token (first 20 chars):', accessToken?.substring(0, 20) + '...');

    const response = await axios.get(LINKEDIN_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('✅ LinkedIn user info fetched successfully');
    console.log('User data:', {
      email: response.data.email,
      name: response.data.name,
      sub: response.data.sub
    });

    return response.data;
  } catch (error) {
    console.error('❌ LinkedIn user info error details:');
    console.error('Status:', error.response?.status);
    console.error('Status Text:', error.response?.statusText);
    console.error('Response data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Error message:', error.message);
    console.error('Request URL:', LINKEDIN_USERINFO_URL);
    console.error('Access token exists:', !!accessToken);
    throw new Error('Failed to fetch LinkedIn user info');
  }
};

/**
 * Create or update Firebase user from LinkedIn profile
 */
export const createFirebaseUserFromLinkedIn = async (linkedInProfile) => {
  try {
    const { sub, email, name, given_name, family_name, picture } = linkedInProfile;

    // Check if user already exists
    let firebaseUser;
    try {
      // Try to find by email first
      if (email) {
        firebaseUser = await auth.getUserByEmail(email);
        console.log('✅ Found existing Firebase user by email:', firebaseUser.uid);
      }
    } catch (error) {
      // User doesn't exist, create new one
      if (error.code === 'auth/user-not-found') {
        console.log('Creating new Firebase user for LinkedIn profile...');

        firebaseUser = await auth.createUser({
          email: email,
          emailVerified: true, // LinkedIn email is verified
          displayName: name || `${given_name || ''} ${family_name || ''}`.trim(),
          photoURL: picture,
          // Use LinkedIn sub (user ID) as part of the UID
          uid: `linkedin_${sub}`,
        });

        console.log('✅ Firebase user created:', firebaseUser.uid);
      } else {
        throw error;
      }
    }

    // Set custom claims to mark this as LinkedIn authenticated
    await auth.setCustomUserClaims(firebaseUser.uid, {
      linkedInId: sub,
      provider: 'linkedin',
    });

    return firebaseUser;
  } catch (error) {
    console.error('Error creating Firebase user from LinkedIn:', error);

    // If UID already exists, try without custom UID
    if (error.code === 'auth/uid-already-exists') {
      const { email, name, given_name, family_name, picture } = linkedInProfile;

      const firebaseUser = await auth.createUser({
        email: email,
        emailVerified: true,
        displayName: name || `${given_name || ''} ${family_name || ''}`.trim(),
        photoURL: picture,
      });

      await auth.setCustomUserClaims(firebaseUser.uid, {
        linkedInId: linkedInProfile.sub,
        provider: 'linkedin',
      });

      return firebaseUser;
    }

    throw error;
  }
};
