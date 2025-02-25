import { useState, useEffect } from "react";

const BASE_URL = "https://momenic.webinvit.id";
const CACHE_KEY = "music-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12; // Items per page

const useMusic = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  // Filter and paginate musics
  const filteredMusics = musics.filter(
    (music) =>
      music.title.toLowerCase().includes(search.toLowerCase()) ||
      music.category.toLowerCase().includes(search.toLowerCase())
  );

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
    const fetchMusics = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setMusics(data);
            setLoading(false);
            return;
          }
        }

        setLoading(true);
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const proxyResponse = await fetch(
          proxyUrl + encodeURIComponent(`${BASE_URL}/music`),
          { signal: AbortSignal.timeout(5000) } // Add timeout
        );
        const html = await proxyResponse.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const musicCards = doc.querySelectorAll(".col-md-6.col-lg-4.mb-4");

        const extractedMusics = Array.from(musicCards)
          .map((card, index) => {
            try {
              const button = card.querySelector("button[data-music]");
              const musicUrl = button?.getAttribute("data-music");
              const title = card.querySelector("h6.mb-0")?.textContent?.trim();
              const category = card
                .querySelector(".text-gray")
                ?.textContent?.trim();

              if (!title || !musicUrl) return null;

              return {
                id: index + 1,
                title,
                category: category || "Wedding",
                musicUrl: musicUrl.startsWith("http")
                  ? musicUrl
                  : `${BASE_URL}${musicUrl}`,
              };
            } catch (cardError) {
              console.error(`Error processing card ${index}:`, cardError);
              return null;
            }
          })
          .filter(Boolean);

        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: extractedMusics,
            timestamp: Date.now(),
          })
        );

        setMusics(extractedMusics);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch music:", err);
        setError("Gagal memuat musik");
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
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
