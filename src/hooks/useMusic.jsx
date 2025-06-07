import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://undanganwebku.com/music";
const CACHE_KEY = "music-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;

const useMusic = () => {
  const [musics, setMusics] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(!musics.length);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          setMusics(data);
          setLoading(false);
          if (Date.now() - timestamp < CACHE_DURATION) return;
        }

        setLoading(true);

        // Try multiple CORS proxies in case one fails
        const proxyServices = [
          "https://corsproxy.io/?",
          "https://cors-anywhere.herokuapp.com/",
          "https://api.codetabs.com/v1/proxy?quest=",
        ];

        let html = "";
        let proxySuccess = false;

        // Try each proxy service until one works
        for (let proxyUrl of proxyServices) {
          try {
            console.log(`Trying proxy: ${proxyUrl}`);
            const proxyResponse = await fetch(
              `${proxyUrl}${encodeURIComponent(BASE_URL)}`,
              {
                headers: {
                  Origin: "https://momenic.vercel.app",
                },
                timeout: 10000, // 10 seconds timeout
              }
            );

            if (proxyResponse.ok) {
              html = await proxyResponse.text();
              proxySuccess = true;
              console.log(`Proxy ${proxyUrl} succeeded`);
              break;
            }
          } catch (proxyErr) {
            console.error(`Proxy ${proxyUrl} failed:`, proxyErr);
          }
        }

        if (!proxySuccess) {
          throw new Error("All proxy services failed");
        }

        // Create a temporary DOM element to parse the HTML
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;

        // Find all music elements - try several selector patterns
        const musicElements = [
          ...tempDiv.querySelectorAll(".d-flex"),
          ...tempDiv.querySelectorAll(".card"),
          ...tempDiv.querySelectorAll(".music-item"),
        ];

        console.log("Found music elements:", musicElements.length);

        // Extract music data
        const extractedMusics = [];
        let id = 1;

        musicElements.forEach((element) => {
          try {
            // Look for button with data-music attribute
            const button = element.querySelector("[data-music]");
            if (!button) return;

            const musicUrl = button.getAttribute("data-music");
            if (!musicUrl) return;

            // Try different selectors for title
            let title;
            const titleElement =
              element.querySelector("h6.mb-0") ||
              element.querySelector("h6") ||
              element.querySelector(".title");

            if (titleElement) {
              title = titleElement.textContent.trim();
            }

            // Try different selectors for category
            let category = "Wedding"; // Default category
            const categoryElement =
              element.querySelector(".text-gray") ||
              element.querySelector("small") ||
              element.querySelector(".category");

            if (categoryElement) {
              category = categoryElement.textContent.trim();
            }

            if (title && musicUrl) {
              extractedMusics.push({
                id: id++,
                title,
                category,
                musicUrl,
              });
            }
          } catch (err) {
            console.error("Error processing music element:", err);
          }
        });

        console.log("Extracted musics:", extractedMusics.length);

        if (extractedMusics.length > 0) {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              data: extractedMusics,
              timestamp: Date.now(),
            })
          );

          setMusics(extractedMusics);
          setError(null);
        } else {
          // Try direct HTML string search as fallback
          try {
            const musicUrlPattern = /data-music="([^"]+)"/g;
            const musicMatches = [...html.matchAll(musicUrlPattern)];

            if (musicMatches.length > 0) {
              console.log("Found music URLs via regex:", musicMatches.length);

              const fallbackMusics = musicMatches.map((match, index) => ({
                id: index + 1,
                title: `Music Track ${index + 1}`,
                category: "Wedding",
                musicUrl: match[1],
              }));

              localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                  data: fallbackMusics,
                  timestamp: Date.now(),
                })
              );

              setMusics(fallbackMusics);
              setError(null);
            } else {
              throw new Error("No music elements found");
            }
          } catch (fallbackErr) {
            setError("Tidak bisa mengambil data musik dari server");
          }
        }
      } catch (err) {
        console.error("Failed to fetch music:", err);
        setError("Gagal memuat musik: " + err.message);

        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setMusics(data);
          setError("Menggunakan data cached karena gagal memuat data terbaru");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, []);

  const filteredMusics = useCallback(
    (musicList) => {
      if (!search) return musicList;
      const searchLower = search.toLowerCase();
      return musicList.filter(
        (music) =>
          music.title.toLowerCase().includes(searchLower) ||
          music.category.toLowerCase().includes(searchLower)
      );
    },
    [search]
  )(musics);

  const totalPages = Math.ceil(filteredMusics.length / PER_PAGE);
  const paginatedMusics = filteredMusics.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  useEffect(() => {
    setPage(1);
  }, [search]);

  return {
    musics: paginatedMusics,
    loading,
    error,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
  };
};

export default useMusic;
