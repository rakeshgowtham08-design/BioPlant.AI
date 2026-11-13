# BioPlant.AI - Deployment Checklist

## ✅ **COMPLETED**

### **Backend (FastAPI)**
- [x] FastAPI app structure fixed
- [x] Supabase integration for database operations
- [x] All required endpoints implemented:
  - `GET /health` - Health check
  - `POST /api/predict` - Crop prediction
  - `GET /api/marketplace/deals` - Get deals
  - `POST /api/marketplace/deals` - Create deal
  - `GET /api/customers` - Get customers
  - `POST /api/customers` - Create customer
- [x] Production CORS configuration
- [x] Environment variables for Supabase
- [x] `requirements.txt` updated with all dependencies
- [x] Health check endpoint added

### **Frontend (React + Vite)**
- [x] Production build working
- [x] API service created for backend communication
- [x] Environment variables configured
- [x] Error boundary added
- [x] `package.json` build scripts working

### **Database (Supabase PostgreSQL)**
- [x] Database schema defined in `supabase/schema.sql`
- [x] Tables: `marketplace_deals` and `customer_records`
- [x] Indexes for performance
- [x] Row Level Security (RLS) policies
- [x] Seed data for initial deployment

### **Deployment Configuration**
- [x] `render.yaml` configured for both services
- [x] `.env.example` with all required variables
- [x] `.gitignore` excludes sensitive files
- [x] GitHub repository created and pushed

## 🚀 **DEPLOYMENT STEPS**

### **Step 1: Set Up Supabase**
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Get your project credentials:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anonymous Key (for frontend)
   - Service Role Key (for backend - keep secret!)

### **Step 2: Deploy Backend on Render**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select the `render.yaml` file
5. Configure environment variables:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   FRONTEND_URL=will-be-auto-set
   ```
6. Deploy the backend service
7. Get your backend URL (e.g., `https://bioplant-ai-backend.onrender.com`)

### **Step 3: Deploy Frontend on Render**
1. The frontend will deploy automatically after backend (configured in `render.yaml`)
2. Configure frontend environment variables:
   ```
   VITE_API_URL=https://bioplant-ai-backend.onrender.com
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
3. Get your frontend URL (e.g., `https://bioplant-ai-frontend.onrender.com`)

### **Step 4: Configure Supabase Database**
1. Go to your Supabase project SQL Editor
2. Copy and run the SQL from `supabase/schema.sql`
3. Verify tables are created in the Table Editor
4. Test data insertion

## 🔧 **ENVIRONMENT VARIABLES**

### **For Backend (Render)**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=https://bioplant-ai-frontend.onrender.com
```

### **For Frontend (Render)**
```bash
VITE_API_URL=https://bioplant-ai-backend.onrender.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 🧪 **TESTING**

### **Backend Tests**
```bash
# Test health endpoint
curl https://bioplant-ai-backend.onrender.com/health

# Test crop prediction
curl -X POST https://bioplant-ai-backend.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "nitrogen": 85,
    "phosphorus": 48,
    "potassium": 42,
    "ph": 6.5,
    "temperature": 24.8,
    "humidity": 78,
    "rainfall": 185
  }'

# Test deals endpoint
curl https://bioplant-ai-backend.onrender.com/api/marketplace/deals
```

### **Frontend Tests**
1. Open frontend URL in browser
2. Verify all 6 screens load:
   - Overview/Dashboard
   - Diagnostics
   - Crop Scan
   - AI Insights
   - Marketplace
   - Customers
3. Test crop prediction
4. Test creating marketplace deals
5. Test adding customers

## 🐛 **TROUBLESHOOTING**

### **Backend Issues**
- **CORS errors**: Check FRONTEND_URL environment variable
- **Database errors**: Verify Supabase credentials and schema
- **Port issues**: Ensure Render sets $PORT variable

### **Frontend Issues**
- **Blank screen**: Check browser console for errors
- **API connection**: Verify VITE_API_URL is correct
- **Build errors**: Check TypeScript compilation

### **Database Issues**
- **Connection refused**: Check Supabase URL and keys
- **Missing tables**: Run schema.sql in Supabase SQL Editor
- **Permission denied**: Check RLS policies

## 📞 **SUPPORT**

- **Render Support**: [docs.render.com](https://docs.render.com)
- **Supabase Support**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Repository**: https://github.com/rakeshgowtham08-design/BioPlant.AI

## 🎯 **FINAL VERIFICATION**

1. ✅ Frontend loads without errors
2. ✅ Backend API responds to requests
3. ✅ Database operations work (create/read deals & customers)
4. ✅ CORS configured correctly
5. ✅ All environment variables set
6. ✅ Data persists after restart

Your BioPlant.AI application is now ready for production deployment! 🚀