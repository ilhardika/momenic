import { useState, useEffect } from "react";
import axios from "axios";

const CACHE_KEY = "themes-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;

const useThemes = () => {
  const [themes, setThemes] = useState(() => {
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
  const [loading, setLoading] = useState(!themes.length);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Categories
  const categories = [
    { id: 0, name: "All Categories" },
    { id: 1, name: "Wedding" },
    { id: 2, name: "Kids & Birthday" },
    { id: 4, name: "Aqiqah & Tasmiyah" },
    { id: 5, name: "Tasyakuran Khitan" },
    { id: 6, name: "Umum & Seminar" },
    { id: 7, name: "Christmas & New Year" },
    { id: 8, name: "Syukuran & Islami" },
    { id: 9, name: "Party & Dinner" },
    { id: 10, name: "School & Graduation" },
  ];

  // Filter themes based on search and category
  const filteredThemes = themes.filter((theme) => {
    if (selectedCategory !== 0 && theme.category_id !== selectedCategory) {
      return false;
    }
    if (!searchQuery) return true;

    return theme.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate total pages from filtered results
  const totalPages = Math.ceil(filteredThemes.length / PER_PAGE);

  // Get paginated themes
  const paginatedThemes = filteredThemes.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setThemes(data);
            setLoading(false);
            return;
          }
        }

        setLoading(true);

        // Add timeout to request
        const response = await axios.get("https://satumomen.com/api/themes", {
          timeout: 5000,
          headers: {
            Accept: "application/json",
            "Cache-Control": "max-age=3600",
          },
        });

        const themesData = response.data.data || [];

        // Cache the results
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            data: themesData,
            timestamp: Date.now(),
          })
        );

        setThemes(themesData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch themes:", err);
        setError("Gagal memuat tema");

        // Try to use stale cache if available
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setThemes(data);
        }
      } finally {
        setLoading(false);
      }
    };

    if (!themes.length) {
      fetchThemes();
    }
  }, []);

  return {
    themes: paginatedThemes,
    loading,
    error,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    totalPages,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};

export default useThemes;
