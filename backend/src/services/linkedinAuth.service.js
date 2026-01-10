import axios from 'axios';
import { auth } from '../config/firebase.js';

const LINKEDIN_AUTH_URL = 'https://www.linkedin.com/oauth/v2/authorization';
const LINKEDIN_TOKEN_URL = 'https://www.linkedin.com/oauth/v2/accessToken';
const LINKEDIN_USERINFO_URL = 'https://api.linkedin.com/v2/userinfo';

/**
 * Generate LinkedIn OAuth authorization URL
 */
export const getLinkedInAuthUrl = (state, redirectUri) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
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
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });

    const response = await axios.post(LINKEDIN_TOKEN_URL, params.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    console.error('LinkedIn token exchange error:', error.response?.data || error.message);
    throw new Error('Failed to exchange LinkedIn authorization code for token');
  }
};

/**
 * Get LinkedIn user profile
 */
export const getLinkedInUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(LINKEDIN_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('LinkedIn user info error:', error.response?.data || error.message);
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
