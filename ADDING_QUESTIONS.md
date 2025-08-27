# Adding New Questions to GuessPix

You can now add new questions to the game **without rebuilding the APK**! The game loads questions from a remote server, so users see new content immediately.

## 🌐 Remote Questions (For Deployed APKs)

**For users with the APK on their phones:**

1. **Host your JSON remotely**: Upload `gameData.json` to GitHub Pages, Firebase, or any web server
2. **Update the config**: Edit `config/remoteConfig.json` with your remote URL:
   ```json
   {
     "remoteDataUrl": "https://yourusername.github.io/your-repo/gameData.json",
     "enableRemoteData": true
   }
   ```
3. **Add your question** to the remote JSON file
4. **Users see new questions immediately** (no APK update needed!)

See [REMOTE_HOSTING.md](REMOTE_HOSTING.md) for detailed hosting setup.

## 🏠 Local Development

**For testing during development:**

## 🏠 Local Development

**For testing during development:**

1. **Edit the JSON file**: Open `assets/gameData.json`
2. **Add your question**: Follow this format:
   ```json
   {
     "id": 11,
     "imagePath": "questions/11.png",
     "correctAnswer": "Your Answer",
     "options": ["Option A", "Your Answer", "Option C", "Option D"]
   }
   ```
3. **Add the image**: Place your image file in `assets/images/questions/` with the same name as in `imagePath`
4. **Update the image map**: Add your image to the `imageMap` in `utils/gameDataLoader.js`:
   ```javascript
   'questions/11.png': require('../assets/images/questions/11.png'),
   ```
5. **Restart the app** to see your new questions!

## 🎯 Important Notes

- **Images must be in the APK**: While questions can be remote, images must still be bundled in the app
- **Image map must be updated**: New images require a code update in `gameDataLoader.js`
- **Remote URL in config**: Set your hosting URL in `config/remoteConfig.json`
- **Automatic fallback**: If remote loading fails, local questions are used

## Current Questions

The game currently supports these questions (you can see them all in `assets/gameData.json`):
- Strawberry
- Tiger
- Pineapple
- Raccoon
- And more (up to 10 questions)

## Image Requirements

- **Format**: PNG or JPG
- **Size**: Recommended 512x512 pixels or larger
- **Content**: Should be clear and recognizable when zoomed in
- **Location**: Must be placed in `assets/images/questions/`

## Game Behavior

- Questions are automatically shuffled each game
- The game will use up to the `totalQuestions` limit (currently 10)
- Only questions with available images will be included
- If an image is missing, that question will be skipped

## Advanced: Adding Many Questions

For bulk additions:

1. **Prepare your images**: Name them `questions/12.png`, `questions/13.png`, etc.
2. **Update gameData.json**: Add all your questions at once
3. **Update imageMap**: Add all the new require statements to `utils/gameDataLoader.js`
4. **Test**: Make sure all images load correctly

## Troubleshooting

- **Question not appearing**: Check that the image file exists and is added to the imageMap
- **App crashes**: Verify the JSON syntax is valid
- **Image not loading**: Ensure the image path in JSON matches the actual file location

## Future Enhancements

This system can be extended to:
- Load questions from a remote API with authentication
- Support different difficulty levels
- Include video or animated questions  
- Add categories or themes
- **Load images remotely** (would require more complex caching)
- **A/B testing** different question sets
- **Analytics** on question difficulty and user performance
