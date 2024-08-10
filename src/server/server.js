// server/server.js
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/api/fetchVideos', async (req, res) => {
  const searchQuery = req.query.query || 'Ethiopia';
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const videoIds = [];

    $('a#video-title').each((_, element) => {
      const videoId = $(element).attr('href').split('v=')[1];
      if (videoId) {
        videoIds.push(videoId);
      }
    });

    res.json(videoIds);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).send('Error fetching videos');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
