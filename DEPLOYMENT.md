# Deployment Guide - PythonAnywhere

This guide will help you deploy Die Compare to PythonAnywhere (free tier available).

## Why PythonAnywhere?

- ✅ Designed for Python web apps (no version conflicts)
- ✅ Free tier is generous for side projects
- ✅ Super easy setup - just upload code
- ✅ Built-in database support
- ✅ Custom domain support
- ✅ No Docker, no build nightmares

## Prerequisites

1. GitHub account (your repo is already there)
2. PythonAnywhere account (free at https://www.pythonanywhere.com)
3. Custom domain (optional, but recommended)

## Step-by-Step Deployment

### Step 1: Sign Up for PythonAnywhere

1. Go to https://www.pythonanywhere.com
2. Click "Start running Python online"
3. Sign up with email (or GitHub login)
4. Choose the **Free** plan
5. Verify email and complete setup

### Step 2: Clone Your Repository

1. In PythonAnywhere, click on **"Consoles"** tab at the top
2. Start a **"Bash"** console
3. Clone your repo:

```bash
cd ~
git clone https://github.com/klay326/die-compare.git
cd die-compare
```

### Step 3: Set Up Python Virtual Environment

In the same bash console:

```bash
mkvirtualenv --python=/usr/bin/python3.9 diecompare
pip install -r backend/requirements.txt
cd frontend && npm install && npm run build
```

### Step 4: Create a Web App

1. Go to **"Web"** tab
2. Click **"Add a new web app"**
3. Choose **"Python 3.9"**
4. It will create a default app - we'll customize it

### Step 5: Configure WSGI File

1. Click on your web app in the "Web" tab
2. Under "Code" section, find **"WSGI configuration file"**
3. Click the path (e.g., `/var/www/yourusername_pythonanywhere_com_wsgi.py`)
4. Replace the entire content with:

```python
import sys
import os

# Add your project directory to the Python path
project_dir = os.path.expanduser('~/die-compare')
sys.path.insert(0, project_dir)

# Activate virtual environment
activate_this = os.path.expanduser('~/.virtualenvs/diecompare/bin/activate_this.py')
with open(activate_this) as f:
    exec(f.read(), {'__file__': activate_this})

# Import and run FastAPI app
from backend.main import app

# WSGI application
application = app
```

5. Click **"Save"**

### Step 6: Configure Static Files (Frontend)

Back in the **"Web"** tab, in the **"Static files"** section:

1. Click **"Add a new static files entry"**
2. Fill in:
   - **URL**: `/`
   - **Directory**: `/home/yourusername/die-compare/frontend/dist`
3. Click **"Add"**

### Step 7: Set Environment Variables

In the **"Web"** tab, scroll down to **"Environment variables"**:

1. Click **"Add a new variable"**
2. Add:
   - **Name**: `FRONTEND_URL`
   - **Value**: `https://yourusername.pythonanywhere.com`

### Step 8: Reload Web App

At the top of the **"Web"** tab, click the green **"Reload"** button.

Wait 10 seconds, then visit `https://yourusername.pythonanywhere.com` 🎉

## Testing

1. **Frontend loads**: Visit `https://yourusername.pythonanywhere.com`
2. **Backend works**: Visit `https://yourusername.pythonanywhere.com/docs` (should see API docs)
3. **Import button works**: Click "Import Public Data" - should see die entries populate

## Using a Custom Domain

1. **Buy a domain** (Namecheap, GoDaddy, etc.)
2. In PythonAnywhere **Web** tab:
   - Under "Web app name", click **"Add a domain"**
   - Enter your domain
3. **Update DNS records** at your domain provider:
   - Point to: `yourusername.pythonanywhere.com`
   - (PythonAnywhere will show exact instructions)
4. **Add HTTPS certificate** (automatic with Let's Encrypt)

## Updating Your App

Every time you push code to GitHub:

```bash
# SSH into PythonAnywhere console
cd ~/die-compare
git pull origin main

# If you changed requirements.txt:
pip install -r backend/requirements.txt

# If you changed frontend code:
cd frontend && npm install && npm run build

# Back to web tab - click "Reload"
```

## File Structure on PythonAnywhere

```
~/die-compare/
├── backend/
│   ├── main.py
│   ├── scraper.py
│   ├── requirements.txt
│   └── die_compare.db
├── frontend/
│   ├── dist/          (built files)
│   ├── src/
│   └── package.json
└── README.md
```

## Troubleshooting

**"ModuleNotFoundError: No module named 'sqlalchemy'"**
- Make sure you activated virtualenv: `workon diecompare`
- Reinstall requirements: `pip install -r backend/requirements.txt`

**Frontend shows blank page**
- Make sure `npm run build` completed successfully
- Check static files path in Web tab matches `frontend/dist`
- Click "Reload" web app

**API returns 404**
- Make sure WSGI file is correct
- Check that virtualenv is activated in WSGI file
- Click "Reload" web app

**Import button doesn't work**
- Check web app logs (Web tab → "Error log")
- Make sure backend is running (visit `/docs` first)

## Free Tier Limits

- ✅ 100MB storage (plenty for this app)
- ✅ 512MB RAM
- ✅ Full Python support
- ✅ 1 web app
- ⚠️ **10-minute inactivity timeout** (app goes to sleep, first request takes 30 seconds)

**Upgrade to paid** (~$5/month) to:
- Always-on app (no timeout)
- Unlimited web apps
- 1GB storage

## Next Steps

Once deployed, you could:
1. Add more public die data to the scraper
2. Add user authentication for private entries
3. Add export/import features
4. Add advanced filtering/search
5. Create a public leaderboard

Enjoy your app! 🚀
