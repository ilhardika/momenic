import { useState, useEffect } from "react";

const BASE_URL = "https://momenic.webinvit.id";
const CACHE_KEY = "videos-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;

const useVideos = () => {
  const [videos, setVideos] = useState(() => {
    // Initialize from cache if available
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }
    }
    return [];
  });
  const [loading, setLoading] = useState(!videos.length);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("invitation");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter videos based on search query
  const filteredVideos = videos.filter((video) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      video.title.toLowerCase().includes(searchLower) ||
      video.category.toLowerCase().includes(searchLower)
    );
  });

  // Calculate pagination from filtered results
  const totalPages = Math.ceil(filteredVideos.length / PER_PAGE);
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Check cache first for current type
        const cached = localStorage.getItem(`${CACHE_KEY}-${selectedType}`);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setVideos(data);
            setLoading(false);
            return;
          }
        }

        setLoading(true);

        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const proxyResponse = await fetch(
          proxyUrl +
            encodeURIComponent(`${BASE_URL}/video?type=${selectedType}`),
          { signal: AbortSignal.timeout(5000) }
        );
        const html = await proxyResponse.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const videoCards = doc.querySelectorAll(".card");

        const extractedVideos = Array.from(videoCards)
          .map((card, index) => {
            try {
              const title = card
                .querySelector(".h5.font-weight-light")
                ?.textContent?.trim();
              const img = card.querySelector("img.w-100.h-100.rounded");
              const category = card
                .querySelector(".badge.badge-warning")
                ?.textContent?.trim();
              const price = card
                .querySelector(".text-danger.font-weight-bold")
                ?.textContent?.trim();
              const originalPrice = card
                .querySelector(".text-gray")
                ?.textContent?.trim();

              if (!title) return null;

              const addToPrice = (priceStr) => {
                const numericPrice = parseInt(priceStr.replace(/\D/g, ""));
                return `Rp ${(numericPrice + 100000).toLocaleString("id-ID")}`;
              };

              const imageUrl = img?.src?.startsWith("http")
                ? img.src
                : `${BASE_URL}${img?.src || ""}`;

              const videoId = title.toLowerCase().replace(/\s+/g, "-");

              return {
                id: index + 1,
                title,
                imageUrl,
                category: category || "Unknown",
                type: selectedType,
                price: price ? addToPrice(price) : "Rp 300.000",
                originalPrice: originalPrice
                  ? addToPrice(originalPrice)
                  : "Rp 350.000",
                previewUrl: `${BASE_URL}/preview/${videoId}`,
                orderUrl: `https://api.whatsapp.com/send?phone=6285179897917&text=Halo Minmo, saya ingin pesan video ${
                  selectedType === "invitation" ? "undangan" : "ucapan"
                } ${title}`,
              };
            } catch (cardError) {
              console.error(`Error processing card ${index}:`, cardError);
              return null;
            }
          })
          .filter(Boolean);

        // Cache the results by type
        localStorage.setItem(
          `${CACHE_KEY}-${selectedType}`,
          JSON.stringify({
            data: extractedVideos,
            timestamp: Date.now(),
          })
        );

        setVideos(extractedVideos);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError("Gagal memuat video");

        // Try to use stale cache if available
        const cached = localStorage.getItem(`${CACHE_KEY}-${selectedType}`);
        if (cached) {
          const { data } = JSON.parse(cached);
          setVideos(data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedType]);

  return {
    videos: paginatedVideos, // Return paginated & filtered videos
    loading,
    error,
    selectedType,
    setSelectedType,
    currentPage,
    setCurrentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
  };
};

export default useVideos;
