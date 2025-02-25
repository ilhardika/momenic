import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://momenic.webinvit.id";
const CACHE_KEY = "music-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;
const INITIAL_TIMEOUT = 8000; // Increased initial timeout
const MAX_RETRIES = 2; // Reduced retries

const useMusic = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Memoize the filter function
  const getFilteredMusics = useCallback(
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
  );

  // Apply memoized filter
  const filteredMusics = getFilteredMusics(musics);
  const totalPages = Math.ceil(filteredMusics.length / PER_PAGE);
  const paginatedMusics = filteredMusics.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    const fetchWithRetry = async (
      retryCount = 0,
      timeout = INITIAL_TIMEOUT
    ) => {
      try {
        // Try to load cached data immediately
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          setMusics(data);
          setLoading(false);

          // If cache is still valid, don't fetch new data
          if (Date.now() - timestamp < CACHE_DURATION) {
            return;
          }
        }

        // Fetch new data in background if cache exists but expired
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const proxyResponse = await fetch(
          proxyUrl + encodeURIComponent(`${BASE_URL}/music`),
          {
            signal: controller.signal,
            headers: {
              Accept: "text/html",
              "Cache-Control": "no-cache",
            },
          }
        );

        clearTimeout(timeoutId);

        if (!proxyResponse.ok)
          throw new Error(`HTTP error! status: ${proxyResponse.status}`);

        const html = await proxyResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Use more specific selectors and batch DOM operations
        const fragment = doc.createDocumentFragment();
        doc
          .querySelectorAll(".col-md-6.col-lg-4.mb-4")
          .forEach((card) => fragment.appendChild(card));

        const extractedMusics = Array.from(fragment.children)
          .map((card, index) => {
            const button = card.querySelector("button[data-music]");
            const musicUrl = button?.getAttribute("data-music");
            const title = card.querySelector("h6.mb-0")?.textContent?.trim();
            const category = card
              .querySelector(".text-gray")
              ?.textContent?.trim();

            return title && musicUrl
              ? {
                  id: index + 1,
                  title,
                  category: category || "Wedding",
                  musicUrl: musicUrl.startsWith("http")
                    ? musicUrl
                    : `${BASE_URL}${musicUrl}`,
                }
              : null;
          })
          .filter(Boolean);

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
        }
      } catch (err) {
        console.error(`Attempt ${retryCount + 1} failed:`, err);

        if (
          retryCount < MAX_RETRIES &&
          (err.name === "AbortError" || err.name === "TimeoutError")
        ) {
          // Exponential backoff
          const nextTimeout = timeout * 1.5;
          console.log(`Retrying with timeout: ${nextTimeout}ms`);
          return fetchWithRetry(retryCount + 1, nextTimeout);
        }

        setError("Gagal memuat musik. Silakan coba lagi nanti.");

        // Try to load from cache as fallback, even if expired
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

    fetchWithRetry();
  }, []);

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
