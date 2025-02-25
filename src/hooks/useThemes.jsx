import { useState, useEffect } from "react";
import axios from "axios";

const useThemes = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0); // 0 means all categories
  const themesPerPage = 8;

  // Updated categories array without category 3 and with proper names
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

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://satumomen.com/api/themes");
        console.log("API Response:", response.data); // Debug log
        setThemes(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("API Error:", err); // Debug log
        setError("Failed to fetch themes");
        setThemes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filterThemesByName = (themes, query) => {
    if (!Array.isArray(themes)) return [];
    if (!query.trim()) return themes;

    const searchQuery = query.toLowerCase().trim();

    return themes
      .map((theme) => {
        const themeName = theme.name.toLowerCase();
        const themeSlug = theme.slug.toLowerCase();

        // Calculate match score
        let score = 0;

        // Exact match gets highest score
        if (themeName === searchQuery || themeSlug === searchQuery) {
          score = 1;
        }
        // Starts with search query
        else if (themeName.startsWith(searchQuery)) {
          score = 0.8;
        }
        // Contains search query as a word
        else if (
          themeName.includes(` ${searchQuery}`) ||
          themeName.includes(`${searchQuery} `)
        ) {
          score = 0.6;
        }
        // Contains search query anywhere
        else if (themeName.includes(searchQuery)) {
          score = 0.4;
        }

        return {
          ...theme,
          searchScore: score,
        };
      })
      .filter((theme) => theme.searchScore > 0) // Only keep matches
      .sort((a, b) => b.searchScore - a.searchScore); // Sort by relevance
  };

  const filterThemes = (themes, query, categoryId) => {
    let filtered = [...themes];

    // Filter by category first
    if (categoryId > 0) {
      filtered = filtered.filter((theme) => theme.category_id === categoryId);
    }

    // Then apply search filter if there's a query
    if (query.trim()) {
      filtered = filterThemesByName(filtered, query);
    }

    return filtered;
  };

  // Update filtered themes to use both search and category filters
  const filteredThemes = filterThemes(
    themes,
    debouncedSearchQuery,
    selectedCategory
  );

  const indexOfLastTheme = currentPage * themesPerPage;
  const indexOfFirstTheme = indexOfLastTheme - themesPerPage;
  const currentThemes = filteredThemes.slice(
    indexOfFirstTheme,
    indexOfLastTheme
  );
  const totalPages = Math.ceil(filteredThemes.length / themesPerPage);

  return {
    themes: currentThemes,
    loading,
    error,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    totalPages,
    hasResults: filteredThemes.length > 0,
    selectedCategory,
    setSelectedCategory,
    categories,
  };
};

export default useThemes;
