# BioPlant.AI - Render Deployment Guide

## 🚀 Quick Start Deployment

### **1. Update render.yaml with Your Supabase Credentials**

Edit `render.yaml` and replace:
- `YOUR_SUPABASE_URL_HERE` → `https://rysmaaqxcwrrthasvcvh.supabase.co`
- `YOUR_SUPABASE_ANON_KEY_HERE` → Your anon key
- `YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE` → Your service_role key

### **2. Deploy on Render**
1. Go to [render.com](https://render.com)
2. Click "New +" → "Blueprint"
3. Connect GitHub repository: `rakeshgowtham08-design/BioPlant.AI`
4. Click "Apply"

### **3. Monitor Deployment**
- Backend: `bioplant-ai-backend` (Python FastAPI)
- Frontend: `bioplant-ai-frontend` (React Static)

## 🔧 Environment Variables

### **After Deployment - Update in Render Dashboard:**

**Backend Service:**
```
SUPABASE_URL: https://rysmaaqxcwrrthasvcvh.supabase.co
SUPABASE_SERVICE_ROLE_KEY: your-service-role-key
FRONTEND_URL: https://bioplant-ai-frontend.onrender.com
```

**Frontend Service:**
```
VITE_API_URL: https://bioplant-ai-backend.onrender.com
VITE_SUPABASE_URL: https://rysmaaqxcwrrthasvcvh.supabase.co
VITE_SUPABASE_ANON_KEY: your-anon-key
```

## 📊 Project Structure

```
BioPlant.AI/
├── render.yaml           # Render Blueprint configuration
├── package.json          # Frontend dependencies
├── backend/
│   ├── main.py          # FastAPI backend
│   └── requirements.txt  # Python dependencies
├── src/
│   ├── App.tsx          # React main component
│   ├── services/
│   │   ├── apiService.ts # API calls to backend
│   │   └── supabaseService.ts # Supabase client
│   └── ml/              # Machine Learning engine
└── dist/                # Production build output
```

## ✅ Verification Tests

### **Backend Tests:**
```bash
# Test health endpoint
curl https://bioplant-ai-backend.onrender.com/health

# Test crop prediction
curl -X POST https://bioplant-ai-backend.onrender.com/api/predict \
  -H "Content-Type: application/json" \
  -d '{"nitrogen":85,"phosphorus":48,"potassium":42,"ph":6.5,"temperature":24.8,"humidity":78,"rainfall":185}'
```

### **Frontend Tests:**
1. Open: https://bioplant-ai-frontend.onrender.com
2. Navigate through all 6 screens
3. Test crop prediction
4. Test creating marketplace deals

## 🐛 Troubleshooting

### **Common Issues:**

1. **Build Fails:**
   - Check Render logs for error messages
   - Verify Python dependencies in requirements.txt
   - Check npm packages in package.json

2. **CORS Errors:**
   - Ensure FRONTEND_URL is set correctly in backend
   - Check CORS origins in backend/main.py

3. **Database Connection:**
   - Verify Supabase credentials
   - Check if tables exist in Supabase
   - Run schema.sql in Supabase SQL Editor

4. **Blank Frontend:**
   - Check browser console for errors
   - Verify VITE_API_URL is correct
   - Check if backend is running

## 🛠️ Files Modified for Deployment

### **1. render.yaml**
- Fixed: Changed `type: static` → `type: web` with `runtime: static`
- Fixed: Removed unsupported `fromService` properties
- Fixed: Corrected YAML structure for Render Blueprint
- Fixed: Added proper environment variable placeholders

### **2. Backend (main.py)**
- ✅ FastAPI app with CORS configuration
- ✅ Health endpoint at `/health`
- ✅ Supabase integration
- ✅ All API endpoints working

### **3. Frontend (apiService.ts)**
- ✅ API service for backend communication
- ✅ Uses VITE_API_URL environment variable
- ✅ Error handling for failed connections

## 🎯 Deployment URLs

Once deployed:
- **Frontend:** https://bioplant-ai-frontend.onrender.com
- **Backend:** https://bioplant-ai-backend.onrender.com
- **API Docs:** https://bioplant-ai-backend.onrender.com/docs

## 📞 Support

- **Render Docs:** https://docs.render.com
- **Supabase Docs:** https://supabase.com/docs
- **GitHub Repo:** https://github.com/rakeshgowtham08-design/BioPlant.AI

Your BioPlant.AI is ready for deployment! 🚀
