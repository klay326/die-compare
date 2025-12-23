# Deployment Guide - Render

This guide will help you deploy Die Compare to Render's free tier.

## Prerequisites

1. GitHub account (push your code there)
2. Render account (free at https://render.com)

## Step 1: Push to GitHub

```bash
cd ~/Documents/Die\ Compare
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/die-compare.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy Backend to Render

1. Go to https://render.com and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Select the `die-compare` repository
5. Fill in the details:
   - **Name**: `die-compare-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: `Free`
6. Click "Create Web Service"
7. Wait for deployment (takes 2-3 minutes)
8. Copy your backend URL (e.g., `https://die-compare-api.onrender.com`)

## Step 3: Deploy Frontend to GitHub Pages

1. Update `frontend/vite.config.js`:
```javascript
export default {
  base: '/', // or '/die-compare' if using as a project site
  server: {
    proxy: {
      '/api': {
        target: 'https://die-compare-api.onrender.com',
        changeOrigin: true
      }
    }
  }
}
```

2. Create GitHub Actions workflow `.github/workflows/deploy.yml`:
```yaml
name: Deploy Frontend

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd frontend && npm install && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/dist
```

3. In GitHub repo Settings:
   - Go to "Pages"
   - Set Source to "GitHub Actions"

4. Push changes:
```bash
git add .
git commit -m "Add deployment config"
git push
```

## Step 4: Update Backend CORS for Frontend

1. Note your GitHub Pages URL (usually `https://YOUR_USERNAME.github.io/die-compare`)
2. Go to Render dashboard → Your service → "Environment"
3. Add environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://YOUR_USERNAME.github.io/die-compare`
4. Render will auto-redeploy

## Step 5: Configure Frontend API URL

Create `frontend/.env.production`:
```
VITE_API_URL=https://die-compare-api.onrender.com
```

Update `frontend/src/main.jsx` to use it:
```javascript
import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
axios.defaults.baseURL = apiUrl
```

## Testing

1. Frontend: Visit `https://YOUR_USERNAME.github.io/die-compare`
2. Backend: Visit `https://die-compare-api.onrender.com/docs` (API docs)
3. Try the import button to test backend connection

## Using Custom Domain (Optional)

Both Render and GitHub Pages support custom domains:

1. **For Render backend**:
   - Buy a domain (Namecheap, GoDaddy, etc.)
   - In Render settings, add custom domain
   - Update DNS records as instructed

2. **For GitHub Pages frontend**:
   - Create `CNAME` file in `frontend/public/` with your domain
   - Update DNS records

## Troubleshooting

- **CORS errors**: Make sure `FRONTEND_URL` env var is set correctly on Render
- **Blank frontend**: Check that `VITE_API_URL` is set and backend is running
- **Database not persisting**: Render's free tier uses ephemeral storage. Data resets on redeploy. For persistence, upgrade or use a database service.

## Notes

- Render free tier spins down after 15 minutes of inactivity (first request takes 30 seconds)
- Database is stored locally on the free tier (will reset on redeployment)
- For production, consider upgrading or adding a managed database
