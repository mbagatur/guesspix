# Setting up GitHub for GuessPix

Your project is ready to be connected to GitHub! This will give you:
- ✅ **Code backup and version control**
- ✅ **Free hosting for your questions JSON file**
- ✅ **Easy updates without rebuilding APK**

## 🚀 Quick GitHub Setup

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** button and select **"New repository"**
3. Name it `guesspix` (or whatever you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README (your project already has files)
6. Click **"Create repository"**

### Step 2: Connect Your Local Project

Run these commands in your terminal:

```bash
# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/guesspix.git

# Add all your new files
git add .

# Commit your changes
git commit -m "Add dynamic remote questions system"

# Push to GitHub
git push -u origin master
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll to **Pages** section
4. Under **Source**, select **"Deploy from a branch"**
5. Choose **"master"** branch and **"/ (root)"** folder
6. Click **Save**
7. GitHub will give you a URL like: `https://your-username.github.io/guesspix/`

### Step 4: Update Your App Configuration

Edit `config/remoteConfig.json` and replace:
```json
{
  "remoteDataUrl": "https://YOUR_USERNAME.github.io/guesspix/remote-sample/gameData.json",
  "enableRemoteData": true
}
```

## 🎯 How It Will Work

1. **Your code** lives on GitHub (backup + collaboration)
2. **Your questions** are hosted via GitHub Pages (free hosting)
3. **Update questions** by editing the file on GitHub
4. **Users get new questions** instantly (no APK update needed!)

## 📁 Repository Structure

Your GitHub repo will have:
```
guesspix/
├── App.js, screens/, assets/     # Your app code
├── remote-sample/
│   └── gameData.json            # 🌐 Public questions file
└── config/
    └── remoteConfig.json        # Points to the GitHub URL
```

## ✏️ Adding Questions Later

To add new questions after setup:
1. Go to your GitHub repository
2. Navigate to `remote-sample/gameData.json`
3. Click the **pencil icon** to edit
4. Add your new questions
5. Commit the changes
6. **Users see new questions immediately!**

## 🔄 Alternative: Separate Data Repository

For cleaner separation, you could create two repositories:
- `guesspix` - Your app code
- `guesspix-data` - Just the questions JSON

This keeps your questions separate from your code.

Would you like me to help you run the Git commands to set this up?
