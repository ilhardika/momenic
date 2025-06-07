import { useState, useEffect } from "react";
import axios from "axios";

export const useMusic = () => {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use the proxy that works
      const corsProxies = ["https://thingproxy.freeboard.io/fetch/"];

      // Wait for a shorter time in development, only on first try
      if (retryCount === 0) {
        const waitTime = process.env.NODE_ENV === "production" ? 5000 : 2000;
        console.log(
          `Waiting for ${waitTime / 1000} seconds before fetching data...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const targetUrl = encodeURIComponent("https://undanganwebku.com/music");
      let succeeded = false;

      for (const proxy of corsProxies) {
        if (succeeded) break;

        try {
          console.log(`Fetching music data with proxy: ${proxy}`);
          const response = await axios.get(`${proxy}${targetUrl}`, {
            timeout: 30000, // Increased timeout to 30 seconds for larger data
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          });

          // Process HTML response
          if (response.data && typeof response.data === "string") {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(response.data, "text/html");

            // Look for the d-flex elements that contain music information
            const musicElements = htmlDoc.querySelectorAll(".d-flex");

            if (musicElements && musicElements.length > 0) {
              console.log(
                `Found ${musicElements.length} potential music elements`
              );
              const parsedMusic = [];

              // Process in chunks to avoid blocking the UI
              const processChunk = (startIndex, chunkSize) => {
                const endIndex = Math.min(
                  startIndex + chunkSize,
                  musicElements.length
                );

                for (let i = startIndex; i < endIndex; i++) {
                  const element = musicElements[i];

                  // Only process elements that have the expected structure
                  const musicBtn = element.querySelector(
                    ".btn-music[data-music]"
                  );
                  const titleElem = element.querySelector("h6");
                  const categoryElem = element.querySelector("small");

                  if (musicBtn && titleElem && categoryElem) {
                    const title = titleElem.textContent.trim();
                    const category = categoryElem.textContent.trim();
                    const musicUrl = musicBtn.getAttribute("data-music");

                    if (title && category && musicUrl) {
                      parsedMusic.push({ title, category, musicUrl });
                    }
                  }
                }

                if (endIndex < musicElements.length) {
                  setTimeout(() => {
                    processChunk(endIndex, chunkSize);
                  }, 0);
                } else {
                  // All chunks processed
                  if (parsedMusic.length > 0) {
                    console.log(
                      `Successfully parsed ${parsedMusic.length} music items out of ${musicElements.length} elements`
                    );
                    setMusicList(parsedMusic);
                    succeeded = true;
                  } else {
                    console.log(
                      "No music items found with the expected structure"
                    );
                  }
                  setLoading(false);
                }
              };

              // Start processing in chunks of 200 items to maintain responsiveness
              processChunk(0, 200);
              return; // Exit early as we're handling loading state in the chunk processor
            }
          }
        } catch (err) {
          console.warn(`Error with proxy ${proxy}:`, err.message);
        }
      }

      if (!succeeded) {
        setError("Could not retrieve music data. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching music:", err);
      setError("Failed to load music data. Please try again later.");
    } finally {
      if (loading) setLoading(false); // Only set loading to false if it wasn't handled by chunk processing
      setRetryCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    fetchMusic();
  }, []);

  return {
    musicList,
    loading,
    error,
    refreshMusic: fetchMusic,
  };
};
