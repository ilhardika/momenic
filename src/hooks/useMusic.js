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

      // In development, use the working proxy
      if (!isProduction) {
        const proxy = "https://thingproxy.freeboard.io/fetch/";
        const targetUrl = encodeURIComponent("https://undanganwebku.com/music");

        try {
          console.log(`Fetching music data with proxy: ${proxy}`);
          const response = await axios.get(`${proxy}${targetUrl}`, {
            timeout: 15000,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          });

          if (response.data && typeof response.data === "string") {
            parseAndProcessMusic(response.data);
            return;
          }
        } catch (err) {
          console.warn(`Error with development proxy: ${err.message}`);
          // Continue to alternative approaches
        }
      }

      // For production (or if development proxy failed), try JSONP approach with script injection
      // This bypasses CORS by using <script> tags which aren't subject to same-origin policy
      console.log("Trying JSONP/script injection approach...");

      // Create a unique callback name
      const callbackName = `jsonpCallback_${Date.now()}`;

      // Create a promise that will be resolved when the JSONP callback is invoked
      const jsonpPromise = new Promise((resolve, reject) => {
        // Set up global callback function that the JSONP response will call
        window[callbackName] = (data) => {
          resolve(data);
          // Clean up the global function after use
          delete window[callbackName];
        };

        // Set a timeout to reject the promise if the request takes too long
        setTimeout(() => {
          if (window[callbackName]) {
            delete window[callbackName];
            reject(new Error("JSONP request timed out"));
          }
        }, 15000);
      });

      // Create and inject a script tag that will load the URL and call our callback
      const script = document.createElement("script");
      script.src = `https://api.allorigins.win/get?url=${encodeURIComponent(
        "https://undanganwebku.com/music"
      )}&callback=${callbackName}`;
      document.body.appendChild(script);

      // When the script loads or errors, remove it from the DOM
      script.onload = () => document.body.removeChild(script);
      script.onerror = () => {
        document.body.removeChild(script);
        throw new Error("JSONP request failed");
      };

      // Wait for the JSONP response
      try {
        const jsonpResponse = await jsonpPromise;

        // The response might be in a 'contents' property
        const htmlContent = jsonpResponse.contents || jsonpResponse;

        if (htmlContent && typeof htmlContent === "string") {
          parseAndProcessMusic(htmlContent);
          return;
        } else {
          throw new Error("Invalid JSONP response format");
        }
      } catch (jsonpError) {
        console.warn("JSONP approach failed:", jsonpError);

        // Try a more direct approach as a last resort
        try {
          console.log("Trying direct iframe approach...");
          await useIFrameApproach();
          return;
        } catch (iframeError) {
          console.warn("Iframe approach failed:", iframeError);
          throw new Error("All approaches failed");
        }
      }
    } catch (err) {
      console.error("Error fetching music:", err);
      if (isProduction) {
        setError(
          "Mohon maaf, daftar musik tidak dapat dimuat saat ini. Kami sedang memperbaiki masalah ini."
        );
      } else {
        setError("Gagal memuat daftar musik. Silakan coba refresh halaman.");
      }
      setMusicList([]);
    } finally {
      if (loading) setLoading(false);
      setRetryCount((prev) => prev + 1);
    }
  };

  // Helper function to parse and process music data from HTML
  const parseAndProcessMusic = (htmlContent) => {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlContent, "text/html");

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
      console.log(`Found ${musicElements.length} potential music elements`);
      const parsedMusic = [];

      // Process elements in chunks
      const processElements = (startIdx, endIdx) => {
        for (let i = startIdx; i < endIdx && i < musicElements.length; i++) {
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
            const category = categoryElem
              ? categoryElem.textContent.trim()
              : "wedding";

            // Extract the music URL from data attribute or onclick
            let musicUrl = musicBtn.getAttribute("data-music");
            if (!musicUrl && musicBtn.getAttribute("onclick")) {
              const onclickAttr = musicBtn.getAttribute("onclick");
              const urlMatch = onclickAttr.match(/playMusic\(.*?['"](.*?)['"]/);
              if (urlMatch && urlMatch[1]) {
                musicUrl = urlMatch[1];
              }
            }

            if (title && musicUrl) {
              parsedMusic.push({ title, category, musicUrl });
            }
          }
        }
      };

      // Process initial batch immediately
      const chunkSize = 200;
      processElements(0, chunkSize);

      // Process the rest in background if needed
      if (musicElements.length > chunkSize) {
        const totalChunks = Math.ceil(musicElements.length / chunkSize);
        let processedChunks = 1;

        const processNextChunk = () => {
          const startIdx = processedChunks * chunkSize;
          const endIdx = startIdx + chunkSize;
          processElements(startIdx, endIdx);

          processedChunks++;
          if (processedChunks < totalChunks) {
            setTimeout(processNextChunk, 0);
          }
        };

        setTimeout(processNextChunk, 0);
      }

      console.log(`Successfully parsed ${parsedMusic.length} music items`);
      setMusicList(parsedMusic);
      setLoading(false);
    } else {
      throw new Error("No music elements found");
    }
  };

  // Helper function to try loading data through a hidden iframe
  const useIFrameApproach = () => {
    return new Promise((resolve, reject) => {
      // Create a hidden iframe
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // Set a timeout to avoid hanging
      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        reject(new Error("Iframe approach timed out"));
      }, 15000);

      // When iframe loads, try to access its content
      iframe.onload = () => {
        try {
          clearTimeout(timeout);

          // Try to access iframe content (may fail due to security)
          const iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;
          const musicElements = iframeDoc.querySelectorAll(".d-flex");

          if (musicElements && musicElements.length > 0) {
            const parsedMusic = [];

            // Only process a reasonable number
            const maxToProcess = Math.min(musicElements.length, 10);

            for (let i = 0; i < maxToProcess; i++) {
              const element = musicElements[i];
              const musicBtn = element.querySelector(".btn-music[data-music]");
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

            if (parsedMusic.length > 0) {
              console.log(
                `Extracted ${parsedMusic.length} music items via iframe`
              );
              setMusicList(parsedMusic);
              resolve();
            } else {
              reject(new Error("No music items found in iframe"));
            }
          } else {
            reject(new Error("No music elements found in iframe"));
          }
        } catch (err) {
          reject(err);
        } finally {
          document.body.removeChild(iframe);
        }
      };

      // Handle iframe loading errors
      iframe.onerror = () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        reject(new Error("Iframe failed to load"));
      };

      // Set the iframe source
      iframe.src = "https://undanganwebku.com/music";
    });
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
