# 🚀 Render Deployment - Complete Environment Variables Setup

## For: Alumni Connect Backend on Render

---

## 📋 Environment Variables to Add in Render Dashboard

**Go to:** Your Render Service → Environment → Add Environment Variables

---

### **1. Server Configuration**

```env
PORT=5000
NODE_ENV=production
```

---

### **2. MongoDB Configuration**

```env
MONGODB_URI=mongodb+srv://acebitsindridhanbad_db_user:Kamlesh%40%232005@cluster0.atc0s8x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

DB_NAME=ALUMNI-CONNECT
```

---

### **3. JWT Configuration**

```env
JWT_SECRET=ace_bit_sindri_alumni_connect_secret_key_2024

JWT_EXPIRE=7d

JWT_REFRESH_SECRET=ace_bit_sindri_refresh_token_secret_2024

JWT_REFRESH_EXPIRE=30d
```

---

### **4. Email Configuration (IMPORTANT!)** 📧

```env
EMAIL_HOST=smtp.gmail.com

EMAIL_PORT=587

EMAIL_USER=alumniconnect.acebitsindri@gmail.com

EMAIL_PASSWORD=jiks efmh oyaf gifv

EMAIL_FROM=Alumni Connect - BIT Sindri <alumniconnect.acebitsindri@gmail.com>
```

**Note:** Remove spaces from app password! Final value: `jiksefmhoyafgifv`

---

### **5. Cloudinary Configuration**

```env
CLOUDINARY_CLOUD_NAME=dethhxmyj

CLOUDINARY_API_KEY=628492318989999

CLOUDINARY_API_SECRET=rOZytw-HqvuuJaYsE8yRzAXUjg8
```

---

### **6. Frontend URL & CORS** 🌐

```env
FRONTEND_URL=https://alumniconnect.acebits.in

CORS_ORIGIN=https://alumniconnect.acebits.in,http://localhost:5173
```

**Important:** This fixes the CORS error!

---

### **7. Firebase Admin SDK** 🔥

**FIREBASE_SERVICE_ACCOUNT_KEY** (Single line JSON):

**IMPORTANT:** Get this from your local `backend/firebase-service-account.json` file
- DO NOT commit this to GitHub (security risk)
- Copy the ENTIRE contents as a single line
- Remove all line breaks and spaces between JSON elements

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"alumni-connect-84d49","private_key_id":"YOUR_PRIVATE_KEY_ID","private_key":"YOUR_PRIVATE_KEY_HERE","client_email":"firebase-adminsdk-fbsvc@alumni-connect-84d49.iam.gserviceaccount.com",...}
```

**How to get it:**
1. Open `backend/firebase-service-account.json` from your local project
2. Copy the entire JSON content
3. Remove all line breaks to make it a single line
4. Paste in Render environment variable

**Alternative:** Create a Secret File in Render (Recommended)
- File name: `firebase-service-account.json`
- Path: `/etc/secrets/firebase-service-account.json`
- Content: The formatted JSON above

---

### **8. Firebase Project Details**

```env
FIREBASE_PROJECT_ID=alumni-connect-84d49

FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app

FIREBASE_WEB_CLIENT_ID=697354232724-vsrvg6n5iul43clq98aguo5aieuejmac.apps.googleusercontent.com
```

---

### **9. Rate Limiting**

```env
RATE_LIMIT_WINDOW_MS=900000

RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📱 Frontend Environment Variables (For Production Build)

**Platform:** Vercel / Netlify / Render (Frontend)

**Go to:** Your Frontend Service → Environment Variables

---

### **Frontend Production Variables:**

```env
# API URL (Backend on Render)
VITE_API_URL=https://alumni-connect-backend-g28e.onrender.com/api

VITE_SOCKET_URL=https://alumni-connect-backend-g28e.onrender.com

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyATjemmoNeyZply-qhueE8_4U1ga_xbvyU

VITE_FIREBASE_AUTH_DOMAIN=alumni-connect-84d49.firebaseapp.com

VITE_FIREBASE_PROJECT_ID=alumni-connect-84d49

VITE_FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app

VITE_FIREBASE_MESSAGING_SENDER_ID=697354232724

VITE_FIREBASE_APP_ID=1:697354232724:web:88f010a874a283f36ba581

VITE_FIREBASE_MEASUREMENT_ID=G-XNQPN39KKF

# Firebase Cloud Messaging VAPID Key (IMPORTANT!)
VITE_FIREBASE_VAPID_KEY=BAiQKNgVJyUu7SUnijrDcYzO7TFLDmXm9RWHCOCcYPh9UG962_cPcDunUlw2nk8a6ebUww3kV-NSB0yf9sgbvgc

# Cloudinary (Legacy)
VITE_CLOUDINARY_CLOUD_NAME=dethhxmyj

VITE_CLOUDINARY_UPLOAD_PRESET=your_preset

# ACE Website
VITE_ACE_WEBSITE_URL=https://acebits.in
```

---

## 🔧 How to Add Environment Variables in Render

### **Step 1: Go to Render Dashboard**
1. Login to: https://dashboard.render.com
2. Select your service: `alumni-connect-backend-g28e`
3. Click "Environment" tab

### **Step 2: Add Variables**
1. Click "Add Environment Variable"
2. Enter Key (e.g., `EMAIL_USER`)
3. Enter Value (e.g., `alumniconnect.acebitsindri@gmail.com`)
4. Click "Save"

### **Step 3: Add All Variables**
Copy all variables from above sections and add them one by one.

### **Step 4: Save and Redeploy**
1. After adding all variables, click "Save Changes"
2. Render will automatically redeploy your service
3. Wait for deployment to complete (~5-10 minutes)

---

## 🔐 Important Security Notes

### **For FIREBASE_SERVICE_ACCOUNT_KEY:**

**Option 1: Environment Variable (Simpler)**
- Copy the entire JSON as single line (as shown above)
- Paste in Render environment variable
- Variable name: `FIREBASE_SERVICE_ACCOUNT_KEY`

**Option 2: Secret File (More Secure)**
1. Go to Render Dashboard → Your Service
2. Click "Secret Files"
3. Click "Add Secret File"
4. Filename: `firebase-service-account.json`
5. Contents: Paste formatted JSON
6. Update code to read from file path

### **Email Password:**
- Remove all spaces from app password
- Original: `jiks efmh oyaf gifv`
- In Render: `jiksefmhoyafgifv`

---

## ✅ Verification Checklist

After adding all variables:

- [ ] All environment variables added
- [ ] EMAIL_PASSWORD has no spaces
- [ ] CORS_ORIGIN includes your frontend domain
- [ ] FRONTEND_URL is correct
- [ ] FIREBASE_SERVICE_ACCOUNT_KEY is valid JSON
- [ ] VITE_FIREBASE_VAPID_KEY is added (frontend)
- [ ] Service redeployed successfully
- [ ] Test signup/login works
- [ ] Test email sending works
- [ ] Test push notifications work

---

## 🧪 Testing After Deployment

### **1. Test Backend Health**
```bash
curl https://alumni-connect-backend-g28e.onrender.com/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "...",
  "environment": "production"
}
```

### **2. Test CORS**
Open your frontend: https://alumniconnect.acebits.in
Try to signup/login - Should work without CORS errors!

### **3. Test Email**
1. Register a new user
2. Check email at: alumniconnect.acebitsindri@gmail.com
3. You should receive verification email

### **4. Test Notifications**
1. Login to app
2. Allow notifications
3. Like a post or send connection request
4. Check if notification is received

---

## 🔍 Troubleshooting

### **Issue: CORS Error Still Appearing**
**Solution:**
1. Check if `CORS_ORIGIN` includes: `https://alumniconnect.acebits.in`
2. Check if `FRONTEND_URL` is: `https://alumniconnect.acebits.in`
3. Redeploy backend after changing variables

### **Issue: Emails Not Sending**
**Solution:**
1. Check `EMAIL_PASSWORD` has no spaces: `jiksefmhoyafgifv`
2. Check `EMAIL_USER` is: `alumniconnect.acebitsindri@gmail.com`
3. Check Render logs for email errors

### **Issue: Firebase Admin SDK Error**
**Solution:**
1. Check `FIREBASE_SERVICE_ACCOUNT_KEY` is valid JSON
2. Make sure JSON is single line (no line breaks)
3. Or use Secret File method instead

### **Issue: Push Notifications Not Working**
**Solution:**
1. Check frontend has `VITE_FIREBASE_VAPID_KEY`
2. Value should be: `BAiQKNgVJyUu7SUnijrDcYzO7TFLDmXm9RWHCOCcYPh9UG962_cPcDunUlw2nk8a6ebUww3kV-NSB0yf9sgbvgc`
3. Rebuild frontend after adding variable

---

## 📝 Quick Copy-Paste Format

**For Render Backend (Copy all at once):**

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://acebitsindridhanbad_db_user:Kamlesh%40%232005@cluster0.atc0s8x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=ALUMNI-CONNECT
JWT_SECRET=ace_bit_sindri_alumni_connect_secret_key_2024
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=ace_bit_sindri_refresh_token_secret_2024
JWT_REFRESH_EXPIRE=30d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=alumniconnect.acebitsindri@gmail.com
EMAIL_PASSWORD=jiksefmhoyafgifv
EMAIL_FROM=Alumni Connect - BIT Sindri <alumniconnect.acebitsindri@gmail.com>
CLOUDINARY_CLOUD_NAME=dethhxmyj
CLOUDINARY_API_KEY=628492318989999
CLOUDINARY_API_SECRET=rOZytw-HqvuuJaYsE8yRzAXUjg8
FRONTEND_URL=https://alumniconnect.acebits.in
CORS_ORIGIN=https://alumniconnect.acebits.in,http://localhost:5173
FIREBASE_PROJECT_ID=alumni-connect-84d49
FIREBASE_STORAGE_BUCKET=alumni-connect-84d49.firebasestorage.app
FIREBASE_WEB_CLIENT_ID=697354232724-vsrvg6n5iul43clq98aguo5aieuejmac.apps.googleusercontent.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Note:** Add `FIREBASE_SERVICE_ACCOUNT_KEY` separately (too long)

---

## 🎯 Summary

### **Backend (Render) - Total Variables: 21**
- ✅ Server config (2)
- ✅ MongoDB (2)
- ✅ JWT (4)
- ✅ Email (4) ← Fixed CORS issue
- ✅ Cloudinary (3)
- ✅ Frontend URL (2) ← Fixed CORS issue
- ✅ Firebase (4)
- ✅ Rate Limiting (2)

### **Frontend (Vercel/Netlify) - Total Variables: 13**
- ✅ API URLs (2)
- ✅ Firebase Config (9)
- ✅ VAPID Key (1) ← For push notifications
- ✅ Cloudinary (1)
- ✅ ACE Website (1)

---

## ✨ After Setup

Once all variables are added and service is redeployed:

1. ✅ CORS error will be fixed
2. ✅ Email notifications will work
3. ✅ Push notifications will work
4. ✅ Firebase storage will work
5. ✅ All features will be operational

---

**Backend URL:** https://alumni-connect-backend-g28e.onrender.com
**Frontend URL:** https://alumniconnect.acebits.in

**Made with ❤️ for BIT Sindri Alumni Connect**
