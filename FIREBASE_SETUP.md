# Firebase Setup Guide for Die Compare

## Quick Setup (5 minutes)

### Step 1: Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Enter project name: `die-compare`
4. Click **Continue** through the setup (disable Google Analytics is fine)
5. Click **Create Project**

### Step 2: Enable Authentication
1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **Get Started**
3. Click **Email/Password** provider
4. Toggle **Enable** ON
5. Toggle **Email link (passwordless sign-in)** OFF
6. Click **Save**

### Step 3: Create Firestore Database
1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create Database**
3. Choose **Start in production mode**
4. Select location closest to you (or default)
5. Click **Create**

### Step 4: Set Firestore Security Rules
1. Go to **Firestore Database** > **Rules** tab
2. Replace the default rules with:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write employees
    match /employees/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **Publish**

### Step 5: Get Your Firebase Config
1. Go to **Project Settings** (gear icon top-left)
2. Click **Your apps**
3. Click the **Web** app (or create one if needed)
4. Copy the config object that looks like:
```javascript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
}
```

### Step 6: Add Config to Your Project
1. In the frontend folder, create `.env.local` file:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Replace with YOUR actual values from Step 5

3. Save the file

### Step 7: Create First Admin User
1. In Firebase Console, go to **Authentication**
2. Click **Users** tab
3. Click **Add User**
4. Enter:
   - Email: `admin@diecompare.local`
   - Password: `changeme` (or any password you want)
5. Click **Add User**

### Step 8: Rebuild and Deploy
```bash
cd frontend
npm run build
cd ..
git add -A
git commit -m "Add Firebase authentication"
git push origin main
```

### Step 9: Test It
1. Go to [https://klay326.github.io/die-compare/](https://klay326.github.io/die-compare/)
2. Click **"🔐 Employee Login"**
3. Enter username: `admin`
4. Enter password: `changeme`
5. Should login successfully!

## How It Works

- **Authentication**: Firebase handles all password encryption & validation
- **Passwords**: Never stored in plain text, encrypted by Firebase
- **Employee List**: Stored in Firestore (Firebase database)
- **Adding Employees**: Click "Manage Employees" after login
- **Security**: All data is private to your Firebase project

## Troubleshooting

### "Firebase Config is Missing"
- Make sure `.env.local` file exists in `frontend/` folder
- Make sure all env variables are filled correctly
- Restart dev server: `npm run dev`

### "Failed to Create Employee"
- Check if email format is correct (auto-generated from username)
- Make sure Firestore Rules are published
- Check Firebase Console > Authentication > Users

### "Login Not Working"
- Verify user exists in Firebase Console > Authentication > Users
- Check `.env.local` has correct values
- Check browser console for specific error message

## Back to Local Storage (If Needed)

If Firebase doesn't work, revert with:
```bash
git checkout HEAD~1
```

This goes back to the local storage version with hashed passwords.
