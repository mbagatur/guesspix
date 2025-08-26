import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Font from 'expo-font';
import SplashScreen from './screens/SplashScreen';
import GameScreen from './screens/GameScreen';
import ResultScreen from './screens/ResultScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [score, setScore] = useState(0);
  const [totalQuestions] = useState(10);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        // For now, we'll just set fontLoaded to true
        // You can add actual font files later
        setFontLoaded(true);
      } catch (error) {
        console.log('Error loading fonts:', error);
        setFontLoaded(true);
      }
    }
    loadFonts();
  }, []);

  const handleStartGame = () => {
    setCurrentScreen('game');
    setScore(0);
  };

  const handleGameComplete = (finalScore) => {
    setScore(finalScore);
    setCurrentScreen('result');
  };

  const handleNewGame = () => {
    setScore(0);
    setCurrentScreen('game');
  };

  const renderScreen = () => {
    if (!fontLoaded) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      );
    }

    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onStartGame={handleStartGame} />;
      case 'game':
        return <GameScreen onGameComplete={handleGameComplete} totalQuestions={totalQuestions} />;
      case 'result':
        return <ResultScreen score={score} totalQuestions={totalQuestions} onNewGame={handleNewGame} />;
      default:
        return <SplashScreen onStartGame={handleStartGame} />;
    }
  };

  return (
    <LinearGradient
      colors={['#73f9e2', '#a58aed']}
      style={styles.container}
    >
      {renderScreen()}
      <StatusBar style="auto" />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
