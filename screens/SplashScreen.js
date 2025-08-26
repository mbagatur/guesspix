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

export default function SplashScreen({ onStartGame }) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/logo.png')} style={styles.logoImage} />
        </View>
        
        <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  logoImage: {
    height: 250,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  logoText: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
    textAlign: 'center',
    // fontFamily: 'PlaypenSans_400Regular', // Temporary disable for build
  },
  startButton: {
    backgroundColor: '#d7c64c',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 16,
  },
  startButtonText: {
    color: '#011f44',
    fontSize: 16,
    fontWeight: '500',
    // fontFamily: 'PlaypenSans_400Regular', // Temporary disable for build
  },
});
