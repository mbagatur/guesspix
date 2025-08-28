import localGameData from '../assets/gameData.json';

// Inline config for better compatibility with Metro bundler
const config = {
  remoteDataUrl: "https://mbagatur.github.io/guesspix/remote-sample/gameData.json",
  remoteImageBaseUrl: "https://mbagatur.github.io/guesspix/remote-sample/images/",
  enableRemoteData: true, // Enable remote loading for dynamic questions
  questionsPerGame: 10, // Number of random questions to select for each game
  cacheTimeout: 300000,
  retryAttempts: 3,
  fallbackToLocal: true, // Fallback to local JSON data if remote fails
  alternativeUrls: [
    "https://raw.githubusercontent.com/mbagatur/guesspix/master/remote-sample/gameData.json"
  ]
};

// Function to fetch game data from remote URL with retry logic
const fetchRemoteGameData = async () => {
  if (!config.enableRemoteData) {
    throw new Error('Remote data is disabled in configuration');
  }

  const urls = [config.remoteDataUrl, ...config.alternativeUrls].filter(Boolean);
  
  for (const url of urls) {
    for (let attempt = 1; attempt <= config.retryAttempts; attempt++) {
      try {
        console.log(`Fetching questions from: ${url} (attempt ${attempt})`);
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
        
        const data = await response.json();
        console.log(`Successfully loaded ${data.length} questions from remote source`);
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

// Function to load and process game data
export const loadGameData = async () => {
  let allQuestionsData = localGameData; // Default to local data
  
  try {
    // Try to fetch from remote source first
    if (config.enableRemoteData) {
      allQuestionsData = await fetchRemoteGameData();
    }
  } catch (error) {
    console.log('Remote loading failed, using local fallback data');
    allQuestionsData = localGameData;
  }

  try {
    // Randomly shuffle all available questions
    const shuffledQuestions = shuffleArray(allQuestionsData);
    
    // Take only the number of questions we need for the game
    const selectedQuestions = shuffledQuestions.slice(0, config.questionsPerGame);
    
    console.log(`Selected ${selectedQuestions.length} random questions from ${allQuestionsData.length} available questions`);

    // Process the selected questions to include images
    const processedData = selectedQuestions.map(question => {
      // Use remote image URL - this allows unlimited questions without code changes
      const imageSource = { uri: config.remoteImageBaseUrl + question.imagePath };
      console.log(`Loading remote image: ${question.imagePath}`);
      
      return {
        ...question,
        image: imageSource
      };
    });

    console.log(`Successfully processed ${processedData.length} questions for the game`);
    return processedData;
  } catch (error) {
    console.error('Error processing game data:', error);
    // If everything fails, return empty array - game will show error state
    return [];
  }
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
