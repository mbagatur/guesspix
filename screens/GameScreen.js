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
import { initializeGame, loadQuestionByIndex } from '../utils/gameDataLoader';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Limit dimensions for web display to simulate mobile experience
const width = Math.min(screenWidth, 400);
const height = Math.min(screenHeight, 800);

export default function GameScreen({ onGameComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestionData, setCurrentQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalGameQuestions, setTotalGameQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);

  // Initialize game on component mount (fast - no image loading)
  useEffect(() => {
    const initGame = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing game...');
        const gameInfo = await initializeGame();
        setTotalGameQuestions(gameInfo.totalQuestions);
        
        if (gameInfo.totalQuestions > 0) {
          console.log(`Game initialized with ${gameInfo.totalQuestions} questions`);
          // Load first question
          await loadCurrentQuestion(0);
        } else {
          Alert.alert('Error', 'No questions available. Please try again.');
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        Alert.alert('Error', 'Failed to initialize game. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initGame();
  }, []);

  // Function to load current question on-demand
  const loadCurrentQuestion = async (questionIndex) => {
    try {
      setIsLoadingQuestion(true);
      console.log(`Loading question ${questionIndex + 1}...`);
      const questionData = await loadQuestionByIndex(questionIndex);
      
      if (questionData) {
        setCurrentQuestionData(questionData);
        setCurrentQuestionIndex(questionIndex);
        console.log(`Question ${questionIndex + 1} loaded successfully`);
      } else {
        throw new Error(`Failed to load question ${questionIndex + 1}`);
      }
    } catch (error) {
      console.error('Failed to load question:', error);
      Alert.alert('Error', 'Failed to load question. Please try again.');
    } finally {
      setIsLoadingQuestion(false);
    }
  };

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Initializing Game...</Text>
      </View>
    );
  }

  // Show loading for individual question
  if (isLoadingQuestion || !currentQuestionData) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading Question {currentQuestionIndex + 1}...</Text>
      </View>
    );
  }

  const handleAnswerSelect = (answer) => {
    if (showResult) return; // Prevent selecting after showing result
    setSelectedAnswer(answer);
  };

  const handleGuess = () => {
    if (!selectedAnswer) {
      Alert.alert('Please select an answer first!');
      return;
    }
    
    const correct = selectedAnswer === currentQuestionData.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);
  };

  const handleNext = async () => {
    // Calculate the updated score first
    const updatedScore = score + (isCorrect ? 1 : 0);
    
    if (currentQuestionIndex + 1 < totalGameQuestions) {
      // Not the last question - load next question on-demand
      setScore(updatedScore);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      
      // Load next question
      await loadCurrentQuestion(currentQuestionIndex + 1);
    } else {
      // This is the last question - complete the game
      console.log('Game complete! Final score:', updatedScore, 'out of', totalGameQuestions);
      onGameComplete(updatedScore, totalGameQuestions);
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
    if (option === currentQuestionData.correctAnswer) {
      return [styles.option, styles.correctOption];
    }
    
    if (option === selectedAnswer && option !== currentQuestionData.correctAnswer) {
      return [styles.option, styles.incorrectOption];
    }
    
    return styles.option;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.questionCounter}>
          Question {currentQuestionIndex + 1} of {totalGameQuestions}
        </Text>
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={currentQuestionData.image}
          style={[
            styles.image,
            showResult ? styles.imageRevealed : styles.imageZoomed
          ]}
          resizeMode={showResult ? "contain" : "cover"}
        />
      </View>

      <View style={styles.optionsContainer}>
        {currentQuestionData.options.map((option, index) => (
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
                  {option === currentQuestionData.correctAnswer && option === selectedAnswer ? (
                    <Ionicons name="checkmark-circle" size={34} color="#28a745" />
                  ) : option === selectedAnswer && option !== currentQuestionData.correctAnswer ? (
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
              {currentQuestionIndex + 1 < totalGameQuestions ? 'Next' : 'Finish'}
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: width * 0.05,
    color: '#333',
    fontWeight: '500',
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
