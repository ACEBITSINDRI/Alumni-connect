# 🚀 Alumni Connect - Render Deployment Guide

## 📋 Prerequisites

- GitHub account with repository access
- Render account (free tier works)
- MongoDB Atlas account (for database)

---

## 🎯 Deployment Steps

### **Part 1: Backend Deployment (Web Service)**

#### 1. **Prepare MongoDB Atlas**
```
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create a database user
4. Whitelist all IPs: 0.0.0.0/0
5. Get connection string: mongodb+srv://username:password@cluster.mongodb.net/alumni-connect
```

#### 2. **Deploy Backend on Render**

**Option A: Using render.yaml (Recommended - Automatic)**
```
1. Go to https://render.com
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository: ACEBITSINDRI/Alumni-connect
4. Render will auto-detect render.yaml and create both services
5. Click "Apply" to deploy both frontend and backend together
```

**Option B: Manual Setup**
```
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select: ACEBITSINDRI/Alumni-connect
```

**Build Settings (Manual Setup):**
```yaml
Name: alumni-connect-backend
Root Directory: (leave empty)
Environment: Node
Region: Singapore (or closest)
Branch: main
Build Command: cd backend && npm install
Start Command: cd backend && npm start
Instance Type: Free
```

**Environment Variables (Add these):**
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/alumni-connect?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random_12345
JWT_EXPIRE=7d
CORS_ORIGIN=https://your-frontend-url.onrender.com
```

**Generate Strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### 3. **Click "Create Web Service"**
- Wait 5-10 minutes for deployment
- Copy the backend URL: `https://alumni-connect-backend.onrender.com`

---

### **Part 2: Frontend Deployment (Static Site)**

#### 1. **Update API URL in Frontend**

Before deploying, update the API URL in your frontend code:

The `frontend/src/config/api.ts` is already configured!

Update `frontend/.env.production` with your backend URL:
```
VITE_API_URL=https://alumni-connect-backend.onrender.com
```

#### 2. **Deploy Frontend on Render**

**Note:** If you used Blueprint (render.yaml), frontend is already deployed!

**Manual Setup (if not using Blueprint):**
```
1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect GitHub repository
4. Select: ACEBITSINDRI/Alumni-connect
```

**Build Settings (Manual):**
```yaml
Name: alumni-connect-frontend
Root Directory: (leave empty)
Branch: main
Build Command: cd frontend && npm install && npm run build
Publish Directory: frontend/dist
```

**Environment Variables:**
```
NODE_VERSION=18
VITE_API_URL=https://alumni-connect-backend.onrender.com
```

#### 3. **Configure Redirects for SPA**

Render automatically handles SPA routing, but verify in settings:
- Rewrite all routes to `/index.html`

#### 4. **Click "Create Static Site"**
- Wait 3-5 minutes for deployment
- Your frontend will be live at: `https://alumni-connect-frontend.onrender.com`

---

## 🔧 Post-Deployment Configuration

### **Update Backend CORS**

Update backend CORS_ORIGIN environment variable:
```
CORS_ORIGIN=https://alumni-connect-frontend.onrender.com
```

### **Custom Domain (Optional)**

**Frontend:**
```
1. Go to Static Site Settings
2. Click "Custom Domains"
3. Add your domain: alumniconnect.com
4. Update DNS records as instructed
```

**Backend:**
```
1. Go to Web Service Settings
2. Click "Custom Domains"
3. Add subdomain: api.alumniconnect.com
4. Update DNS records
```

---

## ⚡ Important Notes

### **Free Tier Limitations:**

**Backend (Web Service):**
- ❌ Spins down after 15 mins of inactivity
- ⏱️ First request after sleep: 30-50 seconds delay
- 💾 750 hours/month free
- 🔄 Automatic deploys on git push

**Frontend (Static Site):**
- ✅ Always active (no sleep)
- ✅ 100GB bandwidth/month
- ✅ Global CDN
- ✅ Free SSL certificate

### **Performance Tips:**

1. **Backend Keep-Alive:**
   - Use external services like UptimeRobot or Cron-job.org
   - Ping backend every 10 mins: `https://alumni-connect-backend.onrender.com/health`

2. **Build Optimization:**
   - Frontend build already optimized with Vite
   - Lazy loading implemented
   - Code splitting enabled

---

## 🔍 Health Check Endpoints

Add this to backend for monitoring:

`backend/src/routes/health.js`:
```javascript
import express from 'express';
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

export default router;
```

---

## 📊 Monitoring & Logs

**View Logs:**
```
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. Monitor real-time deployment and runtime logs
```

**Set up Alerts:**
```
1. Service Settings → Notifications
2. Enable email alerts for:
   - Deploy failures
   - Service crashes
   - High memory usage
```

---

## 🔄 Continuous Deployment

**Auto-deploy on Git Push:**
```bash
git add .
git commit -m "Update feature"
git push origin main
```

Render automatically:
1. Detects the push
2. Runs build commands
3. Deploys new version
4. Takes ~2-5 minutes

**Manual Deploy:**
```
1. Go to service dashboard
2. Click "Manual Deploy"
3. Select branch
4. Click "Deploy"
```

---

## 🐛 Troubleshooting

### **Backend Issues:**

**Service won't start:**
```
- Check logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct
- Check if PORT=10000 is set
```

**Database connection failed:**
```
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check database user credentials
- Ensure connection string format is correct
```

### **Frontend Issues:**

**Build fails:**
```
- Check if NODE_VERSION=18 is set
- Verify package.json scripts are correct
- Check for TypeScript errors locally first
```

**API calls fail:**
```
- Verify VITE_API_URL is correct
- Check CORS settings on backend
- Ensure backend is running
```

**Routes not working (404):**
```
- Verify Publish Directory is set to "dist"
- Check rewrite rules for SPA routing
```

---

## 📝 Environment Variables Checklist

### **Backend Required:**
- ✅ NODE_ENV=production
- ✅ PORT=10000
- ✅ MONGODB_URI=mongodb+srv://...
- ✅ JWT_SECRET=random_secret_key
- ✅ JWT_EXPIRE=7d
- ✅ CORS_ORIGIN=frontend_url

### **Frontend Required:**
- ✅ NODE_VERSION=18
- ✅ VITE_API_URL=backend_url

---

## 🎉 Success Checklist

- [ ] Backend deployed successfully
- [ ] Frontend deployed successfully
- [ ] Backend health check responding
- [ ] Frontend loads without errors
- [ ] API calls working from frontend
- [ ] Database connected successfully
- [ ] CORS configured properly
- [ ] Environment variables set
- [ ] Custom domains configured (optional)
- [ ] Monitoring/alerts set up

---

## 📞 Support

**Render Documentation:** https://render.com/docs
**MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/

**Common Issues:**
- Backend sleeping: Use keep-alive service
- Slow cold starts: Expected on free tier
- Build failures: Check logs carefully

---

## 🚀 Quick Deploy Commands

```bash
# After any code changes
git add .
git commit -m "Feature update"
git push origin main

# Render will auto-deploy both services
# Frontend: ~3-5 minutes
# Backend: ~5-10 minutes
```

**Live URLs:**
- Frontend: https://alumni-connect-frontend-n3ac.onrender.com
- Backend: https://alumni-connect-backend-g28e.onrender.com
- Health: https://alumni-connect-backend-g28e.onrender.com/health

---

**Deployment Date:** 2025-01-XX
**Version:** 1.0.0
**Deployed By:** ACE BIT Sindri Team
