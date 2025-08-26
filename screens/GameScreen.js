import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Limit dimensions for web display to simulate mobile experience
const width = Math.min(screenWidth, 400);
const height = Math.min(screenHeight, 800);

// Sample game data - in a real app, this would come from an API or database
const gameData = [
  {
    id: 1,
    image: { uri: 'https://picsum.photos/400/400?random=1' }, // Temporary placeholder
    correctAnswer: 'Strawberry',
    options: ['Lemon', 'Strawberry', 'Tomato', 'Apple'], // Correct answer at position 1 (b)
  },
  {
    id: 2,
    image: { uri: 'https://picsum.photos/400/400?random=2' }, // Temporary placeholder
    correctAnswer: 'Tiger',
    options: ['Lion', 'Dog', 'Tiger', 'Zebra'], // Correct answer at position 2 (c)
  },
  {
    id: 3,
    image: { uri: 'https://picsum.photos/400/400?random=3' }, // Temporary placeholder
    correctAnswer: 'Pineapple',
    options: ['Pineapple', 'Banana', 'Corn', 'Watermelon'], // Correct answer at position 0 (a)
  },
  {
    id: 4,
    image: { uri: 'https://picsum.photos/400/400?random=4' }, // Temporary placeholder
    correctAnswer: 'Raccoon',
    options: ['Cat', 'Dog', 'Rabbit', 'Raccoon'], // Correct answer at position 3 (d)
  },
];

export default function GameScreen({ onGameComplete, totalQuestions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentData = gameData[currentQuestion];

  const handleAnswerSelect = (answer) => {
    if (showResult) return; // Prevent selecting after showing result
    setSelectedAnswer(answer);
  };

  const handleGuess = () => {
    if (!selectedAnswer) {
      Alert.alert('Please select an answer first!');
      return;
    }
    
    const correct = selectedAnswer === currentData.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
    // Don't update score here, do it in handleNext to avoid double counting
  };

  const handleNext = () => {
    // Update score if the current answer is correct
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    if (currentQuestion + 1 < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    } else {
      // For the final question, calculate the final score
      const finalScore = score + (isCorrect ? 1 : 0);
      onGameComplete(finalScore);
    }
  };

  const getOptionStyle = (option) => {
    if (!showResult) {
      // Before revealing answers, highlight selected option
      if (option === selectedAnswer) {
        return [styles.option, styles.selectedOption];
      }
      return styles.option;
    }
    
    // After revealing answers, show correct/incorrect
    if (option === currentData.correctAnswer) {
      return [styles.option, styles.correctOption];
    }
    
    if (option === selectedAnswer && option !== currentData.correctAnswer) {
      return [styles.option, styles.incorrectOption];
    }
    
    return styles.option;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestion + 1} of {totalQuestions}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={currentData.image}
          style={[
            styles.image,
            showResult ? styles.imageRevealed : styles.imageZoomed
          ]}
          resizeMode={showResult ? "contain" : "cover"}
        />
      </View>

      <View style={styles.optionsContainer}>
        {currentData.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={getOptionStyle(option)}
            onPress={() => handleAnswerSelect(option)}
            disabled={showResult}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionText}>{option}</Text>
              {showResult && (
                <View style={styles.iconContainer}>
                  {option === currentData.correctAnswer && option === selectedAnswer ? (
                    <Ionicons name="checkmark-circle" size={34} color="#28a745" />
                  ) : option === selectedAnswer && option !== currentData.correctAnswer ? (
                    <Ionicons name="close-circle" size={34} color="#dc3545" />
                  ) : null}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {/* Development Cheat - Remove in production */}
        {__DEV__ && (
          <TouchableOpacity 
            style={styles.devCheatButton} 
            onPress={() => onGameComplete(7)} // Simulate score of 7/10
          >
            <Text style={styles.devCheatText}>DEV: Go to Results</Text>
          </TouchableOpacity>
        )}
        
        {!showResult ? (
          <TouchableOpacity style={styles.guessButton} onPress={handleGuess}>
            <Text style={styles.buttonText}>Guess It!</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {currentQuestion + 1 < totalQuestions ? 'Next' : 'Finish'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: height * 0.05, // 5% of screen height
    paddingBottom: height * 0.02, // 2% of screen height
    alignItems: 'center',
  },
  logoImage: {
    height: height * 0.06, // 6% of screen height
    resizeMode: 'contain',
    marginBottom: 8,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  questionCounter: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#000',
    opacity: 0.9,
  },
  imageContainer: {
    flex: 0.45, // Takes 45% of available flex space
    marginHorizontal: width * 0.05, // 5% margin on each side
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageZoomed: {
    transform: [{ scale: 4 }], // 8x zoom during question phase
  },
  imageRevealed: {
    transform: [{ scale: 1 }], // Normal size when answer is revealed
  },
  optionsContainer: {
    flex: 0.30, // Takes 35% of available flex space
    paddingHorizontal: width * 0.05,
    justifyContent: 'space-around',
    marginTop: height * 0.03, // 2% of screen height
    marginBottom: height * 0.05, // 2% of screen height
  },
  option: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: height * 0.015, // 1.5% of screen height
    paddingHorizontal: width * 0.04,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    minHeight: height * 0.03, // Minimum 6% of screen height
    marginBottom: height * 0.015, // 1.5% of screen height
    position: 'relative', // Enable absolute positioning for children
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the text
  },
  iconContainer: {
    position: 'absolute',
    top: -20,
    right: -20,
    backgroundColor: '#fff',
    borderRadius: 70,
    padding: 0,
    transform: [{ rotate: '5deg' }],
  },
  selectedOption: {
    backgroundColor: 'rgba(178, 202, 255, 1)', // Light version of your gradient color
  },
  correctOption: {
    backgroundColor: 'rgba(218, 255, 221, 1)',
  },
  incorrectOption: {
    backgroundColor: 'rgba(223, 223, 223, 1)',
  },
  optionText: {
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
    flex: 1, // Take up available space
  },
  buttonContainer: {
    flex: 0.15, // Takes 15% of available flex space
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  devCheatButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  devCheatText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  guessButton: {
    backgroundColor: '#d7c64c',
    paddingVertical: height * 0.018, // 1.8% of screen height
    paddingHorizontal: width * 0.1, // 10% of screen width
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  nextButton: {
    backgroundColor: '#d7c64c',
    paddingVertical: height * 0.018, // 1.8% of screen height
    paddingHorizontal: width * 0.1, // 10% of screen width
    borderRadius: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  buttonText: {
    color: '#011f44',
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: '500',
    // fontFamily: 'PlaypenSans_400Regular', // Temporary disable for build
  },
});
