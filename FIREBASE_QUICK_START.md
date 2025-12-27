# Firebase Quick Start Guide

## Prerequisites Check ✅

- [x] Firebase project created: `alumni-connect-84d49`
- [x] Service account key downloaded: `alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json`
- [x] Google Authentication enabled in Firebase Console
- [x] Firebase packages installed (firebase-admin, firebase)

## Immediate Next Steps

### 1. Update Environment Files (5 minutes)

#### Backend: Copy `.env.example` to `.env`
```bash
cd backend
cp .env.example .env
```
Already configured! Just verify the file exists.

#### Frontend: Create `.env.local`
```bash
cd frontend
cp .env.example .env.local
```

All Firebase keys are already in the example file!

### 2. Firebase Console Final Checks

#### Enable Authentication Methods
1. Visit: https://console.firebase.google.com/project/alumni-connect-84d49/authentication/providers
2. Enable:
   - ✅ Email/Password
   - ✅ Google (should be already enabled)

#### Set Storage Rules
1. Visit: https://console.firebase.google.com/project/alumni-connect-84d49/storage/rules
2. Paste the rules from `FIREBASE_INTEGRATION_GUIDE.md` (already documented)

### 3. Start Your App

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Test Basic Flow

1. **Register**: http://localhost:5173/register
   - Enter details
   - Click "Register with Email"
   - Should create Firebase user + MongoDB profile

2. **Login**: http://localhost:5173/login
   - Enter credentials
   - Click "Login"
   - Should authenticate via Firebase

3. **Google Login**
   - Click "Sign in with Google"
   - Select account
   - Should work seamlessly

## Key Files Created

### Backend
```
backend/
├── src/
│   ├── config/
│   │   └── firebase.js                    # Firebase Admin setup
│   ├── services/
│   │   └── firebaseStorage.js             # File upload service
│   ├── middleware/
│   │   └── auth.js                        # Updated for Firebase
│   └── controllers/
│       └── authController.js              # Firebase auth logic
└── alumni-connect-*-firebase-adminsdk-*.json  # Service account (DO NOT COMMIT)
```

### Frontend
```
frontend/
├── src/
│   ├── config/
│   │   └── firebase.ts                    # Firebase client config
│   └── services/
│       └── firebase/
│           ├── auth.service.ts            # Auth methods
│           ├── analytics.service.ts       # Analytics tracking
│           └── messaging.service.ts       # Push notifications
└── public/
    └── firebase-messaging-sw.js           # FCM service worker
```

## Important Changes

### Authentication Flow Changed

**OLD (JWT)**:
```
Register → Hash Password → Save to MongoDB → Generate JWT
```

**NEW (Firebase)**:
```
Register → Create Firebase User → Get ID Token → Save to MongoDB
```

### API Request Headers Changed

**Before**:
```javascript
headers: {
  'Authorization': `Bearer ${jwtToken}`
}
```

**After**:
```javascript
// Get Firebase ID token
const idToken = await firebaseUser.getIdToken();

headers: {
  'Authorization': `Bearer ${idToken}`
}
```

## Common Gotchas

### 1. Service Account File Location
- **Must be** in `backend/` root directory
- **Must be** named exactly as in `.env` file
- **Must NOT** be committed to git (already in .gitignore)

### 2. CORS Issues
If you get CORS errors:
```javascript
// backend/.env
FRONTEND_URL=http://localhost:5173,http://localhost:5174
```

### 3. Firebase Token Expiry
Firebase ID tokens expire after **1 hour**.
Your app should refresh tokens automatically:
```typescript
const user = auth.currentUser;
if (user) {
  const token = await user.getIdToken(true); // force refresh
}
```

### 4. Push Notifications Require HTTPS
For production, you need HTTPS. For local development:
- Use `localhost` (not 127.0.0.1)
- Or use ngrok/localtunnel for testing

## Quick Test Commands

### Test Backend Firebase Connection
```bash
cd backend
node -e "const admin = require('./src/config/firebase.js'); console.log('Connected:', admin.default.app().name);"
```

### Test Frontend Build
```bash
cd frontend
npm run build
```

## Monitoring & Analytics

### View Real-time Users
https://console.firebase.google.com/project/alumni-connect-84d49/authentication/users

### View Analytics
https://console.firebase.google.com/project/alumni-connect-84d49/analytics

### View Storage Files
https://console.firebase.google.com/project/alumni-connect-84d49/storage

### View Cloud Messaging
https://console.firebase.google.com/project/alumni-connect-84d49/notification

## Feature Checklist

- ✅ Email/Password Authentication
- ✅ Google Sign-In
- ✅ Profile Picture Upload (Firebase Storage)
- ✅ Document Upload (Firebase Storage)
- ✅ Analytics Tracking
- ✅ Push Notifications (FCM)
- ✅ Token-based Auth (Firebase ID tokens)
- ✅ MongoDB User Profile Storage

## Need Help?

1. **Full Guide**: See `FIREBASE_INTEGRATION_GUIDE.md`
2. **Firebase Docs**: https://firebase.google.com/docs
3. **Console**: https://console.firebase.google.com/project/alumni-connect-84d49

## Production Deployment

Before deploying to production:

1. ✅ Update `FRONTEND_URL` in backend `.env`
2. ✅ Update `VITE_API_URL` in frontend `.env.production`
3. ✅ Set up Firebase App Check (security)
4. ✅ Review Storage Rules
5. ✅ Enable Firebase Authentication email templates
6. ✅ Set up budget alerts in Firebase Console

---

**Ready to go!** 🚀

Run `npm run dev` in both backend and frontend, then visit http://localhost:5173
