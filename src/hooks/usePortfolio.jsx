import { useState, useEffect } from "react";

const BASE_URL = "https://momenic.webinvit.id";

const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);

        const response = await fetch(`${BASE_URL}/portofolio`, {
          mode: "no-cors",
          credentials: "omit",
          headers: {
            Accept: "text/html",
          },
        });

        // Since no-cors gives an opaque response, we'll use a proxy URL for assets
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const proxyResponse = await fetch(
          proxyUrl + encodeURIComponent(`${BASE_URL}/portofolio`)
        );
        const html = await proxyResponse.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Find all portfolio items
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

              // Make sure URLs are absolute
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

        setPortfolios(extractedPortfolios);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch portfolios:", err);
        setError("Gagal memuat portfolio");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  return { portfolios, loading, error };
};

export default usePortfolio;
