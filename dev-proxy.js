// Simple proxy server to bypass CORS during development
const express = require('express');
const https = require('https');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS for all origins
app.use(cors());

// Proxy endpoint for GitHub raw content
app.get('/api/questions', (req, res) => {
  const githubUrl = 'https://raw.githubusercontent.com/mbagatur/guesspix/master/remote-sample/gameData.json';
  
  https.get(githubUrl, (githubRes) => {
    let data = '';
    
    githubRes.on('data', (chunk) => {
      data += chunk;
    });
    
    githubRes.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        res.json(jsonData);
      } catch (error) {
        res.status(500).json({ error: 'Failed to parse JSON' });
      }
    });
  }).on('error', (error) => {
    res.status(500).json({ error: 'Failed to fetch from GitHub' });
  });
});

app.listen(PORT, () => {
  console.log(`CORS proxy server running on http://localhost:${PORT}`);
  console.log(`Questions API available at: http://localhost:${PORT}/api/questions`);
});
