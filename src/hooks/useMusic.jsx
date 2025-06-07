import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://undanganwebku.com/music";
const CACHE_KEY = "music-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;
const PREFERRED_PROXY = "https://api.codetabs.com/v1/proxy?quest="; // Use the working proxy as default

const useMusic = () => {
  const [musics, setMusics] = useState(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      } catch (err) {
        console.error("Error parsing cached music data:", err);
      }
    }
    return [];
  });

  const [loading, setLoading] = useState(!musics.length);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Extract music data from HTML function
  const extractMusicData = useCallback((html) => {
    // Create a temporary DOM element to parse the HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;

    // Find all music elements - focus on .d-flex which seems to work
    const musicElements = tempDiv.querySelectorAll(".d-flex");
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
        } else {
          // If no title element found, skip this item
          return;
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

        extractedMusics.push({
          id: id++,
          title,
          category,
          musicUrl,
        });
      } catch (err) {
        console.error("Error processing music element:", err);
      }
    });

    return extractedMusics;
  }, []);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { data, timestamp } = JSON.parse(cached);
            setMusics(data);
            setLoading(false);
            if (Date.now() - timestamp < CACHE_DURATION) return;
          } catch (err) {
            console.error("Error parsing cached music data:", err);
          }
        }

        setLoading(true);

        // Try the preferred proxy first
        try {
          console.log(`Using preferred proxy: ${PREFERRED_PROXY}`);
          const proxyResponse = await fetch(
            `${PREFERRED_PROXY}${encodeURIComponent(BASE_URL)}`,
            {
              headers: {
                Origin: "https://momenic.vercel.app",
              },
            }
          );

          if (proxyResponse.ok) {
            const html = await proxyResponse.text();
            const extractedMusics = extractMusicData(html);

            console.log("Extracted musics:", extractedMusics.length);

            if (extractedMusics.length > 0) {
              // Store in cache
              localStorage.setItem(
                CACHE_KEY,
                JSON.stringify({
                  data: extractedMusics,
                  timestamp: Date.now(),
                })
              );

              setMusics(extractedMusics);
              setError(null);
              setLoading(false);
              return;
            }
          }
        } catch (preferredProxyErr) {
          console.error(`Preferred proxy failed:`, preferredProxyErr);
        }

        // If the preferred proxy fails, try fallback proxies
        const fallbackProxies = [
          "https://corsproxy.io/?",
          "https://cors-anywhere.herokuapp.com/",
        ];

        let html = "";
        let proxySuccess = false;

        for (let proxyUrl of fallbackProxies) {
          try {
            console.log(`Trying fallback proxy: ${proxyUrl}`);
            const proxyResponse = await fetch(
              `${proxyUrl}${encodeURIComponent(BASE_URL)}`,
              {
                headers: {
                  Origin: "https://momenic.vercel.app",
                },
                timeout: 10000,
              }
            );

            if (proxyResponse.ok) {
              html = await proxyResponse.text();
              proxySuccess = true;
              console.log(`Fallback proxy ${proxyUrl} succeeded`);
              break;
            }
          } catch (proxyErr) {
            console.error(`Fallback proxy ${proxyUrl} failed:`, proxyErr);
          }
        }

        if (!proxySuccess) {
          throw new Error("All proxy services failed");
        }

        const extractedMusics = extractMusicData(html);
        console.log("Extracted musics from fallback:", extractedMusics.length);

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
          // No music found through DOM parsing, try regex as last resort
          const musicUrlPattern = /data-music="([^"]+)"/g;
          const titlePattern = /<h6[^>]*>([^<]+)<\/h6>/g;
          const musicMatches = [...html.matchAll(musicUrlPattern)];
          const titleMatches = [...html.matchAll(titlePattern)];

          if (musicMatches.length > 0) {
            console.log("Found music URLs via regex:", musicMatches.length);

            const fallbackMusics = musicMatches.map((match, index) => ({
              id: index + 1,
              title: titleMatches[index]
                ? titleMatches[index][1].trim()
                : `Music Track ${index + 1}`,
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
        }
      } catch (err) {
        console.error("Failed to fetch music:", err);
        setError(`Gagal memuat musik: ${err.message}`);

        // Try to use cached data if available
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          try {
            const { data } = JSON.parse(cached);
            if (data && data.length > 0) {
              setMusics(data);
              setError(
                "Menggunakan data tersimpan karena gagal memuat data terbaru"
              );
            }
          } catch (cacheErr) {
            console.error("Error using cached data:", cacheErr);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, [extractMusicData]);

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
