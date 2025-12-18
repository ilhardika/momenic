import { useState, useEffect, useCallback } from "react";
import themeData from "../data/theme.json";

const PER_PAGE = 12;

const useTheme = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [withPhoto, setWithPhoto] = useState(true);

  // Load themes from JSON file
  const loadThemes = useCallback(() => {
    try {
      setLoading(true);
      setError(null);

      // Process themes from JSON
      const processedThemes = themeData.map((theme) => {
        const themeName = theme.name || "";
        const hasPhoto = !themeName.includes("(Tanpa Foto)");

        return {
          id: theme.ID,
          name: themeName,
          category:
            typeof theme.category === "object"
              ? theme.category?.title || "Uncategorized"
              : theme.category_name || "Uncategorized",
          image: theme.thumbnail || "",
          demoUrl: theme.preview || "#",
          withPhoto: hasPhoto,
          price: 0,
          description: "",
        };
      });

      setThemes(processedThemes);
    } catch (err) {
      console.error("❌ [useTheme] Error loading themes:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThemes();
  }, [loadThemes]);

  // Filter themes based on withPhoto parameter
  const filteredThemes = useCallback(() => {
    let filtered = [...themes];

    // Filter by withPhoto
    filtered = filtered.filter((theme) => theme.withPhoto === withPhoto);

    return filtered;
  }, [themes, withPhoto]);

  const displayedThemes = filteredThemes();
  const totalPages = Math.ceil(displayedThemes.length / PER_PAGE);
  const paginatedThemes = displayedThemes.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE
  );

  // Get unique categories
  const categories = useCallback(() => {
    const uniqueCategories = [
      ...new Set(themes.map((theme) => theme.category)),
    ];
    return uniqueCategories.sort();
  }, [themes]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, withPhoto]);

  return {
    themes: paginatedThemes,
    allThemes: displayedThemes,
    rawThemes: themes, // Add raw unfiltered themes
    loading,
    error,
    page,
    setPage,
    totalPages,
    selectedCategory,
    setSelectedCategory,
    withPhoto,
    setWithPhoto,
    categories: categories(),
    refetch: loadThemes,
  };
};

export default useTheme;
