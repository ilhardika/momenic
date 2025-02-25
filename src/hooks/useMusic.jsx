import { useState, useEffect } from "react";
import axios from "axios";

const useMusic = () => {
  const [musics, setMusics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPlaying, setCurrentPlaying] = useState(null);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/music", {
          headers: {
            Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          },
        });

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");

        // Find all music items
        const musicCards = doc.querySelectorAll(".d-flex");
        
        const extractedMusics = Array.from(musicCards)
          .map((card, index) => {
            try {
              const button = card.querySelector(".btn-music");
              const title = card.querySelector("h6")?.textContent?.trim();
              const category = card.querySelector("small")?.textContent?.trim();
              const musicUrl = button?.getAttribute("data-music");

              if (!title || !musicUrl) return null;

              return {
                id: index + 1,
                title,
                category: category || "Umum",
                musicUrl,
              };
            } catch (cardError) {
              console.error(`Error processing music ${index}:`, cardError);
              return null;
            }
          })
          .filter(Boolean);

        setMusics(extractedMusics);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch musics:", err);
        setError("Gagal memuat musik");
      } finally {
        setLoading(false);
      }
    };

    fetchMusics();
  }, []);

  return { musics, loading, error, currentPlaying, setCurrentPlaying };
};

export default useMusic;