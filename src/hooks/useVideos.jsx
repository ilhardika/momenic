import { useState, useEffect } from "react";
import axios from "axios";

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState("invitation");

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/video?search=&type=${selectedType}`
        );

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");

        // Changed selector to match the actual video cards
        const videoCards = doc.querySelectorAll(".card");
        console.log("Found cards:", videoCards.length);

        const extractedVideos = Array.from(videoCards)
          .map((card, index) => {
            try {
              // Updated selectors based on the HTML structure from console log
              const title = card
                .querySelector(".h5.font-weight-light")
                ?.textContent?.trim();
              const imageUrl = card.querySelector(
                "img.w-100.h-100.rounded"
              )?.src;
              const category = card
                .querySelector(".badge.badge-warning")
                ?.textContent?.trim();
              const price = card
                .querySelector(".text-danger.font-weight-bold")
                ?.textContent?.trim();
              const originalPrice = card
                .querySelector(".text-gray")
                ?.textContent?.trim();

              // Debug log
              console.log("Processing card", index, ":", {
                title,
                imageUrl,
                category,
                price,
                originalPrice,
              });

              // Only create video object if we have a title
              if (!title) {
                console.warn("Skipping card", index, "- no title found");
                return null;
              }

              // Filter based on type
              const isInvitation =
                title.toLowerCase().includes("undangan") ||
                category?.toLowerCase().includes("pernikahan");

              if (
                (selectedType === "invitation" && !isInvitation) ||
                (selectedType === "greeting" && isInvitation)
              ) {
                return null;
              }

              return {
                id: index + 1,
                title,
                imageUrl: imageUrl || "",
                category: category || "Unknown",
                type: selectedType,
                price: price || "Rp 200.000",
                originalPrice: originalPrice || "Rp 250.000",
                previewUrl: `https://momenic.webinvit.id/preview/${title
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`,
                orderUrl: `https://api.whatsapp.com/send?phone=6285179897917&text=Halo Minmo, saya ingin pesan video ${
                  selectedType === "invitation" ? "undangan" : "ucapan"
                } ${title}`,
              };
            } catch (cardError) {
              console.error("Error processing card", index, ":", cardError);
              return null;
            }
          })
          .filter(Boolean);

        console.log("Final extracted videos:", extractedVideos);
        setVideos(extractedVideos);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch videos");
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
