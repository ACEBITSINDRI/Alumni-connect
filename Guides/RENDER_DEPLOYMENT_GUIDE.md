# 🚀 Render Deployment Guide - Alumni Connect

## Backend Deployment to Render

### Prerequisites
- Render account
- Firebase service account JSON file
- MongoDB Atlas connection string
- All environment variables ready

---

## Step 1: Prepare Firebase Service Account for Render

### Why We Need This
Render doesn't allow uploading files, so we need to provide the Firebase service account credentials as an environment variable.

### Convert Firebase JSON to Single-Line String

**Option 1: Using Command Line (Linux/Mac/Git Bash)**
```bash
# Navigate to backend directory
cd backend

# Convert JSON to single-line string
cat alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json | jq -c
```

**Option 2: Using Node.js**
```javascript
// create convert-firebase-json.js
const fs = require('fs');
const json = fs.readFileSync('alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json', 'utf8');
const singleLine = JSON.stringify(JSON.parse(json));
console.log(singleLine);
```

Run:
```bash
node convert-firebase-json.js
```

**Option 3: Using Online Tool**
1. Go to https://codebeautify.org/jsonminifier
2. Paste your Firebase service account JSON
3. Click "Minify/Compress"
4. Copy the single-line output

### Example Output
```json
{"type":"service_account","project_id":"alumni-connect-84d49","private_key_id":"abc123","private_key":"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n","client_email":"firebase-adminsdk-...@alumni-connect-84d49.iam.gserviceaccount.com","client_id":"1234567890","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"https://www.googleapis.com/robot/v1/metadata/x509/..."}
```

⚠️ **IMPORTANT:** Copy this entire single-line JSON. You'll need it for the next step.

---

## Step 2: Create Web Service on Render

1. **Login to Render Dashboard**
   - Go to https://dashboard.render.com/

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select `Alumni-connect` repository

3. **Configure Service Settings**
   - **Name:** `alumni-connect-backend`
   - **Region:** Singapore (or closest to your users)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or paid for production)

---

## Step 3: Add Environment Variables on Render

In your Render service settings, go to **Environment** tab and add these variables:

### 🔥 Required Firebase Variables

```bash
# CRITICAL: Firebase Service Account (the single-line JSON from Step 1)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"alumni-connect-84d49",...FULL_JSON_HERE...}

# Firebase Project Details
FIREBASE_PROJECT_ID=alumni-connect-84d49
FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app
FIREBASE_WEB_CLIENT_ID=697354232724-vsrvg6n5iul43clq98aguo5aieuejmac.apps.googleusercontent.com
```

### 🗄️ Database Variables

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
DB_NAME=ALUMNI-CONNECT
```

### 🔐 JWT Variables

```bash
JWT_SECRET=your_super_secret_jwt_key_at_least_32_characters
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret_different_from_jwt_secret
JWT_REFRESH_EXPIRE=30d
```

### 📧 Email Configuration (Nodemailer)

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@alumniconnect.com
```

### 🌐 CORS & Frontend URL

```bash
FRONTEND_URL=https://your-frontend-url.vercel.app
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### ⚙️ Other Variables

```bash
NODE_ENV=production
PORT=5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete (3-5 minutes)
4. Check logs for errors

### Expected Logs (Success)
```
✅ Firebase Admin: Using service account from environment variable
✅ Firebase Admin initialized successfully
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Common Errors & Solutions

**Error: Invalid FIREBASE_SERVICE_ACCOUNT_KEY**
```
Solution: Ensure the JSON is properly minified to single-line
- No line breaks (\n) except in private_key
- No extra spaces
- Valid JSON format
```

**Error: MongoDB connection failed**
```
Solution:
1. Whitelist Render IP (0.0.0.0/0) in MongoDB Atlas
2. Check MONGODB_URI format
3. Verify database user has permissions
```

**Error: Module not found**
```
Solution: Check package.json and ensure all dependencies are listed
```

---

## Step 5: Frontend Deployment to Vercel

### Update Frontend Environment Variables

Create `.env.production` in frontend directory:

```bash
VITE_API_URL=https://your-render-backend-url.onrender.com/api

# Firebase Client Config
VITE_FIREBASE_API_KEY=AIzaSyATjemmoNeyZply-qhueE8_4U1ga_xbvyU
VITE_FIREBASE_AUTH_DOMAIN=alumni-connect-84d49.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=alumni-connect-84d49
VITE_FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=697354232724
VITE_FIREBASE_APP_ID=1:697354232724:web:a9f3c8ed58e11e1e8b3e62
VITE_FIREBASE_MEASUREMENT_ID=G-R4K5LH2QPN
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel --prod
```

Or use Vercel GitHub integration:
1. Connect repository to Vercel
2. Set root directory to `frontend`
3. Framework preset: Vite
4. Add environment variables
5. Deploy

---

## Step 6: Update CORS After Deployment

After frontend is deployed, update backend environment variable:

```bash
CORS_ORIGIN=https://your-actual-frontend-url.vercel.app
```

Redeploy backend on Render (automatic or manual redeploy).

---

## Step 7: Verify Deployment

### Test Backend

```bash
# Health check
curl https://your-backend-url.onrender.com/api/health

# Expected response
{"status":"ok","timestamp":"2025-01-..."}
```

### Test Firebase Auth

1. Go to frontend signup page
2. Click "Continue with Google"
3. Sign in with Google account
4. Check backend logs for Firebase token verification

### Check Logs

**Render Dashboard → Logs**
Look for:
```
✅ Firebase Admin: Using service account from environment variable
✅ Firebase Admin initialized successfully
✅ Connected to MongoDB
POST /api/auth/google-login 200
```

---

## 🔒 Security Checklist

- [ ] Firebase service account JSON is stored in environment variable (not committed to Git)
- [ ] `.gitignore` includes `*firebase-adminsdk*.json`
- [ ] MongoDB Atlas has IP whitelist configured
- [ ] JWT secrets are strong random strings (32+ characters)
- [ ] CORS_ORIGIN is set to exact frontend URL (not wildcard *)
- [ ] Gmail app password is used (not regular password)
- [ ] All sensitive variables are in Render environment (not in code)

---

## 📊 Monitoring

### Render Dashboard
- Check deployment status
- Monitor CPU/Memory usage
- View real-time logs
- Set up alerts

### Firebase Console
- Monitor authentication activity
- Check storage usage
- View Cloud Functions logs (if using)

### MongoDB Atlas
- Monitor database connections
- Check query performance
- Set up alerts for high usage

---

## 🚨 Troubleshooting

### Backend Won't Start

1. **Check Render Logs**
   ```
   Dashboard → Logs → View all logs
   ```

2. **Common Issues:**
   - Missing environment variables
   - Invalid Firebase JSON format
   - MongoDB connection timeout
   - Port conflicts

3. **Test Locally First**
   ```bash
   # Set FIREBASE_SERVICE_ACCOUNT_KEY in local .env
   export FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'

   # Start backend
   npm start
   ```

### Google Sign-In Not Working

1. **Check Firebase Console**
   - Authorized domains include both localhost and production domain
   - Go to: Authentication → Settings → Authorized domains

2. **Add Production Domain**
   ```
   your-frontend-url.vercel.app
   ```

3. **Check CORS**
   - Backend CORS_ORIGIN matches frontend URL exactly
   - No trailing slash in URLs

### File Upload Errors

1. **Check Firebase Storage Rules**
   - Go to Firebase Console → Storage → Rules
   - Ensure authenticated users can upload

2. **Check Storage Bucket**
   - Verify FIREBASE_STORAGE_BUCKET is correct
   - Format: `alumni-connect-84d49.firebasestorage.app`

---

## 📝 Quick Reference

### Get Single-Line Firebase JSON (PowerShell - Windows)

```powershell
# Read file and convert to single line
$json = Get-Content alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json -Raw | ConvertFrom-Json | ConvertTo-Json -Compress
Write-Output $json
```

### Get Single-Line Firebase JSON (Bash - Linux/Mac)

```bash
cat alumni-connect-84d49-firebase-adminsdk-fbsvc-1c333b605e.json | jq -c
```

### Test Firebase Connection Locally

```javascript
// test-firebase.js
import admin from './src/config/firebase.js';

async function test() {
  try {
    const listUsers = await admin.auth().listUsers(1);
    console.log('✅ Firebase connected successfully!');
    console.log('Sample user:', listUsers.users[0]?.email);
  } catch (error) {
    console.error('❌ Firebase connection failed:', error.message);
  }
}

test();
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] All environment variables set correctly
- [ ] Firebase service account JSON stored securely
- [ ] MongoDB Atlas configured with IP whitelist
- [ ] CORS configured correctly
- [ ] SSL/HTTPS enabled (automatic on Render/Vercel)
- [ ] Google Auth tested and working
- [ ] File uploads tested
- [ ] Email notifications working
- [ ] Custom domain configured (optional)
- [ ] Error monitoring set up (Sentry, LogRocket, etc.)

---

**Deployment Date:** 2025-01-XX
**Last Updated:** 2025-01-XX
**Status:** ✅ Production Ready

**Need Help?** Check the logs first, then review this guide step by step.
