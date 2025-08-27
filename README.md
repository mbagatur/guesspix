# GuessPix Mobile Game

A fun mobile guessing game where players identify objects, animals, and items from zoomed or cropped images.

## 🎮 Game Features

- **Splash Screen**: Welcome screen with logo and start button
- **Interactive Gameplay**: Up to 10 challenging questions per game
- **Multiple Choice**: 4 options for each question
- **Instant Feedback**: Green for correct answers, red for incorrect
- **Score Tracking**: See how many you got right out of 10
- **Beautiful UI**: Modern design with gradients and smooth animations
- **🆕 Dynamic Questions**: Add new questions without rebuilding! See `ADDING_QUESTIONS.md`

## 📝 Adding New Questions

You can now add new questions to the game without rebuilding the app! Simply:
1. Add your question to `assets/gameData.json`
2. Place your image in `assets/images/questions/`
3. Update the image map in `utils/gameDataLoader.js`

For detailed instructions, see [ADDING_QUESTIONS.md](ADDING_QUESTIONS.md).

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI
- A mobile device with Expo Go app, or an Android/iOS simulator

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Scan the QR code with Expo Go app on your mobile device, or press 'a' for Android simulator or 'i' for iOS simulator

## 📱 How to Play

1. **Start**: Tap the "START GAME" button on the splash screen
2. **Observe**: Look carefully at the zoomed image
3. **Choose**: Select one of the four multiple choice options
4. **Submit**: Tap "Guess It!" to submit your answer
5. **Results**: See immediate feedback - correct answers turn green, incorrect turn red
6. **Continue**: Tap "Next" to move to the next question
7. **Complete**: After 10 questions, see your final score and start a new game

## 🛠️ Development

### Project Structure
```
guesspix/
├── App.js                 # Main app component
├── screens/
│   ├── SplashScreen.js    # Welcome/start screen
│   ├── GameScreen.js      # Main game logic and UI
│   └── ResultScreen.js    # Final score display
├── assets/                # Images and resources
└── app.json              # Expo configuration
```

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Open on Android device/simulator
- `npm run ios` - Open on iOS device/simulator
- `npm run web` - Open in web browser

## 🎨 Customization

### Adding New Questions
Edit the `gameData` array in `screens/GameScreen.js`:

```javascript
const gameData = [
  {
    id: 1,
    image: 'your-image-url',
    correctAnswer: 'Correct Answer',
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
  },
  // Add more questions...
];
```

### Changing Game Settings
- **Number of questions**: Update `totalQuestions` in `App.js`
- **Colors**: Modify the color schemes in each screen's styles
- **Images**: Replace placeholder URLs with actual game images

## 📦 Built With

- [React Native](https://reactnative.dev/) - Mobile app framework
- [Expo](https://expo.dev/) - Development platform
- [React](https://reactjs.org/) - UI library

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

## 📄 License

This project is licensed under the MIT License.

---

Enjoy playing GuessPix! 🎉
