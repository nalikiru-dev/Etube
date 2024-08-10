import { useEffect, useState } from 'react';
import axios from 'axios';
import ReactPlayer from 'react-player';
import './App.css';

export default function App() {
  const [videoIds, setVideoIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      // Check if user scrolled to the bottom
      if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:3001/youtube/search', {
          params: { q: 'Ethiopia', page: page }, // Include both tags
        });

        // Extract unique video IDs from the response
        const html = response.data;
        const videoIdRegex = /"videoId":"(.*?)"/g;
        const uniqueIds = new Set();
        let match;

        while ((match = videoIdRegex.exec(html)) !== null) {
          uniqueIds.add(match[1]); // Add unique video IDs to the Set
        }

        setVideoIds((prevIds) => [...prevIds, ...Array.from(uniqueIds)]); // Append new IDs
      } catch (error) {
        console.error('Error fetching videos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, [page]);

  return (
    <div>
      <header>
      <h1>ETUBE</h1>
      </header>
      <div className="video-container">
        {videoIds.map((id) => (
        
        <div className="video" key={id}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              controls
              width="100%"
              height="200px"
            />
          </div>
        ))}
      </div>
      {isLoading && <p>Loading more videos...</p>}
    </div>
  );
}
