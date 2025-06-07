import { useState, useEffect } from "react";
import axios from "axios";

export const useMusic = () => {
  const [musicList, setMusicList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMusic = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we're running in production
      const isProduction =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";

      // In development, use the working proxy
      if (!isProduction) {
        try {
          const proxy = "https://thingproxy.freeboard.io/fetch/";
          const targetUrl = encodeURIComponent(
            "https://undanganwebku.com/music"
          );

          console.log(`Fetching music data with proxy: ${proxy}`);
          const response = await axios.get(`${proxy}${targetUrl}`, {
            timeout: 10000,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          });

          if (response.data && typeof response.data === "string") {
            // Process the first 10 items only for better performance
            parseAndProcessMusic(response.data, 10);
            return; // This exits before setting loading=false in finally block
          }
        } catch (err) {
          console.warn(`Error with development proxy: ${err.message}`);
        }
      }

      // For production, try multiple CORS proxies
      if (isProduction) {
        try {
          console.log("Trying alternative proxies for production environment");

          // Try different proxies that might work in production
          const productionProxies = [
            "https://corsproxy.vercel.app/?",
            "https://corsanywhere.herokuapp.com/",
            "https://api.allorigins.win/raw?url=",
          ];

          for (const proxy of productionProxies) {
            try {
              console.log(`Trying production proxy: ${proxy}`);
              const targetUrl = encodeURIComponent(
                "https://undanganwebku.com/music"
              );

              const response = await axios.get(`${proxy}${targetUrl}`, {
                timeout: 5000, // Shorter timeout to quickly try alternatives
                headers: {
                  "X-Requested-With": "XMLHttpRequest",
                },
              });

              if (response.data && typeof response.data === "string") {
                // Process the first 10 items for better performance
                parseAndProcessMusic(response.data, 10);
                return;
              }
            } catch (proxyErr) {
              console.warn(`Error with proxy ${proxy}:`, proxyErr.message);
              // Continue to the next proxy
            }
          }

          // If we get here, all proxies failed
          throw new Error("All proxies failed in production");
        } catch (err) {
          console.warn("All production proxies failed:", err);
          throw err; // Re-throw to be caught by the outer catch
        }
      }

      // If we reach here, all approaches have failed
      throw new Error("All approaches to fetch music data failed");
    } catch (err) {
      console.error("Error fetching music:", err);

      // Provide appropriate error message based on environment
      const isProduction =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";

      if (isProduction) {
        setError(
          "Mohon maaf, daftar musik tidak dapat dimuat saat ini. Fitur ini tersedia saat aplikasi dalam tahap pengembangan."
        );
      } else {
        setError("Gagal memuat daftar musik. Silakan coba refresh halaman.");
      }

      // Set empty music list since we don't want dummy data
      setMusicList([]);
    } finally {
      setLoading(false); // Always ensure loading is set to false
    }
  };

  // Helper function to parse and process music data from HTML
  const parseAndProcessMusic = (htmlContent, limit = 10) => {
    try {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlContent, "text/html");

      // Try to find music elements
      const musicElements = htmlDoc.querySelectorAll(".d-flex");

      if (musicElements && musicElements.length > 0) {
        console.log(
          `Found ${musicElements.length} elements with selector: .d-flex`
        );
        console.log(`Found ${musicElements.length} potential music elements`);

        const parsedMusic = [];

        // Only process up to the specified limit
        const elementsToProcess = Math.min(musicElements.length, limit);

        for (let i = 0; i < elementsToProcess; i++) {
          const element = musicElements[i];

          // Find music data
          const musicBtn = element.querySelector(".btn-music[data-music]");
          const titleElem = element.querySelector("h6");
          const categoryElem = element.querySelector("small");

          if (musicBtn && titleElem) {
            const title = titleElem.textContent.trim();
            const category = categoryElem
              ? categoryElem.textContent.trim()
              : "wedding";
            const musicUrl = musicBtn.getAttribute("data-music");

            if (title && musicUrl) {
              parsedMusic.push({ title, category, musicUrl });
            }
          }
        }

        console.log(`Successfully parsed ${parsedMusic.length} music items`);
        setMusicList(parsedMusic);
        setLoading(false); // Explicitly set loading to false after updating state
      } else {
        throw new Error("No music elements found");
      }
    } catch (error) {
      console.error("Error parsing music data:", error);
      setError("Gagal memproses data musik.");
      setLoading(false); // Ensure loading is false even on parsing error
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
