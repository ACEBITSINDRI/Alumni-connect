# ✅ Production Deployment Checklist

**Frontend:** https://alumniconnect.acebits.in
**Backend:** https://alumni-connect-backend-g28e.onrender.com

---

## 🔧 Backend Environment Variables (Render)

Make sure these are set in your **Render Backend Service → Environment**:

### ✅ Firebase (CRITICAL - Already provided)
```bash
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"alumni-connect-84d49",...}
FIREBASE_PROJECT_ID=alumni-connect-84d49
FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app
FIREBASE_WEB_CLIENT_ID=697354232724-vsrvg6n5iul43clq98aguo5aieuejmac.apps.googleusercontent.com
```

### 🌐 CORS Configuration
```bash
FRONTEND_URL=https://alumniconnect.acebits.in
CORS_ORIGIN=https://alumniconnect.acebits.in
```

### 🗄️ MongoDB
```bash
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=ALUMNI-CONNECT
```

### 🔐 JWT
```bash
JWT_SECRET=your_super_secret_jwt_key_min_32_chars
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_different_refresh_secret
JWT_REFRESH_EXPIRE=30d
```

### 📧 Email
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@alumniconnect.com
```

### ⚙️ Other
```bash
NODE_ENV=production
PORT=5000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🎨 Frontend Environment Variables

### Option 1: Using .env.production file (Recommended)
✅ Already updated in `.env.production`:
- Backend URL: `https://alumni-connect-backend-g28e.onrender.com/api`
- All Firebase config included

**No additional steps needed!** Just rebuild and redeploy.

### Option 2: Using Render/Vercel Environment Variables
If your frontend is on Render/Vercel, add these in the dashboard:

```bash
VITE_API_URL=https://alumni-connect-backend-g28e.onrender.com/api
VITE_SOCKET_URL=https://alumni-connect-backend-g28e.onrender.com

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyATjemmoNeyZply-qhueE8_4U1ga_xbvyU
VITE_FIREBASE_AUTH_DOMAIN=alumni-connect-84d49.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=alumni-connect-84d49
VITE_FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=697354232724
VITE_FIREBASE_APP_ID=1:697354232724:web:88f010a874a283f36ba581
VITE_FIREBASE_MEASUREMENT_ID=G-XNQPN39KKF
VITE_FIREBASE_VAPID_KEY=BAiQKNgVJyUu7SUnijrDcYzO7TFLDmXm9RWHCOCcYPh9UG962_cPcDunUlw2nk8a6ebUww3kV-NSB0yf9sgbvgc
```

---

## 🔥 Firebase Console Configuration

### 1. Add Authorized Domains
Go to: **Firebase Console → Authentication → Settings → Authorized domains**

Add these domains:
- ✅ `alumniconnect.acebits.in`
- ✅ `alumni-connect-backend-g28e.onrender.com`
- ✅ `localhost` (for development)

### 2. Update Firebase Storage CORS
If you haven't already, configure CORS for Firebase Storage:

**Create `cors.json`:**
```json
[
  {
    "origin": ["https://alumniconnect.acebits.in", "http://localhost:5174"],
    "method": ["GET", "POST", "PUT", "DELETE"],
    "maxAgeSeconds": 3600
  }
]
```

**Run:**
```bash
gsutil cors set cors.json gs://alumni-connect-84d49.firebasestorage.app
```

---

## 🚀 Deployment Steps

### Step 1: Update Backend CORS
1. Go to Render Backend → Environment
2. Update/Add:
   - `FRONTEND_URL=https://alumniconnect.acebits.in`
   - `CORS_ORIGIN=https://alumniconnect.acebits.in`
3. Save changes (auto-redeploys)

### Step 2: Deploy Frontend
```bash
# Commit the updated .env.production
git add frontend/.env.production
git commit -m "Update production backend URL"
git push origin main
```

Frontend will auto-redeploy on push.

### Step 3: Add Firebase Authorized Domains
1. Firebase Console → Authentication → Settings
2. Add `alumniconnect.acebits.in`
3. Save

### Step 4: Test Everything
- [ ] Frontend loads: https://alumniconnect.acebits.in
- [ ] Backend health: https://alumni-connect-backend-g28e.onrender.com/api/health
- [ ] Google Sign-In works
- [ ] File uploads work
- [ ] No CORS errors in browser console

---

## 🔍 Verification Commands

### Test Backend Health
```bash
curl https://alumni-connect-backend-g28e.onrender.com/api/health
```

Expected response:
```json
{"status":"ok","timestamp":"2025-XX-XX..."}
```

### Test CORS
Open browser console on https://alumniconnect.acebits.in and run:
```javascript
fetch('https://alumni-connect-backend-g28e.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

Should return `{status: "ok", ...}` without CORS errors.

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `Access to fetch at 'https://alumni-connect-backend-g28e.onrender.com/api/...' from origin 'https://alumniconnect.acebits.in' has been blocked by CORS`

**Solution:**
1. Check backend `CORS_ORIGIN` is set to `https://alumniconnect.acebits.in`
2. Restart backend service on Render
3. Clear browser cache

### Issue 2: Google Sign-In Fails
**Error:** `auth/unauthorized-domain`

**Solution:**
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add `alumniconnect.acebits.in`
3. Wait 5 minutes for Firebase to update

### Issue 3: API Calls Fail
**Error:** `Failed to fetch` or network errors

**Solution:**
1. Check `.env.production` has `/api` at the end:
   `VITE_API_URL=https://alumni-connect-backend-g28e.onrender.com/api`
2. Rebuild frontend
3. Clear browser cache

### Issue 4: Firebase Storage Upload Fails
**Error:** CORS error on file upload

**Solution:**
1. Configure Firebase Storage CORS (see above)
2. Check Firebase Storage rules allow authenticated uploads

---

## 📊 Expected Logs

### Backend (Render Logs)
```
✅ Firebase Admin: Using service account from environment variable
✅ Firebase Admin initialized successfully
✅ Connected to MongoDB
🚀 Server running on port 5000
```

### Frontend (Browser Console)
```
No CORS errors
No Firebase errors
Successful API calls to backend
Google Sign-In popup opens successfully
```

---

## 🎯 Final Checklist

- [ ] Backend FIREBASE_SERVICE_ACCOUNT_KEY added
- [ ] Backend CORS_ORIGIN = https://alumniconnect.acebits.in
- [ ] Frontend .env.production updated with backend URL
- [ ] Firebase authorized domains includes alumniconnect.acebits.in
- [ ] Frontend rebuilt and redeployed
- [ ] Backend health endpoint returns 200 OK
- [ ] Google Sign-In tested and working
- [ ] File uploads tested and working
- [ ] No console errors on frontend

---

## 🆘 Need Help?

1. Check Render logs (Backend & Frontend)
2. Check browser console for errors
3. Verify all environment variables are set
4. Test API endpoints with curl
5. Check Firebase Console for auth errors

---

**Status:** Ready for production ✅
**Updated:** 2025-12-29
**Next Review:** After deployment testing
