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
        const response = await axios.get("/api/portofolio", {
          headers: {
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "User-Agent": "Mozilla/5.0",
          },
        });

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");

        // Find all portfolio cards
        const portfolioCards = doc.querySelectorAll(
          ".col-6.col-md-4.col-lg-3.mb-4"
        );
        console.log("Found portfolio cards:", portfolioCards.length);

        const extractedPortfolios = Array.from(portfolioCards).map(
          (card, index) => {
            const link = card.querySelector(".product-card");
            const img = card.querySelector("img");
            const category = card.querySelector(".small")?.textContent?.trim();
            const title = card.querySelector(".h6")?.textContent?.trim();

            return {
              id: index + 1,
              title: title || "",
              category: category || "",
              imageUrl: img?.src || "",
              link: link?.href || "",
              date: new Date().toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
              }),
            };
          }
        );

        console.log("Extracted portfolios:", extractedPortfolios);
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
