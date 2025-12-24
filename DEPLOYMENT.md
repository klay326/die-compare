# Deployment

**Status**: ✅ Live at https://klay326.github.io/die-compare/

## How It's Deployed

This is a **static site** on GitHub Pages - no backend server needed.

### Architecture
- **Frontend**: React app built to `/docs` folder (served by GitHub Pages)
- **Data**: JSON files in `frontend/public/` (loaded by browser)
- **Encryption**: Client-side AES for private entries
- **Database**: None - uses browser localStorage + Git for persistence

### Why Static?
- ✅ Free (GitHub Pages)
- ✅ No server to maintain
- ✅ No backend complexity
- ✅ Private data encrypted client-side
- ✅ Works offline (cached by browser)

## Updating the App

After code/data changes:

```bash
cd /Users/klay/Documents/Die\ Compare/frontend
npm run build
cd ..
git add docs/
git commit -m "Update: [describe changes]"
git push origin main
```

GitHub Pages auto-deploys the `/docs` folder.

## Adding Die Data

### Public Dies
Edit `frontend/public/public-dies.json`:
```json
{
  "chip_name": "Apple M5",
  "manufacturer": "Apple",
  "process_node": "3nm",
  "die_size_mm2": 180,
  "transistor_count": 25000000000,
  "release_date": "2025-01",
  "category": "SoC"
}
```

Rebuild and push.

### Private Dies
1. Use the app UI: "+ Add Entry"
2. Toggle "Public Entry" OFF
3. Enter password when adding
4. Click "📥 Export JSON" to backup
5. Commit the exported file to persist

## Tech Stack
- React 18 + Vite
- CryptoJS (AES encryption)
- JSON data files
- GitHub Pages (hosting)
- No backend/database

## That's It!
No PythonAnywhere, no Docker, no serverless complications. Just React + GitHub.

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
