import localGameData from '../assets/gameData.json';

// Inline config for better compatibility with Metro bundler
const config = {
  remoteDataUrl: "https://mbagatur.github.io/guesspix/remote-sample/gameData.json",
  remoteImageBaseUrl: "https://mbagatur.github.io/guesspix/remote-sample/images/",
  enableRemoteData: false, // Temporarily disabled until GitHub Pages is enabled
  enableRemoteImages: false, // Temporarily disabled until GitHub Pages is enabled
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

// Create a mapping of image paths to require statements (fallback for local images)
const imageMap = {
  'questions/1.png': require('../assets/images/questions/1.png'),
  'questions/2.png': require('../assets/images/questions/2.png'),
  'questions/3.png': require('../assets/images/questions/3.png'),
  'questions/4.png': require('../assets/images/questions/4.png'),
  // Add more images as needed - you'll need to add the actual image files
  // 'questions/5.png': require('../assets/images/questions/5.png'),
  // 'questions/6.png': require('../assets/images/questions/6.png'),
  // 'questions/7.png': require('../assets/images/questions/7.png'),
  // 'questions/8.png': require('../assets/images/questions/8.png'),
  // 'questions/9.png': require('../assets/images/questions/9.png'),
  // 'questions/10.png': require('../assets/images/questions/10.png'),
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
  let gameDataJson = localGameData; // Default to local data
  
  try {
    // Try to fetch from remote source first
    if (config.enableRemoteData) {
      gameDataJson = await fetchRemoteGameData();
    }
  } catch (error) {
    console.log('Using local fallback data due to remote fetch failure');
    // Fall back to local data if remote fails
    gameDataJson = localGameData;
  }

  try {
    // Process the JSON data to include images
    const processedData = gameDataJson.map(question => {
      let imageSource;
      
      if (config.enableRemoteImages) {
        // Use remote image URL
        imageSource = { uri: config.remoteImageBaseUrl + question.imagePath };
        console.log(`Using remote image: ${config.remoteImageBaseUrl + question.imagePath}`);
      } else if (imageMap[question.imagePath]) {
        // Use local bundled image
        imageSource = imageMap[question.imagePath];
      } else {
        // Skip questions without available local images
        console.warn(`No local image found for ${question.imagePath}`);
        return null;
      }
      
      return {
        ...question,
        image: imageSource
      };
    }).filter(Boolean); // Remove null entries

    console.log(`Processed ${processedData.length} questions for the game`);
    return processedData;
  } catch (error) {
    console.error('Error processing game data:', error);
    // Fallback to original hardcoded data
    return [
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
    ];
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
