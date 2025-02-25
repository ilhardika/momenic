import { useState, useEffect } from "react";
import axios from "axios";

const usePortfolio = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/portofolio", {
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          },
        });

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");

        // Find all portfolio cards
        const portfolioCards = doc.querySelectorAll(
          ".col-6.col-md-4.col-lg-3.mb-4"
        );
        console.log("Found portfolio cards:", portfolioCards.length);

        const extractedPortfolios = Array.from(portfolioCards)
          .map((card, index) => {
            try {
              const productCard = card.querySelector("a.product-card");
              const img = card.querySelector("img");
              const category = card
                .querySelector(".small")
                ?.textContent?.trim();
              const title = card.querySelector(".h6")?.textContent?.trim();

              if (!title || !img?.src) return null;

              return {
                id: index + 1,
                title,
                category: category || "Wedding",
                imageUrl: img.src,
                link: productCard?.href || "#",
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
