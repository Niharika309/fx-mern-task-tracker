# 🚀 Complete Vercel Deployment Guide - MERN Task Tracker

## 📋 **Prerequisites**
- Vercel account (free at vercel.com)
- MongoDB Atlas account (free at mongodb.com/atlas)
- Your project running locally (✅ Already done)

---

## 🗄️ **Step 1: Set Up MongoDB Atlas (Required)**

### **1.1 Create MongoDB Atlas Account**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free"
3. Sign up with email or Google
4. Create a new project

### **1.2 Create Database Cluster**
1. Click "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a region close to you
4. Click "Create Cluster"

### **1.3 Configure Database Access**
1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username: `mernuser`
5. Create password: `mernpassword123`
6. Set privileges to "Read and write to any database"
7. Click "Add User"

### **1.4 Configure Network Access**
1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### **1.5 Get Connection String**
1. Go to "Database" in left menu
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password

**Example Connection String:**
```
mongodb+srv://mernuser:mernpassword123@cluster0.xxxxx.mongodb.net/task_tracker?retryWrites=true&w=majority
```

---

## 🚀 **Step 2: Deploy Backend to Vercel**

### **2.1 Install Vercel CLI**
```bash
npm install -g vercel
```

### **2.2 Login to Vercel**
```bash
vercel login
```
- Choose your preferred login method (GitHub, GitLab, Bitbucket, or Email)
- Follow the authentication process

### **2.3 Deploy Backend**
```bash
# From your project root directory
cd /Users/abhaykumarverma/Documents/projects/fx-mern-task-tracker
vercel
```

**Follow the prompts:**
- Set up and deploy? **Y**
- Which scope? (your account)
- Link to existing project? **N**
- Project name: **mern-task-tracker-backend**
- Directory: **./** (current directory)
- Override settings? **N**

### **2.4 Set Environment Variables**
After deployment, set these environment variables:

```bash
# Set MongoDB connection
vercel env add MONGODB_URI
# Enter your MongoDB Atlas connection string

# Set JWT secret
vercel env add JWT_SECRET
# Enter: your_super_secret_jwt_key_here_12345

# Set environment
vercel env add NODE_ENV
# Enter: production
```

### **2.5 Redeploy with Environment Variables**
```bash
vercel --prod
```

**Note your backend URL** (e.g., `https://mern-task-tracker-backend.vercel.app`)

---

## 🎨 **Step 3: Deploy Frontend to Vercel**

### **3.1 Build Frontend**
```bash
cd client
npm run build
```

### **3.2 Create Frontend Vercel Config**
Create `client/vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "build/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/build/$1"
    }
  ]
}
```

### **3.3 Deploy Frontend**
```bash
cd client
vercel
```

**Follow the prompts:**
- Set up and deploy? **Y**
- Which scope? (your account)
- Link to existing project? **N**
- Project name: **mern-task-tracker-frontend**
- Directory: **./** (current directory)
- Override settings? **N**

### **3.4 Set Frontend Environment Variables**
```bash
# Set backend API URL
vercel env add REACT_APP_API_URL
# Enter: https://mern-task-tracker-backend.vercel.app
```

### **3.5 Redeploy Frontend**
```bash
vercel --prod
```

**Note your frontend URL** (e.g., `https://mern-task-tracker-frontend.vercel.app`)

---

## 🔧 **Step 4: Update Frontend API Configuration**

### **4.1 Update Axios Base URL**
Edit `client/src/contexts/AuthContext.js`:

```javascript
// Add this at the top
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Update all axios calls
const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
```

### **4.2 Update All API Calls**
Search and replace in your frontend files:
- `axios.post('/api/auth/login'` → `axios.post(`${API_BASE_URL}/api/auth/login'`
- `axios.get('/api/tasks'` → `axios.get(`${API_BASE_URL}/api/tasks'`
- `axios.post('/api/tasks'` → `axios.post(`${API_BASE_URL}/api/tasks'`
- etc.

### **4.3 Redeploy Frontend**
```bash
cd client
vercel --prod
```

---

## 🧪 **Step 5: Test Your Deployment**

### **5.1 Test Backend API**
```bash
# Test health endpoint
curl https://your-backend-domain.vercel.app/api/health

# Test authentication
curl -X POST https://your-backend-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### **5.2 Test Frontend**
1. Open your frontend URL
2. Try logging in with demo accounts
3. Test creating tasks
4. Test employee functionality

---

## 🎯 **Step 6: Seed Production Database**

### **6.1 Create Production Seed Script**
```bash
# Run this locally with production MongoDB URI
cd server
MONGODB_URI=your_production_mongodb_uri npm run seed
```

### **6.2 Or Use MongoDB Atlas Interface**
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Manually add users and tasks

---

## 🔍 **Troubleshooting**

### **Common Issues:**

**1. CORS Errors**
- Check REACT_APP_API_URL environment variable
- Ensure CORS is configured in backend

**2. Database Connection Issues**
- Verify MongoDB Atlas network access (0.0.0.0/0)
- Check connection string format
- Ensure database user has proper permissions

**3. Environment Variables Not Working**
- Redeploy after adding environment variables
- Check variable names are correct
- Verify in Vercel dashboard

**4. Frontend Can't Connect to Backend**
- Check REACT_APP_API_URL is set correctly
- Verify backend is deployed and working
- Check browser console for errors

---

## 📊 **Final URLs**

After deployment, you'll have:
- **Backend API**: `https://mern-task-tracker-backend.vercel.app`
- **Frontend**: `https://mern-task-tracker-frontend.vercel.app`

---

## 🎉 **Success!**

Your MERN Task Tracker is now deployed and accessible worldwide! 🌍

### **Demo Accounts:**
- **Admin**: admin@example.com / admin123
- **Employee**: john@example.com / emp123

### **Features Available:**
- ✅ User authentication
- ✅ Task management
- ✅ Employee management
- ✅ Role-based access control
- ✅ Real-time updates

