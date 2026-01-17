# Admin Panel Access Guide 🚀

## Overview
Admin panel banaya gaya hai jo Email Campaigns manage karne ke liye hai. Yahaan se aap students aur alumni ko bulk emails send kar sakte ho.

---

## 1. Admin Panel Features ✨

### A. Email Campaign Types
1. **Welcome Email** - New users ko welcome karne ke liye
2. **Event Announcement** - Events ke details share karne ke liye
3. **Custom Message** - Koi bhi custom announcement

### B. Recipient Filtering
- **Role**: Student / Alumni / All Users
- **Batch**: Specific batch select kar sakte ho
- **Department**: Department-wise filtering

### C. Stats Dashboard
- Total Users count
- Students count
- Alumni count
- Available Batches
- Departments list

---

## 2. Admin User Kaise Banaye? 🔧

### Method 1: Database se Directly (Recommended)

#### MongoDB Compass Use Karke:
```javascript
// Step 1: MongoDB Compass open karo
// Step 2: ALUMNI-CONNECT database select karo
// Step 3: 'alumni' ya 'student_data' collection me jao
// Step 4: Apne user ko find karo (email se)
// Step 5: Edit karo aur 'role' field me 'admin' add karo

// Example Update Query (MongoDB Compass me):
{
  "email": "your-email@example.com"
}

// Update with:
{
  "$set": {
    "role": "admin"
  }
}
```

#### MongoDB Shell Use Karke:
```javascript
// Terminal me ye command run karo:
mongosh "YOUR_MONGODB_URI"

// Phir ye queries run karo:
use ALUMNI-CONNECT

// Alumni collection me update:
db.alumni.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

// Ya student_data collection me:
db.student_data.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Method 2: Backend Script (Already Created)

```bash
# Terminal me backend folder me jao
cd backend

# Script run karo
node scripts/make-admin.js your-email@example.com
```

**Note**: Ye script abhi create nahi kiya hai. Agar chahiye to bata do!

---

## 3. Admin Panel Kaise Access Karein? 🎯

### A. Development Environment (localhost)

1. **Login karo** apne admin credentials se
2. **Navbar me Mail icon** dikhai dega (only admin users ko)
3. **Mail icon pe click karo**
4. Admin panel khul jayega!

**Direct URL**: `http://localhost:5173/admin/email-campaigns`

### B. Production Environment

1. **Login karo**: https://alumniconnect.acebits.in/login
2. **Navbar me Mail icon** dikhai dega
3. **Click karo** admin panel access karne ke liye

**Direct URL**: `https://alumniconnect.acebits.in/admin/email-campaigns`

---

## 4. Admin Panel Use Kaise Karein? 📧

### Step-by-Step Guide:

#### Welcome Email Bhejne Ke Liye:
1. **"Welcome Email" tab** select karo
2. **Filters set karo**: Role, Batch, Department
3. **Recipient count** check karo
4. **"Send Welcome Emails" button** pe click karo
5. Confirmation dialog me **"OK"** karo
6. Success toast notification aayega

#### Event Announcement Ke Liye:
1. **"Event Announcement" tab** select karo
2. **Event details fill karo**:
   - Event Title (Required)
   - Event Date (Required)
   - Event Time
   - Venue
   - Event Type
   - Organizer
   - Registration Deadline
   - Description
   - Custom Message
   - Event URL
   - Button Text (CTA)
3. **Filters set karo**
4. **"Send Event Emails" button** pe click karo
5. Confirm karo

#### Custom Message Ke Liye:
1. **"Custom Message" tab** select karo
2. **Form fill karo**:
   - Email Subject
   - Title (Required)
   - Badge (Optional - "NEW", "URGENT", etc.)
   - Header Style (Info/Success/Warning)
   - Opening Message
   - Main Message (Required)
   - Closing Message
   - Button Text & URL (Optional)
   - Additional Note
3. **Filters set karo**
4. **"Send Custom Emails" button** pe click karo
5. Confirm karo

---

## 5. Important Notes ⚠️

### Security:
- ✅ **Only admin users** can access email campaigns
- ✅ **Backend verification** - Even agar koi direct URL access kare, backend check karega admin hai ya nahi
- ✅ **Confirmation dialogs** - Accidental sends avoid karne ke liye

### Email Sending:
- 📧 **Bulk emails** - Multiple users ko ek saath
- ⏱️ **Rate limiting** - Too many emails ek saath nahi jayenge
- 📊 **Success/Failure tracking** - Kitne send hue, kitne fail hue
- 🔔 **Toast notifications** - Real-time feedback

### Filters:
- 🎯 **Precision targeting** - Exactly right audience ko select karo
- 📊 **Live recipient count** - Filters change karne pe count update hota hai
- 🔍 **Combine filters** - Multiple filters ek saath use kar sakte ho

---

## 6. Testing Admin Panel 🧪

### Test Karne Ke Liye:

1. **Admin user banao** (Method 1 ya 2 use karke)
2. **Logout karo** agar logged in ho
3. **Login karo** admin credentials se
4. **Navbar check karo** - Mail icon dikhaai dena chahiye
5. **Mail icon pe click karo** - Admin panel open hona chahiye
6. **Stats check karo** - Numbers correct hone chahiye
7. **Filters test karo** - Recipient count change hona chahiye
8. **Test email bhejo** - Apne email pe bhejo first

### Debugging:
```javascript
// Browser console me check karo:
localStorage.getItem('user') // Admin role hona chahiye

// Expected output:
{
  "_id": "...",
  "email": "...",
  "role": "admin",  // ← Ye 'admin' hona chahiye
  ...
}
```

---

## 7. Troubleshooting 🔧

### Problem: Mail icon navbar me nahi dikh raha
**Solution**:
- Logout karo
- Database me role 'admin' set hai ya nahi check karo
- Phir se login karo
- Browser cache clear karo

### Problem: "Admin access required" error
**Solution**:
- Backend restart karo: `cd backend && npm start`
- Frontend restart karo: `cd frontend && npm run dev`
- Token refresh karo (logout → login)

### Problem: Recipient count 0 dikha raha hai
**Solution**:
- Backend API check karo: `curl http://localhost:5000/api/email-campaigns/stats`
- Database me users hai ya nahi verify karo
- Network tab me API response check karo

### Problem: Email send nahi ho raha
**Solution**:
- `.env` file me email credentials check karo
- Gmail SMTP settings verify karo
- Backend logs dekho errors ke liye
- Test email apne account pe bhejo

---

## 8. Email Templates Preview 📨

### Welcome Email:
- ✅ Professional header with logo
- ✅ Welcome message
- ✅ Platform features overview
- ✅ CTA button: "Explore Dashboard"
- ✅ Footer with social links

### Event Announcement:
- ✅ Event details in structured format
- ✅ Custom message support
- ✅ Registration deadline highlight
- ✅ CTA button: "Register Now" (customizable)
- ✅ Calendar-friendly format

### Custom Message:
- ✅ Fully customizable
- ✅ Badge support (NEW, URGENT, UPDATE)
- ✅ Header color themes (Blue/Green/Yellow)
- ✅ Pre/Main/Post message sections
- ✅ Optional CTA button

---

## 9. Admin Panel URL Summary 📍

### Development:
```
Frontend: http://localhost:5173/admin/email-campaigns
Backend:  http://localhost:5000/api/email-campaigns
```

### Production:
```
Frontend: https://alumniconnect.acebits.in/admin/email-campaigns
Backend:  https://alumniconnect.onrender.com/api/email-campaigns
```

---

## 10. Next Steps After Setup ✅

1. ✅ **Admin user create karo** - Database me role update karo
2. ✅ **Login karo** - Admin credentials se
3. ✅ **Mail icon verify karo** - Navbar me dikhna chahiye
4. ✅ **Admin panel open karo** - Click on Mail icon
5. ✅ **Test email bhejo** - Apne email pe test karo
6. ✅ **Production pe deploy karo** - Git push (auto-deploy)
7. ✅ **Production me test karo** - Live URL pe verify karo

---

## Support 💬

Agar koi problem aaye ya doubt ho, toh:
1. Browser console check karo (F12)
2. Network tab me API calls dekho
3. Backend logs check karo (`npm start` terminal me)
4. MongoDB me data verify karo

**Happy Email Campaigning! 🎉**

---

**Created by**: Claude Code
**Date**: January 2026
**Version**: 1.0
