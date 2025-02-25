import { useState, useEffect, useCallback } from "react";

const BASE_URL = "https://momenic.webinvit.id";
const CACHE_KEY = "music-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;

const useMusic = () => {
  // Initialize state with cached data if available
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

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          // Use cached data immediately
          setMusics(data);
          setLoading(false);

          // If cache is fresh enough, don't fetch
          if (Date.now() - timestamp < CACHE_DURATION) {
            return;
          }
        }

        // Increase timeout and add retry logic
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // Increased to 10 seconds

        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const proxyResponse = await fetch(
          proxyUrl + encodeURIComponent(`${BASE_URL}/music`),
          {
            signal: controller.signal,
            headers: {
              Accept: "text/html",
            },
          }
        );

        clearTimeout(timeoutId);

        if (!proxyResponse.ok) {
          throw new Error(`HTTP error! status: ${proxyResponse.status}`);
        }

        const html = await proxyResponse.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const fragment = doc.createDocumentFragment();
        doc
          .querySelectorAll(".col-md-6.col-lg-4.mb-4")
          .forEach((card) => fragment.appendChild(card));

        const extractedMusics = Array.from(fragment.children)
          .map((card, index) => {
            try {
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
            } catch (cardError) {
              console.error(`Error processing card ${index}:`, cardError);
              return null;
            }
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
        console.error("Failed to fetch music:", err);

        if (err.name === "AbortError") {
          setError("Koneksi timeout. Silakan coba lagi.");
        } else {
          setError("Gagal memuat musik. " + err.message);
        }

        // Always use cached data as fallback if available
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setMusics(data);
          setError((prev) => prev + " (menggunakan data cached)");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, []); // Only run on mount

  // Apply memoized filter and pagination
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
