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

      // Check if we're running in production
      const isProduction =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";

      // Use different proxies based on environment
      // For production, focus on the most reliable options
      const corsProxies = isProduction
        ? [
            // More reliable proxies for production
            "https://corsproxy.vercel.app/?",
            "https://api.allorigins.win/raw?url=",
            "https://proxy.cors.sh/",
            "https://cors-anywhere.herokuapp.com/",
          ]
        : [
            // Standard proxies for development
            "https://thingproxy.freeboard.io/fetch/",
            "https://api.allorigins.win/raw?url=",
            "https://corsproxy.io/?",
            "https://api.codetabs.com/v1/proxy?quest=",
            "https://cors.bridged.cc/",
          ];

      // Wait before trying
      if (retryCount === 0) {
        const waitTime = isProduction ? 2000 : 1000; // Shorter wait times
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

          // Different approach for different proxies
          const response = await axios.get(`${proxy}${targetUrl}`, {
            timeout: 8000, // Shorter timeout for faster feedback
            headers: {
              "X-Requested-With": "XMLHttpRequest",
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
          await new Promise((resolve) => setTimeout(resolve, 300));
        }
      }

      // If all proxies failed
      if (!succeeded) {
        console.log("All proxies failed to fetch music data");

        if (isProduction) {
          setError(
            "Fitur ini sedang dalam perbaikan. Silakan kembali lagi nanti."
          );
        } else {
          setError("Gagal memuat daftar musik. Silakan coba refresh halaman.");
        }

        // Set an empty music list
        setMusicList([]);
      }
    } catch (err) {
      console.error("Error fetching music:", err);
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi nanti.");
      setMusicList([]);
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
