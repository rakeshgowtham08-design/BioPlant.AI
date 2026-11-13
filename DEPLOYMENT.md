# 🚀 BioPlant.AI - Deployment Guide

This guide provides multiple options to deploy BioPlant.AI to a live server.

---

## 📦 Prerequisites

1. Production build is ready in the `dist/` folder
2. All configuration files are created (vercel.json, netlify.toml, render.yaml)

---

## 🌐 Deployment Options

### **Option 1: Vercel (Recommended - Fastest)**

Vercel offers the easiest deployment with automatic HTTPS and global CDN.

#### **Method A: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# Deploy to production
vercel --prod
```

#### **Method B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub, GitLab, or Bitbucket
3. Click "Add New Project"
4. Import your repository OR drag & drop the project folder
5. Vercel auto-detects Vite configuration
6. Click "Deploy"
7. Your site will be live at: `https://bioplant-ai.vercel.app`

**Vercel Configuration:**
- Build Command: `npm run build` (auto-detected)
- Output Directory: `dist` (auto-detected)
- Framework: Vite (auto-detected)

---

### **Option 2: Netlify**

#### **Method A: Netlify CLI**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy to draft URL
netlify deploy

# Deploy to production
netlify deploy --prod
```

#### **Method B: Netlify Drop (Drag & Drop)**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag and drop the entire `dist/` folder
3. Instant deployment at a random URL
4. Optional: Claim the site and customize the domain

#### **Method C: Netlify Dashboard**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Click "Add new site" → "Import an existing project"
4. Connect your Git repository
5. Build settings (auto-filled from netlify.toml):
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"
7. Your site will be live at: `https://[random-name].netlify.app`

---

### **Option 3: Render**

1. Go to [render.com](https://render.com)
2. Sign up/Login
3. Click "New +" → "Static Site"
4. Connect your Git repository
5. Configure:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
6. Click "Create Static Site"
7. Your site will be live at: `https://bioplant-ai.onrender.com`

---

### **Option 4: GitHub Pages**

#### **Setup GitHub Pages Deployment**

1. **Install gh-pages package:**
```bash
npm install --save-dev gh-pages
```

2. **Add deployment scripts to package.json:**
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.ts with base path:**
```typescript
export default defineConfig({
  base: '/bioplant-ai/', // Replace with your repo name
  plugins: [react()]
})
```

4. **Deploy:**
```bash
npm run deploy
```

5. **Enable GitHub Pages:**
   - Go to your GitHub repository
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` → `/root` → Save
   - Your site will be live at: `https://[username].github.io/[repo-name]/`

---

### **Option 5: Firebase Hosting**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize Firebase
firebase init hosting

# Configure:
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds: No

# Deploy
firebase deploy
```

Your site will be live at: `https://[project-id].web.app`

---

### **Option 6: Cloudflare Pages**

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up/Login
3. Go to "Workers & Pages" → "Create application" → "Pages"
4. Connect your Git repository
5. Configure:
   - Build command: `npm run build`
   - Build output directory: `dist`
6. Click "Save and Deploy"
7. Your site will be live at: `https://bioplant-ai.pages.dev`

---

### **Option 7: AWS S3 + CloudFront**

```bash
# Build the app
npm run build

# Install AWS CLI
# Follow: https://aws.amazon.com/cli/

# Create S3 bucket
aws s3 mb s3://bioplant-ai

# Enable static website hosting
aws s3 website s3://bioplant-ai --index-document index.html --error-document index.html

# Upload files
aws s3 sync dist/ s3://bioplant-ai --acl public-read

# Your site: http://bioplant-ai.s3-website-[region].amazonaws.com
```

---

### **Option 8: Simple HTTP Server (For Testing)**

#### **Using Python:**
```bash
cd dist
python -m http.server 8080
# Access at: http://localhost:8080
```

#### **Using Node.js (serve):**
```bash
npm install -g serve
serve -s dist -p 8080
# Access at: http://localhost:8080
```

#### **Using npx (no install):**
```bash
npx serve -s dist -p 8080
```

---

## 🔒 Environment Variables (Optional)

If you want to use Supabase (optional - app works without it):

### **For Vercel:**
Dashboard → Project Settings → Environment Variables:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **For Netlify:**
Dashboard → Site Settings → Build & Deploy → Environment:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### **For Local .env file:**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

---

## ✅ Post-Deployment Checklist

- [ ] Site loads successfully
- [ ] All 6 navigation tabs work (Overview, Diagnostics, Crop Scan, AI Insights, Marketplace, Customers)
- [ ] ML predictions work in Diagnostics → AI Insights
- [ ] Weather forecast displays correctly
- [ ] Marketplace deals can be created
- [ ] Customer portal functions properly
- [ ] No console errors
- [ ] Mobile responsive design works
- [ ] HTTPS enabled (automatic on most platforms)

---

## 🎯 Quick Start (Fastest Method)

**For immediate deployment:**

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod

# That's it! Your site is live in ~60 seconds
```

---

## 🌍 Custom Domain (Optional)

After deployment, you can add a custom domain:

- **Vercel:** Dashboard → Project → Settings → Domains
- **Netlify:** Dashboard → Domain Settings → Add custom domain
- **Cloudflare Pages:** Dashboard → Custom domains → Set up a domain

---

## 📊 Performance Optimization

All platforms automatically provide:
- ✅ Global CDN
- ✅ Automatic HTTPS/SSL
- ✅ Gzip/Brotli compression
- ✅ HTTP/2 support
- ✅ Edge caching
- ✅ DDoS protection

---

## 🆘 Troubleshooting

**Issue:** Blank page after deployment
- **Fix:** Check if `base` path in vite.config.ts matches deployment path

**Issue:** 404 on page refresh
- **Fix:** Ensure SPA redirect rules are configured (already done in config files)

**Issue:** Build fails
- **Fix:** Run `npm run build` locally to see errors first

**Issue:** Environment variables not working
- **Fix:** Ensure variables start with `VITE_` prefix

---

## 📞 Support

- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Render: [render.com/docs](https://render.com/docs)

---

## 🎉 Success!

Your BioPlant.AI application is now live and accessible worldwide!

**Share your deployment URL with:**
- Agricultural scientists
- Farm managers
- Agronomists
- Agricultural technology enthusiasts
