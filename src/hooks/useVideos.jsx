import { useState, useEffect } from "react";
import axios from "axios";

const useVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/video", {
          headers: {
            Accept: "text/html",
            "Content-Type": "text/html",
          },
        });

        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, "text/html");

        const videoData = Array.from(doc.querySelectorAll("figure.card")).map(
          (figure) => {
            const title =
              figure.querySelector("h2.h5")?.textContent?.trim() || "";
            const imageUrl = figure.querySelector("img")?.src || "";
            const category =
              figure.querySelector(".badge")?.textContent?.trim() || "";
            const price =
              figure.querySelector(".text-danger")?.textContent?.trim() || "";
            const originalPrice =
              figure.querySelector(".text-gray")?.textContent?.trim() || "";
            const previewButton = figure.querySelector("button[data-preview]");
            const orderLink =
              figure.querySelector("a[href^='/chat']")?.href || "";

            return {
              id: Math.random().toString(),
              title,
              imageUrl,
              category,
              price,
              originalPrice,
              previewUrl: previewButton?.dataset?.preview || "",
              orderUrl: orderLink,
            };
          }
        );

        setVideos(videoData);
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
  }, []);

  return { videos, loading, error };
};

export default useVideos;
