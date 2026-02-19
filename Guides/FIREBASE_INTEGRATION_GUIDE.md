# Firebase Integration Guide - Alumni Connect

## Overview

Your Alumni Connect application has been successfully integrated with Firebase! This guide will help you understand the new architecture and how to use Firebase features.

## What Changed?

### Authentication System
- **Before**: JWT-based authentication with bcrypt password hashing
- **After**: Firebase Authentication with support for:
  - Email/Password authentication
  - Google Sign-In
  - Social logins (can add GitHub, Facebook, etc.)
  - Built-in password reset
  - Email verification

### File Storage
- **Before**: Cloudinary for image/document uploads
- **After**: Firebase Storage for all file uploads
  - Profile pictures
  - ID cards/documents
  - Post images
  - Event images

### New Features
- **Firebase Analytics**: Track user behavior, page views, events
- **Firebase Cloud Messaging (FCM)**: Push notifications
- **Better Security**: Firebase handles authentication tokens
- **Scalability**: Firebase can handle millions of users

## Architecture

```
Frontend (React)
├── Firebase Client SDK
│   ├── Authentication
│   ├── Storage
│   ├── Analytics
│   └── Cloud Messaging
│
Backend (Node.js/Express)
├── Firebase Admin SDK
│   ├── Token Verification
│   ├── Storage Management
│   └── Push Notifications
│
MongoDB
└── User Profile Data Storage
```

## Setup Instructions

### 1. Environment Variables

#### Backend (.env)
```env
# MongoDB (no changes)
MONGODB_URI=your_mongodb_uri
DB_NAME=ALUMNI-CONNECT

# Firebase Admin SDK
FIREBASE_SERVICE_ACCOUNT_PATH=alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json
FIREBASE_PROJECT_ID=alumni-connect-84d49
FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app

# Other existing configurations...
```

#### Frontend (.env.local)
```env
VITE_API_URL=http://localhost:5000/api

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyATjemmoNeyZply-qhueE8_4U1ga_xbvyU
VITE_FIREBASE_AUTH_DOMAIN=alumni-connect-84d49.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=alumni-connect-84d49
VITE_FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=697354232724
VITE_FIREBASE_APP_ID=1:697354232724:web:88f010a874a283f36ba581
VITE_FIREBASE_MEASUREMENT_ID=G-XNQPN39KKF
VITE_FIREBASE_VAPID_KEY=BAiQKNgVJyUu7SUnijrDcYzO7TFLDmXm9RWHCOCcYPh9UG962_cPcDunUlw2nk8a6ebUww3kV-NSB0yf9sgbvgc
```

### 2. Firebase Console Setup

#### Enable Authentication Methods
1. Go to Firebase Console: https://console.firebase.google.com
2. Select project: `alumni-connect-84d49`
3. Navigate to: **Build > Authentication > Sign-in method**
4. Enable:
   - ✅ Email/Password
   - ✅ Google
   - (Optional) GitHub, Facebook, etc.

#### Configure Storage Rules
Already configured! But if needed, go to:
1. **Build > Storage > Rules**
2. The rules are set to allow authenticated users only

#### Enable Cloud Messaging
1. **Build > Cloud Messaging**
2. Web Push certificates are already configured
3. VAPID key is in your .env file

## How to Use

### Frontend - User Registration

```typescript
import { registerUser } from './services/firebase/auth.service';

// Register with email/password
const handleRegister = async (formData) => {
  try {
    const result = await registerUser({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'alumni',
      // ... other fields
    }, profilePictureFile, idCardFile);

    console.log('User registered:', result.user);
    // Firebase automatically handles email verification
  } catch (error) {
    console.error('Registration error:', error);
  }
};
```

### Frontend - User Login

```typescript
import { loginUser, loginWithGoogle } from './services/firebase/auth.service';

// Login with email/password
const handleLogin = async (email, password, role) => {
  try {
    const result = await loginUser(email, password, role);
    console.log('Logged in:', result.user);
    // Store user data in your state management
  } catch (error) {
    console.error('Login error:', error);
  }
};

// Login with Google
const handleGoogleLogin = async (role) => {
  try {
    const result = await loginWithGoogle(role);
    if (result.isNewUser) {
      // Redirect to complete profile
    } else {
      // Redirect to dashboard
    }
  } catch (error) {
    console.error('Google login error:', error);
  }
};
```

### Frontend - Track Analytics Events

```typescript
import {
  trackPageView,
  trackLogin,
  trackPostCreated
} from './services/firebase/analytics.service';

// Track page views
useEffect(() => {
  trackPageView('Dashboard', 'User Dashboard');
}, []);

// Track user actions
const handleCreatePost = async () => {
  // ... create post logic
  trackPostCreated('general');
};
```

### Frontend - Push Notifications

```typescript
import {
  requestNotificationPermission,
  onMessageListener
} from './services/firebase/messaging.service';

// Request permission on app load
useEffect(() => {
  const setupNotifications = async () => {
    const token = await requestNotificationPermission();
    if (token) {
      // Token is automatically saved to backend
      console.log('FCM token received');
    }
  };

  setupNotifications();

  // Listen for foreground messages
  onMessageListener((payload) => {
    // Show notification toast
    toast.info(payload.notification.body);
  });
}, []);
```

### Backend - Send Push Notifications

```javascript
import admin from './config/firebase.js';

// Send notification to a user
const sendNotificationToUser = async (userId, title, body, data) => {
  const user = await User.findById(userId);

  if (!user.fcmToken) {
    console.log('User has no FCM token');
    return;
  }

  const message = {
    notification: {
      title,
      body,
    },
    data,
    token: user.fcmToken,
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Notification sent:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

// Example usage
await sendNotificationToUser(
  '507f1f77bcf86cd799439011',
  'New Message',
  'You have a new message from John',
  { type: 'message', messageId: '123' }
);
```

## Migration from Old System

### For Existing Users

Your existing MongoDB users will need to be migrated to Firebase:

1. **Option 1 - Manual Migration**: Users reset password via Firebase
2. **Option 2 - Automatic**: Create a migration script (contact developer)

### Password Reset

Users can now reset passwords directly through Firebase:
```typescript
import { resetPassword } from './services/firebase/auth.service';

await resetPassword('user@example.com');
// Firebase sends password reset email
```

## API Endpoints Changed

### Before (JWT)
```
POST /api/auth/register          - Register with password
POST /api/auth/login             - Login with password
POST /api/auth/forgot-password   - Send reset email
POST /api/auth/reset-password    - Reset password
```

### After (Firebase)
```
POST /api/auth/register          - Register (requires Firebase ID token)
POST /api/auth/login             - Login (requires Firebase ID token)
POST /api/auth/google-login      - Google Sign-In
POST /api/auth/fcm-token         - Save FCM token
GET  /api/auth/me                - Get current user
POST /api/auth/logout            - Logout
```

**Important**: All endpoints (except register) now require Firebase ID token in Authorization header.

## Testing

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Start Frontend
```bash
cd frontend
npm run dev
```

### 3. Test Registration
1. Go to registration page
2. Enter user details
3. Click "Register"
4. Check email for verification link (if email is configured)

### 4. Test Google Login
1. Click "Sign in with Google"
2. Select Google account
3. Should create new user or login existing user

### 5. Test Push Notifications
1. Allow notifications when prompted
2. Send test notification from backend
3. Should see notification

## Troubleshooting

### "Firebase: Error (auth/popup-blocked)"
- Enable popups for your localhost
- Or use redirect-based auth instead of popup

### "Firebase Storage: User does not have permission"
- Check Storage Rules in Firebase Console
- Make sure user is authenticated

### "FCM token not generated"
- Check if HTTPS is enabled (required for FCM)
- For localhost, use `localhost` not `127.0.0.1`
- Check browser console for errors

### "Invalid Firebase ID token"
- Token might be expired (tokens expire after 1 hour)
- Re-login to get fresh token
- Check if service account file is correctly placed

## Firebase Console Useful Links

- **Project Dashboard**: https://console.firebase.google.com/project/alumni-connect-84d49
- **Authentication**: https://console.firebase.google.com/project/alumni-connect-84d49/authentication/users
- **Storage**: https://console.firebase.google.com/project/alumni-connect-84d49/storage
- **Analytics**: https://console.firebase.google.com/project/alumni-connect-84d49/analytics
- **Cloud Messaging**: https://console.firebase.google.com/project/alumni-connect-84d49/notification

## Security Best Practices

1. **Never commit** `service-account-key.json` to git
2. **Keep** Firebase API keys in environment variables
3. **Review** Storage rules regularly
4. **Monitor** Authentication logs for suspicious activity
5. **Enable** Multi-factor authentication for admins
6. **Set up** Firebase App Check for production

## Next Steps

1. ✅ Firebase Authentication - DONE
2. ✅ Firebase Storage - DONE
3. ✅ Firebase Analytics - DONE
4. ✅ Firebase Cloud Messaging - DONE
5. 🔲 Firebase ML Kit (for future features)
6. 🔲 Firebase Remote Config (for A/B testing)
7. 🔲 Firebase Performance Monitoring

## Support

If you encounter any issues:
1. Check Firebase Console for errors
2. Check browser console for client-side errors
3. Check backend logs for server-side errors
4. Review this guide thoroughly

For Firebase-specific issues, check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)

---

**Integration completed successfully!** 🎉

Your app is now powered by Firebase with MongoDB as the data store.
