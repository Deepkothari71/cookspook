# Deployment Guide - Lightweight Backend

This guide covers deploying your lightweight backend on various cloud platforms.

## 🚀 Quick Deploy Options

### Option 1: Railway (Recommended - Easiest)
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Python and deploy
6. Get your deployment URL from the project dashboard

### Option 2: Render
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Set build command: `pip install -r requirements.txt`
6. Set start command: `gunicorn app:app`
7. Deploy and get your URL

### Option 3: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. In your backend directory: `vercel`
3. Follow prompts to deploy
4. Get your deployment URL

## 🔧 Manual Deployment Steps

### 1. Prepare Your Repository
```bash
# Make sure these files are in your backend directory:
# - app.py
# - extractor.py  
# - requirements.txt
# - Procfile
# - runtime.txt
```

### 2. Test Locally First
```bash
cd "backend 1"
pip install -r requirements.txt
python app.py
```

### 3. Update Frontend Backend URL
In your frontend, change the backend URL from:
```javascript
// Old (local)
const response = await fetch('http://localhost:5000/analyze', {

// New (deployed)
const response = await fetch('https://your-backend-url.railway.app/analyze', {
```

## 🌐 Environment Variables

Set these in your deployment platform if needed:

- `VERCEL_FRONTEND_URL`: Your frontend URL for CORS
- `PORT`: Port number (usually auto-set by platform)

## 📊 Performance Comparison

| Metric | Original Backend | Lightweight Backend |
|--------|------------------|---------------------|
| **Deployment Time** | 10-15 minutes | 2-3 minutes |
| **Cold Start** | 30-60 seconds | 5-10 seconds |
| **Memory Usage** | 600MB+ | ~50MB |
| **Dependencies** | 8 heavy packages | 7 lightweight packages |
| **Model Loading** | 500MB+ model | No model loading |

## ✅ Post-Deployment Checklist

- [ ] Backend is accessible at your deployment URL
- [ ] `/health` endpoint returns success
- [ ] Frontend can connect to new backend URL
- [ ] Cookie scanning works as expected
- [ ] Results are being saved correctly

## 🐛 Troubleshooting

### Common Issues:

1. **Import Errors**: Make sure all files are in the same directory
2. **Port Issues**: Most platforms auto-set PORT environment variable
3. **CORS Errors**: Check that frontend URL is in CORS origins
4. **Memory Limits**: Lightweight backend should work on all platforms

### Debug Commands:
```bash
# Check if backend is running
curl https://your-backend-url.railway.app/health

# Test the analyze endpoint
curl -X POST https://your-backend-url.railway.app/analyze \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 🔄 Updating After Changes

1. Push changes to GitHub
2. Most platforms auto-deploy on push
3. Check deployment logs for any errors
4. Test the updated functionality

## 📱 Frontend Integration

Your frontend will work **immediately** after changing the backend URL. No other changes needed!

The API contract is identical to the original backend. 