import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Limit dimensions for web display to simulate mobile experience  
const width = Math.min(screenWidth, 400);
const height = Math.min(screenHeight, 800);

export default function ResultScreen({ score, totalQuestions, onNewGame }) {
  // Debug logging - remove in production
  // console.log('ResultScreen props:', { score, totalQuestions, onNewGame });
  
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreMessage = () => {
    if (percentage >= 90) return "Excellent! 🏆";
    if (percentage >= 70) return "Great job! 👏";
    if (percentage >= 50) return "Good try! 👍";
    return "Keep practicing! 💪";
  };

  const getScoreColor = () => {
    if (percentage >= 90) return '#FFD700';
    if (percentage >= 70) return '#28a745';
    if (percentage >= 50) return '#ffc107';
    return '#dc3545';
  };

  return (
    <View style={styles.container}>

      <View style={styles.resultContainer}>
        <Text style={styles.gameOverText}>Game Over!</Text>
        
        <View style={[styles.scoreCircle, { borderColor: getScoreColor() }]}>
          <Text style={[styles.scoreText, { color: getScoreColor() }]}>
            {score}
          </Text>
          <Text style={styles.totalText}>of {totalQuestions}</Text>
        </View>

        <Text style={styles.percentageText}>{percentage}%</Text>
        <Text style={styles.messageText}>{getScoreMessage()}</Text>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            You guessed {score} out of {totalQuestions} images correctly!
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.newGameButton} onPress={onNewGame}>
          <Text style={styles.newGameButtonText}>NEW GAME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'rgba(255, 0, 0, 0.1)', // Temporary debug background - removed
  },
  header: {
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05, // 5% of screen height
    paddingBottom: height * 0.02, // 2% of screen height
    alignItems: 'center',
  },
  logoImage: {
    height: height * 0.06, // 6% of screen height
    resizeMode: 'contain',
  },
  resultContainer: {
    flex: 0.75, // Takes 75% of available flex space
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  gameOverText: {
    fontSize: width * 0.08, // 8% of screen width
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: height * 0.03, // 3% of screen height
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    // fontFamily: 'PlaypenSans_400Regular', // Temporary disable for build
  },
  scoreCircle: {
    width: width * 0.35, // 35% of screen width
    height: width * 0.35, // Keep it circular
    borderRadius: width * 0.175, // Half of width for perfect circle
    borderWidth: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: height * 0.025, // 2.5% of screen height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  scoreText: {
    fontSize: width * 0.12, // 12% of screen width
    fontWeight: 'bold',
  },
  totalText: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#666',
    marginTop: -height * 0.005, // Small negative margin
  },
  percentageText: {
    fontSize: width * 0.07, // 7% of screen width
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: height * 0.015, // 1.5% of screen height
  },
  messageText: {
    fontSize: width * 0.06, // 6% of screen width
    color: '#ffffff',
    marginBottom: height * 0.03, // 3% of screen height
    textAlign: 'center',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: height * 0.02, // 2% of screen height
    paddingHorizontal: width * 0.05, // 5% of screen width
    borderRadius: 15,
    marginHorizontal: width * 0.05,
  },
  detailText: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: height * 0.03, // 3% of screen height
  },
  buttonContainer: {
    flex: 0.15, // Takes 15% of available flex space
    justifyContent: 'center',
    paddingHorizontal: width * 0.05,
  },
  newGameButton: {
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
  newGameButtonText: {
    color: '#011f44',
    fontSize: width * 0.045, // 4.5% of screen width
    fontWeight: '500',
    // fontFamily: 'PlaypenSans_400Regular', // Temporary disable for build
  },
});
