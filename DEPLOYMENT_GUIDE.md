# GuessPix - Mobile Deployment Guide

## Next Steps for Android & iOS Deployment

### 1. Account Setup
- Create an Expo account at https://expo.dev
- For iOS: Enroll in Apple Developer Program ($99/year)
- For Android: Create Google Play Console account ($25 one-time)

### 2. Authentication & Project Setup
```bash
# Login to your Expo account
eas login

# Initialize EAS project (creates new project ID automatically)
eas init
```

### 3. App Icons & Assets Preparation
Your current logo.png needs to be optimized for different platforms:

**Required Icon Sizes:**
- iOS App Icon: 1024x1024px (PNG, no transparency)
- Android Adaptive Icon: 1024x1024px (PNG with transparency)

**Tools to generate icons:**
- Use https://www.appicon.co/ to generate all required sizes
- Or use Expo's icon generator: `npx expo install expo-app-icon`

### 4. Build Commands

**For Android APK (testing):**
```bash
eas build --platform android --profile preview
```

**For iOS Simulator (testing):**
```bash
eas build --platform ios --profile development
```

**For Production Builds:**
```bash
# Android AAB for Play Store
eas build --platform android --profile production

# iOS for App Store
eas build --platform ios --profile production
```

### 5. Testing on Physical Devices

**Android:**
1. Build with `eas build --platform android --profile preview`
2. Download APK from build dashboard
3. Install on Android device (enable "Install unknown apps")

**iOS:**
1. Add device UDID to Apple Developer account
2. Build with `eas build --platform ios --profile development` 
3. Install via Expo Go or TestFlight

### 6. Store Submission

**Google Play Store:**
```bash
eas submit --platform android
```

**Apple App Store:**
```bash
eas submit --platform ios
```

### 7. App Store Requirements Checklist

**Both Platforms:**
- [ ] App privacy policy URL
- [ ] App description and keywords
- [ ] Screenshots (different device sizes)
- [ ] App category selection
- [ ] Content rating questionnaire

**iOS Specific:**
- [ ] App Store Connect metadata
- [ ] App Review Guidelines compliance
- [ ] TestFlight beta testing (recommended)

**Android Specific:**
- [ ] Play Console metadata
- [ ] Play Console app content rating
- [ ] Release management setup

### 8. Current Project Status
✅ MVP completed
✅ Expo configuration ready
✅ EAS build configuration created
⚠️  Need to update bundle identifiers in app.json
⚠️  Need proper app icons
⚠️  Need to create Expo account and link project

### 9. Immediate Next Steps
1. Run `eas login` and create/login to Expo account
2. Run `eas init` to link project
3. Create proper app icons (1024x1024)
4. Update bundle identifiers in app.json with your domain
5. Test build with `eas build --platform android --profile preview`

### 10. Estimated Timeline
- Setup and first build: 1-2 hours
- Icon creation and testing: 2-4 hours  
- Store submission prep: 4-6 hours
- Review process: 1-7 days (varies by platform)

### 11. Costs
- Expo EAS builds: Free tier includes limited builds/month
- Apple Developer: $99/year
- Google Play: $25 one-time registration
- Optional: App icon design tools or designer
