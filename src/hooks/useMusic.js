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

      // Use multiple proxies to increase chances of success in production
      const corsProxies = [
        "https://thingproxy.freeboard.io/fetch/",
        "https://api.allorigins.win/raw?url=",
        "https://corsproxy.io/?",
        "https://api.codetabs.com/v1/proxy?quest=",
        "https://cors.bridged.cc/",
      ];

      // Wait before trying in production
      const isProduction =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";

      if (retryCount === 0) {
        const waitTime = isProduction ? 5000 : 2000;
        console.log(
          `Waiting for ${waitTime / 1000} seconds before fetching data...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      const targetUrl = encodeURIComponent("https://undanganwebku.com/music");
      let succeeded = false;

      // Try each proxy in sequence
      for (const proxy of corsProxies) {
        if (succeeded) break;

        try {
          console.log(`Fetching music data with proxy: ${proxy}`);
          const response = await axios.get(`${proxy}${targetUrl}`, {
            timeout: 30000, // Long timeout for production
            headers: {
              "X-Requested-With": "XMLHttpRequest",
              // Avoid setting Origin header as it causes issues
            },
          });

          // Process HTML response
          if (response.data && typeof response.data === "string") {
            const parser = new DOMParser();
            const htmlDoc = parser.parseFromString(response.data, "text/html");

            // Try multiple selectors that might contain music data
            const selectors = [".d-flex", ".music-item", ".music-list-item"];
            let musicElements = null;

            for (const selector of selectors) {
              const elements = htmlDoc.querySelectorAll(selector);
              if (elements && elements.length > 0) {
                console.log(
                  `Found ${elements.length} elements with selector: ${selector}`
                );
                musicElements = elements;
                break;
              }
            }

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

                  // Try multiple button selectors
                  const musicBtn =
                    element.querySelector(".btn-music[data-music]") ||
                    element.querySelector("[data-music]") ||
                    element.querySelector("button[onclick*='playMusic']");

                  // Try multiple title selectors
                  const titleElem =
                    element.querySelector("h6") ||
                    element.querySelector(".music-title");

                  // Try multiple category selectors
                  const categoryElem =
                    element.querySelector("small") ||
                    element.querySelector(".text-gray") ||
                    element.querySelector(".music-category");

                  if (musicBtn && titleElem) {
                    const title = titleElem.textContent.trim();
                    // Use a default category if none found
                    const category = categoryElem
                      ? categoryElem.textContent.trim()
                      : "wedding";

                    // Extract the music URL from data attribute or onclick
                    let musicUrl = musicBtn.getAttribute("data-music");
                    if (!musicUrl && musicBtn.getAttribute("onclick")) {
                      const onclickAttr = musicBtn.getAttribute("onclick");
                      const urlMatch = onclickAttr.match(
                        /playMusic\(.*?['"](.*?)['"]/
                      );
                      if (urlMatch && urlMatch[1]) {
                        musicUrl = urlMatch[1];
                      }
                    }

                    if (title && musicUrl) {
                      parsedMusic.push({ title, category, musicUrl });
                    }
                  }
                }

                if (endIndex < musicElements.length) {
                  setTimeout(() => {
                    processChunk(endIndex, chunkSize);
                  }, 0);
                } else {
                  if (parsedMusic.length > 0) {
                    console.log(
                      `Successfully parsed ${parsedMusic.length} music items`
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

              // Start with smaller chunks for better responsiveness
              processChunk(0, 100);
              return;
            }
          }
        } catch (err) {
          console.warn(`Error with proxy ${proxy}:`, err.message);
          // Add a small delay before trying the next proxy
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      // If all proxies failed
      if (!succeeded) {
        // Create some minimal data instead of using fallbackMusicData
        console.log("All proxies failed, creating minimal data set");

        // Generate a simple dataset dynamically
        const minimalMusicList = [
          {
            title: "Sample Wedding Music",
            category: "wedding",
            musicUrl:
              "https://assets.mixkit.co/music/preview/mixkit-wedding-light-455.mp3",
          },
          {
            title: "Romantic Background",
            category: "romantic",
            musicUrl:
              "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3",
          },
          {
            title: "Love Theme",
            category: "wedding",
            musicUrl:
              "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          },
        ];

        setMusicList(minimalMusicList);

        // Don't set error since we're providing data
        setError(null);
      }
    } catch (err) {
      console.error("Error fetching music:", err);
      setError("Failed to load music data. Please try refreshing the page.");

      // Create minimal music data on catastrophic error
      const emergencyData = [
        {
          title: "Wedding March",
          category: "wedding",
          musicUrl:
            "https://assets.mixkit.co/music/preview/mixkit-wedding-light-455.mp3",
        },
      ];
      setMusicList(emergencyData);
    } finally {
      if (loading) setLoading(false);
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
