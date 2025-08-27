# Remote Images & Questions System

Your GuessPix game now supports fully remote questions AND images! 🎉

## 📁 Repository Structure

```
guesspix/
├── assets/
│   ├── gameData.json           # Local fallback questions
│   └── images/questions/       # Local fallback images (bundled in APK)
├── remote-sample/
│   ├── gameData.json          # 🌐 Remote questions (served by GitHub Pages)
│   └── images/
│       └── questions/         # 🌐 Remote images (served by GitHub Pages)
├── utils/
│   └── gameDataLoader.js      # Smart loading system with fallbacks
└── config/
    └── remoteConfig.json      # Configuration (not used anymore - inline config)
```

## 🔧 How It Works

### **Remote Loading Priority:**
1. **Remote questions** from GitHub Pages (JSON)
2. **Remote images** from GitHub Pages (PNG files)
3. **Falls back to local** if remote fails

### **Configuration (in `gameDataLoader.js`):**
```javascript
const config = {
  remoteDataUrl: "https://mbagatur.github.io/guesspix/remote-sample/gameData.json",
  remoteImageBaseUrl: "https://mbagatur.github.io/guesspix/remote-sample/images/",
  enableRemoteData: true,     // Enable remote questions
  enableRemoteImages: true,   // Enable remote images
  fallbackToLocal: true,      // Always have fallback
};
```

## 🚀 Setup Steps

### **1. Enable GitHub Pages**
1. Go to: https://github.com/mbagatur/guesspix/settings/pages
2. Source: "Deploy from a branch"
3. Branch: "master", Folder: "/ (root)"
4. Save

### **2. Enable Remote Loading**
In `utils/gameDataLoader.js`, change:
```javascript
enableRemoteData: true,     // Enable remote questions
enableRemoteImages: true,   // Enable remote images
```

### **3. Test the System**
- Questions load from: `https://mbagatur.github.io/guesspix/remote-sample/gameData.json`
- Images load from: `https://mbagatur.github.io/guesspix/remote-sample/images/questions/1.png`

## ✏️ Adding New Questions

### **Method 1: GitHub Web Interface (Easiest)**
1. **Add new question** to `remote-sample/gameData.json`:
   ```json
   {
     "id": 13,
     "imagePath": "questions/13.png",
     "correctAnswer": "New Answer",
     "options": ["Option A", "New Answer", "Option C", "Option D"]
   }
   ```
2. **Upload new image** to `remote-sample/images/questions/13.png`
3. **Commit changes** - users see updates immediately!

### **Method 2: Local Development**
1. Add image to `remote-sample/images/questions/`
2. Add question to `remote-sample/gameData.json`
3. Commit and push changes

## 🎯 Benefits

- ✅ **No APK rebuilds** for new questions
- ✅ **No APK rebuilds** for new images  
- ✅ **Instant updates** for all users
- ✅ **Automatic fallbacks** if GitHub is down
- ✅ **Version control** for all content
- ✅ **Free hosting** via GitHub Pages

## 🔄 Fallback System

1. **Try remote questions** → **Try remote images**
2. **If remote fails** → **Use local questions** → **Use local images**
3. **If everything fails** → **Use hardcoded emergency data**

Your users will always have a working game! 🎮

## 📊 Performance

- **Remote images**: Load as needed (good for many questions)
- **Local images**: Bundled in APK (faster initial load)
- **Hybrid approach**: Critical images local, extras remote

## 🚀 Ready for Production

Current status:
- ✅ **Remote system implemented**
- ✅ **Images copied to remote directory**
- ⏳ **GitHub Pages setup needed**
- ⏳ **Remote loading to be enabled**

Once GitHub Pages is active, you'll have a fully dynamic game system! 🎉
