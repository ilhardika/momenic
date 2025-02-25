import { useState, useEffect } from "react";

const BASE_URL = "https://momenic.webinvit.id";

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("invitation");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        // Use the proxy service to fetch video data
        const proxyUrl = "https://api.allorigins.win/raw?url=";
        const proxyResponse = await fetch(
          proxyUrl +
            encodeURIComponent(`${BASE_URL}/video?type=${selectedType}`)
        );
        const html = await proxyResponse.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Find all video cards
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

              // Make sure URLs are absolute
              const imageUrl = img?.src?.startsWith("http")
                ? img.src
                : `${BASE_URL}${img?.src || ""}`;

              // Generate video preview URL from title
              const videoId = title.toLowerCase().replace(/\s+/g, "-");

              return {
                id: index + 1,
                title,
                imageUrl,
                category: category || "Unknown",
                type: selectedType,
                price: price || "Rp 200.000",
                originalPrice: originalPrice || "Rp 250.000",
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

        setVideos(extractedVideos);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch videos:", err);
        setError("Gagal memuat video");
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedType]);

  return {
    videos,
    loading,
    error,
    selectedType,
    setSelectedType,
  };
};

export default useVideos;
