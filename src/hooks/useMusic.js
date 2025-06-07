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
            // Try more reliable proxies first
            "https://corsproxy.io/?",
            "https://proxy.cors.sh/",
            "https://corsproxy.org/?url=",
            "https://api.scraperapi.com/v1/?api_key=a3b15fb265d162745958d1dad7d319ef&url=",
            // Keep existing proxies as fallbacks
            "https://corsproxy.vercel.app/?",
            "https://api.allorigins.win/raw?url=",
            "https://api.codetabs.com/v1/proxy?quest=",
            "https://corsanywhere.herokuapp.com/",
          ];

          let parseSuccess = false;

          for (const proxy of productionProxies) {
            try {
              console.log(`Trying production proxy: ${proxy}`);
              const targetUrl = encodeURIComponent(
                "https://undanganwebku.com/music"
              );

              const response = await axios.get(`${proxy}${targetUrl}`, {
                timeout: 8000, // Slightly longer timeout
                headers: {
                  "X-Requested-With": "XMLHttpRequest",
                },
              });

              // Verify that we got a valid response with expected content
              if (
                response.data &&
                typeof response.data === "string" &&
                response.data.includes("d-flex") &&
                response.data.includes("btn-music")
              ) {
                console.log(
                  `Got valid HTML response from ${proxy}, attempting to parse...`
                );

                // Process the response and check if parsing was successful
                parseSuccess = parseAndProcessMusic(response.data, 10);

                if (parseSuccess) {
                  console.log(`Successfully parsed music data from ${proxy}`);
                  return; // Exit the function on success
                } else {
                  console.warn(
                    `Failed to parse valid music data from ${proxy}`
                  );
                }
              } else {
                console.warn(
                  `Response from ${proxy} doesn't have expected HTML content`
                );
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
          "Mohon maaf, daftar musik tidak dapat dimuat saat ini. Coba lagi nanti atau gunakan browser berbeda."
        );
      } else {
        setError("Gagal memuat daftar musik. Silakan coba refresh halaman.");
      }

      // Set empty music list
      setMusicList([]);
    } finally {
      setLoading(false); // Always ensure loading is set to false
    }
  };

  // Helper function to parse and process music data from HTML
  const parseAndProcessMusic = (htmlContent, limit = 10) => {
    try {
      // Validate that the HTML content actually contains expected elements
      if (
        !htmlContent ||
        !htmlContent.includes("d-flex") ||
        !htmlContent.includes("btn-music")
      ) {
        console.warn(
          "HTML content doesn't appear to have the expected music elements"
        );
        throw new Error("Invalid HTML content format");
      }

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
        let successCount = 0;

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
              successCount++;
            }
          }
        }

        // Only consider it successful if we found at least one music item
        if (parsedMusic.length > 0) {
          console.log(`Successfully parsed ${parsedMusic.length} music items`);
          setMusicList(parsedMusic);
          setLoading(false); // Explicitly set loading to false after updating state
          return true; // Indicate success
        } else {
          throw new Error("Failed to extract any valid music items");
        }
      } else {
        throw new Error("No music elements found");
      }
    } catch (error) {
      console.error("Error parsing music data:", error);
      // Don't set error state here - let the calling function decide
      setLoading(false); // Ensure loading is false even on parsing error
      return false; // Indicate failure
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
