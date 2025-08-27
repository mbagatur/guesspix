# Remote Questions Hosting Guide

To update questions without rebuilding your APK, you need to host your `gameData.json` file somewhere accessible via HTTP/HTTPS.

## 🚀 Quick Setup Options

### Option 1: GitHub Pages (Free & Easy)

1. **Create a GitHub repository** for your game data
2. **Upload your `gameData.json`** to the repository
3. **Enable GitHub Pages** in repository settings
4. **Update the URL** in `config/remoteConfig.json`:
   ```json
   {
     "remoteDataUrl": "https://yourusername.github.io/repository-name/gameData.json"
   }
   ```

**Example**: If your GitHub username is `john` and repo is `guesspix-data`:
```
https://john.github.io/guesspix-data/gameData.json
```

### Option 2: Firebase Hosting (Free)

1. **Install Firebase CLI**: `npm install -g firebase-tools`
2. **Initialize Firebase** in a new folder: `firebase init hosting`
3. **Upload `gameData.json`** to the `public` folder
4. **Deploy**: `firebase deploy`
5. **Update URL** in config with your Firebase hosting URL

### Option 3: Netlify (Free)

1. **Create account** at netlify.com
2. **Drag and drop** a folder containing your `gameData.json`
3. **Copy the generated URL** and update your config

### Option 4: Your Own Server

Host the JSON file on any web server and ensure:
- HTTPS is enabled (required for mobile apps)
- CORS is properly configured
- File is publicly accessible

## 📝 Updating Questions

Once hosted, to add new questions:

1. **Edit your remote `gameData.json`** file
2. **Add new images** to your app (these still need to be in the APK)
3. **Update the imageMap** in `utils/gameDataLoader.js` for new images
4. **Users will see new questions** immediately (no APK update needed!)

## ⚙️ Configuration

Edit `config/remoteConfig.json` to:
- Change the primary URL
- Add backup URLs
- Enable/disable remote loading
- Configure retry attempts

## 🔄 How It Works

1. **App starts** → tries to fetch from remote URL
2. **If successful** → uses remote questions
3. **If fails** → falls back to local questions bundled in APK
4. **Questions are shuffled** and limited to game settings

## 🛡️ Fallback System

The app has multiple fallback layers:
1. **Primary remote URL**
2. **Alternative remote URLs**
3. **Local bundled questions**
4. **Hardcoded emergency questions**

This ensures your app always works, even if the remote server is down.

## 🎯 Best Practices

- **Keep local questions updated** as a fallback
- **Use HTTPS URLs** (required for production apps)
- **Test remote URLs** before updating config
- **Monitor your hosting** to ensure availability
- **Keep backup URLs** in case primary fails
