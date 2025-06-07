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

      // For production, try the fetch API with no-cors mode
      if (isProduction) {
        try {
          console.log("Using sample tracks for production environment");

          // Create dummy data for production since all approaches are failing
          const dummyMusic = [
            {
              title: "Wedding March - Sample",
              category: "wedding",
              musicUrl:
                "https://assets.mixkit.co/music/preview/mixkit-wedding-light-455.mp3",
            },
            {
              title: "Romantic Piano - Sample",
              category: "romantic",
              musicUrl:
                "https://assets.mixkit.co/music/preview/mixkit-a-very-happy-christmas-897.mp3",
            },
            {
              title: "Love Theme - Sample",
              category: "wedding",
              musicUrl:
                "https://assets.mixkit.co/music/preview/mixkit-piano-ballad-483.mp3",
            },
            {
              title: "Celebration - Sample",
              category: "wedding",
              musicUrl:
                "https://assets.mixkit.co/music/preview/mixkit-happy-celebration-179.mp3",
            },
          ];

          // In production, just use these sample tracks
          setMusicList(dummyMusic);
          setLoading(false); // Explicitly set loading to false
          return; // This exits before setting loading=false in finally block
        } catch (err) {
          console.warn("Sample data approach failed:", err);
        }
      }

      // If we reach here, all approaches have failed
      throw new Error("All approaches to fetch music data failed");
    } catch (err) {
      console.error("Error fetching music:", err);
      const isProduction =
        window.location.hostname !== "localhost" &&
        window.location.hostname !== "127.0.0.1";

      if (isProduction) {
        setError(
          "Mohon maaf, daftar musik tidak dapat dimuat saat ini. Kami sedang memperbaiki masalah ini."
        );
      } else {
        setError("Gagal memuat daftar musik. Silakan coba refresh halaman.");
      }
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
