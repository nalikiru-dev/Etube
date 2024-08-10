const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/youtube/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://www.youtube.com/results`, {
      params: { search_query: query },
    });
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching data from YouTube');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
