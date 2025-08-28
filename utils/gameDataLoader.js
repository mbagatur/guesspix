// Inline config for better compatibility with Metro bundler
const config = {
  remoteDataUrl: "https://mbagatur.github.io/guesspix/remote-sample/gameData.json", // GitHub Pages only (CORS-friendly)
  remoteImageBaseUrl: "https://mbagatur.github.io/guesspix/remote-sample/images/", // GitHub Pages images only
  questionsPerGame: 10, // Number of random questions to select for each game
  cacheTimeout: 300000,
  retryAttempts: 3,
  alternativeUrls: [] // No fallbacks - GitHub Pages only
};

// Cache for storing questions metadata and loaded questions
let questionMetadataCache = null;
let loadedQuestionsCache = new Map();
let selectedQuestionIds = [];

// Function to fetch questions metadata (lightweight - just question info, no images)
const fetchQuestionsMetadata = async () => {
  if (questionMetadataCache) {
    console.log('Using cached questions metadata');
    return questionMetadataCache;
  }

  const urls = [config.remoteDataUrl, ...config.alternativeUrls].filter(Boolean);
  
  for (const url of urls) {
    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      try {
        console.log(`Fetching questions metadata from: ${url} (attempt ${attempt})`);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache', // Always get fresh data
          },
          timeout: 10000, // 10 second timeout
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        let data = await response.json();
        
        console.log(`Successfully loaded metadata for ${data.length} questions`);
        
        // Cache the metadata
        questionMetadataCache = data;
        return data;
      } catch (error) {
        console.log(`Attempt ${attempt} failed for ${url}:`, error.message);
        if (attempt === config.retryAttempts) {
          console.log(`All ${config.retryAttempts} attempts failed for ${url}`);
        }
      }
    }
  }
  
  throw new Error('All remote URLs failed after retry attempts');
};

// Function to load a single question with its image
const loadSingleQuestion = async (questionData) => {
  const questionId = questionData.id;
  
  // Check if already loaded
  if (loadedQuestionsCache.has(questionId)) {
    console.log(`Using cached question ${questionId}`);
    return loadedQuestionsCache.get(questionId);
  }

  try {
    console.log(`Loading question ${questionId} with image: ${questionData.imagePath}`);
    
    const processedQuestion = {
      ...questionData,
      image: { uri: config.remoteImageBaseUrl + questionData.imagePath }
    };

    // Cache the loaded question
    loadedQuestionsCache.set(questionId, processedQuestion);
    return processedQuestion;
  } catch (error) {
    console.error(`Error loading question ${questionId}:`, error);
    return null;
  }
};

// Function to initialize game and select random questions (fast - no image loading)
export const initializeGame = async () => {
  try {
    // Load metadata only (fast)
    const allQuestionsMetadata = await fetchQuestionsMetadata();
    
    // Randomly select questions for this game session
    const shuffledQuestions = shuffleArray(allQuestionsMetadata);
    selectedQuestionIds = shuffledQuestions.slice(0, config.questionsPerGame).map(q => q.id);
    
    console.log(`Game initialized with ${selectedQuestionIds.length} questions:`, selectedQuestionIds);
    
    return {
      totalQuestions: selectedQuestionIds.length,
      questionIds: selectedQuestionIds
    };
  } catch (error) {
    console.error('Error initializing game:', error);
    return { totalQuestions: 0, questionIds: [] };
  }
};

// Function to load a specific question by index (on-demand)
export const loadQuestionByIndex = async (questionIndex) => {
  try {
    if (questionIndex < 0 || questionIndex >= selectedQuestionIds.length) {
      throw new Error(`Invalid question index: ${questionIndex}`);
    }

    const questionId = selectedQuestionIds[questionIndex];
    
    // Find the question metadata
    const questionMetadata = questionMetadataCache?.find(q => q.id === questionId);
    if (!questionMetadata) {
      throw new Error(`Question metadata not found for ID: ${questionId}`);
    }

    // Load the question with image
    const loadedQuestion = await loadSingleQuestion(questionMetadata);
    
    console.log(`Successfully loaded question ${questionIndex + 1}/${selectedQuestionIds.length} (ID: ${questionId})`);
    return loadedQuestion;
  } catch (error) {
    console.error(`Error loading question at index ${questionIndex}:`, error);
    return null;
  }
};

// Legacy function for backward compatibility - now uses on-demand loading
export const loadGameData = async () => {
  try {
    console.log('⚠️ loadGameData() is deprecated - use initializeGame() + loadQuestionByIndex() for better performance');
    
    // Initialize the game first
    const gameInfo = await initializeGame();
    if (gameInfo.totalQuestions === 0) {
      return [];
    }

    // Load all questions at once (for backward compatibility)
    const questions = [];
    for (let i = 0; i < gameInfo.totalQuestions; i++) {
      const question = await loadQuestionByIndex(i);
      if (question) {
        questions.push(question);
      }
    }

    console.log(`Loaded ${questions.length} questions for backward compatibility`);
    return questions;
  } catch (error) {
    console.error('Error in legacy loadGameData:', error);
    return [];
  }
};

// Function to clear caches (useful for testing or memory management)
export const clearCache = () => {
  questionMetadataCache = null;
  loadedQuestionsCache.clear();
  selectedQuestionIds = [];
  console.log('Question caches cleared');
};

// Function to shuffle array for random question order
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
