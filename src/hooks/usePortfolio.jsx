import { useState, useEffect } from "react";

const BASE_URL = "https://momenic.webinvit.id";
const CACHE_KEY = "portfolio-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;

const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState(() => {
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
  const [loading, setLoading] = useState(!portfolios.length);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter portfolios based on search
  const filteredPortfolios = portfolios.filter(
    (portfolio) =>
      portfolio.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      portfolio.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredPortfolios.length / PER_PAGE);

  // Get paginated portfolios
  const paginatedPortfolios = filteredPortfolios.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setPortfolios(data);
            setLoading(false);
            return;
          }
        }

        setLoading(true);

        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const proxyResponse = await fetch(
          proxyUrl + encodeURIComponent(`${BASE_URL}/portofolio`),
          { signal: AbortSignal.timeout(5000) } // Add timeout
        );
        const html = await proxyResponse.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        const portfolioCards = doc.querySelectorAll(
          ".col-6.col-md-4.col-lg-3.mb-4"
        );

        const extractedPortfolios = Array.from(portfolioCards)
          .map((card, index) => {
            try {
              const productCard = card.querySelector("a");
              const img = card.querySelector("img");
              const category = card
                .querySelector(".small")
                ?.textContent?.trim();
              const title = card.querySelector(".h6")?.textContent?.trim();

              if (!title || !img?.src) return null;

              const imgUrl = img.src.startsWith("http")
                ? img.src
                : `${BASE_URL}${img.src}`;
              const linkUrl = productCard?.href?.startsWith("http")
                ? productCard.href
                : `${BASE_URL}${productCard?.href || ""}`;

              return {
                id: index + 1,
                title,
                category: category || "Wedding",
                imageUrl: imgUrl,
                link: linkUrl,
              };
            } catch (cardError) {
              console.error(`Error processing card ${index}:`, cardError);
              return null;
            }
          })
          .filter(Boolean);

        // Cache the results
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: extractedPortfolios,
            timestamp: Date.now(),
          })
        );

        setPortfolios(extractedPortfolios);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
        setError("Gagal memuat portfolio");

        // Try to use stale cache if available
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setPortfolios(data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!portfolios.length) {
      fetchPortfolios();
    }
  }, []);

  return {
    portfolios: paginatedPortfolios,
    loading,
    error,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    totalPages,
  };
};

export default usePortfolio;
