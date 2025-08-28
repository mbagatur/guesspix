import localGameData from '../assets/gameData.json';

// Inline config for better compatibility with Metro bundler
const config = {
  remoteDataUrl: "https://mbagatur.github.io/guesspix/remote-sample/gameData.json",
  remoteImageBaseUrl: "https://mbagatur.github.io/guesspix/remote-sample/images/",
  enableRemoteData: true, // Enable remote loading for dynamic questions
  enableRemoteImages: true, // Enable remote images for dynamic loading
  questionsPerGame: 10, // Number of random questions to select for each game
  cacheTimeout: 300000,
  retryAttempts: 3,
  fallbackToLocal: true,
  alternativeUrls: [
    "https://raw.githubusercontent.com/mbagatur/guesspix/master/remote-sample/gameData.json"
  ],
  alternativeImageBaseUrls: [
    "https://raw.githubusercontent.com/mbagatur/guesspix/master/remote-sample/images/"
  ]
};

// Fallback local images - only used if remote loading fails completely
const getLocalFallbackImage = (imagePath) => {
  try {
    const imageNumber = imagePath.match(/(\d+)\.png$/)?.[1];
    if (imageNumber && parseInt(imageNumber) <= 25) {
      // Only try to load local images we know exist (1-25)
      switch (imageNumber) {
        case '1': return require('../assets/images/questions/1.png');
        case '2': return require('../assets/images/questions/2.png');
        case '3': return require('../assets/images/questions/3.png');
        case '4': return require('../assets/images/questions/4.png');
        case '5': return require('../assets/images/questions/5.png');
        case '6': return require('../assets/images/questions/6.png');
        case '7': return require('../assets/images/questions/7.png');
        case '8': return require('../assets/images/questions/8.png');
        case '9': return require('../assets/images/questions/9.png');
        case '10': return require('../assets/images/questions/10.png');
        case '11': return require('../assets/images/questions/11.png');
        case '12': return require('../assets/images/questions/12.png');
        case '13': return require('../assets/images/questions/13.png');
        case '14': return require('../assets/images/questions/14.png');
        case '15': return require('../assets/images/questions/15.png');
        case '16': return require('../assets/images/questions/16.png');
        case '17': return require('../assets/images/questions/17.png');
        case '18': return require('../assets/images/questions/18.png');
        case '19': return require('../assets/images/questions/19.png');
        case '20': return require('../assets/images/questions/20.png');
        case '21': return require('../assets/images/questions/21.png');
        case '22': return require('../assets/images/questions/22.png');
        case '23': return require('../assets/images/questions/23.png');
        case '24': return require('../assets/images/questions/24.png');
        case '25': return require('../assets/images/questions/25.png');
        default: return null;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
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
      let imageSource;
      
      if (config.enableRemoteImages) {
        // Use remote image URL - this allows unlimited questions without code changes
        imageSource = { uri: config.remoteImageBaseUrl + question.imagePath };
        console.log(`Loading remote image: ${question.imagePath}`);
      } else {
        // Fallback to local image (only for questions 1-25)
        imageSource = getLocalFallbackImage(question.imagePath);
        if (!imageSource) {
          console.warn(`No local fallback image found for ${question.imagePath}, skipping question`);
          return null;
        }
      }
      
      return {
        ...question,
        image: imageSource
      };
    }).filter(Boolean); // Remove null entries

    console.log(`Successfully processed ${processedData.length} questions for the game`);
    return processedData;
  } catch (error) {
    console.error('Error processing game data:', error);
    // Ultimate fallback to hardcoded questions (only if everything fails)
    return shuffleArray([
      {
        id: 1,
        image: require('../assets/images/questions/1.png'),
        correctAnswer: 'Strawberry',
        options: ['Lemon', 'Strawberry', 'Tomato', 'Apple'],
      },
      {
        id: 2,
        image: require('../assets/images/questions/2.png'),
        correctAnswer: 'Tiger',
        options: ['Lion', 'Dog', 'Tiger', 'Zebra'],
      },
      {
        id: 3,
        image: require('../assets/images/questions/3.png'),
        correctAnswer: 'Pineapple',
        options: ['Pineapple', 'Banana', 'Corn', 'Watermelon'],
      },
      {
        id: 4,
        image: require('../assets/images/questions/4.png'),
        correctAnswer: 'Raccoon',
        options: ['Cat', 'Dog', 'Rabbit', 'Raccoon'],
      },
    ]).slice(0, config.questionsPerGame);
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
