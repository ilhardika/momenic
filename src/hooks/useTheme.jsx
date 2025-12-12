import { useState, useEffect, useCallback } from "react";

// For development: Can use direct API with nonce from env
// For production: Use API proxy (Vercel serverless or PHP)
const USE_DIRECT_API = import.meta.env.VITE_USE_DIRECT_API === "true";
const DIRECT_API_URL = "https://the.invisimple.id/wp-admin/admin-ajax.php";
const PROXY_API_URL = "/api/themes";
const API_URL = USE_DIRECT_API ? DIRECT_API_URL : PROXY_API_URL;
const NONCE = import.meta.env.VITE_INVISIMPLE_NONCE || "";

const CACHE_KEY = "theme-data";
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PER_PAGE = 12;

const useTheme = () => {
  const [themes, setThemes] = useState(() => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          return data;
        }
      }
    } catch (error) {
      console.error("Error loading cached themes:", error);
    }
    return [];
  });

  const [loading, setLoading] = useState(!themes.length);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [withPhoto, setWithPhoto] = useState(true); // Default to true instead of null

  // Fetch themes from API - ALWAYS fetch all themes, filter client-side
  const fetchThemes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 [useTheme] Fetching from:", API_URL);
      console.log("🔍 [useTheme] USE_DIRECT_API:", USE_DIRECT_API);

      // Use direct API or proxy based on config
      let response;

      if (USE_DIRECT_API) {
        // Development: Direct API with form-urlencoded
        const formData = new URLSearchParams({
          name: "invitation_get_theme",
          action: "run_wds",
          __nonce: NONCE,
          category: "",
          subcategory: "",
          subtheme: "",
        });

        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            Accept: "application/json, text/javascript, */*; q=0.01",
          },
          body: formData.toString(),
        });
      } else {
        // Production: Use proxy API with JSON
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            category: "",
            subcategory: "",
            subtheme: "",
          }),
        });
      }

      console.log("📥 [useTheme] Response status:", response.status);
      console.log("📥 [useTheme] Response headers:", response.headers);
      console.log(
        "📥 [useTheme] Content-Type:",
        response.headers.get("content-type")
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error(
          "❌ [useTheme] Response is not JSON:",
          text.substring(0, 500)
        );
        throw new Error(
          "API returned HTML instead of JSON. Check .htaccess routing or access /api/themes.php directly"
        );
      }

      const data = await response.json();
      console.log("✅ [useTheme] Data received:", {
        success: data.success,
        hasData: !!data.data,
        dataType: Array.isArray(data.data) ? "array" : typeof data.data,
        dataLength: Array.isArray(data.data) ? data.data.length : "N/A",
      });

      // Check for API errors (like nonce verification failed)
      if (data.success === false) {
        const errorMsg = data.error || data.data || "Unknown error";
        const nonceError =
          data.needsNonceUpdate ||
          (errorMsg.includes && errorMsg.includes("Nonce"))
            ? USE_DIRECT_API
              ? "Nonce expired - please update VITE_INVISIMPLE_NONCE in .env.local"
              : "Nonce expired - please update INVISIMPLE_NONCE in your environment variables (Vercel) or api/config.php (cPanel)"
            : "";
        throw new Error(`API Error: ${errorMsg}. ${nonceError}`);
      }

      // Process the API response based on its structure
      let processedThemes = [];

      if (data.data && Array.isArray(data.data)) {
        processedThemes = data.data.map((theme) => ({
          id: theme.id || theme.ID,
          name: theme.name || theme.post_title,
          category: theme.category || theme.term_name || "Uncategorized",
          image: theme.image || theme.thumbnail || theme.featured_image || "",
          demoUrl: theme.demo_url || theme.preview_url || "#",
          withPhoto: theme.with_photo || theme.withPhoto || false,
          price: theme.price || 0,
          description: theme.description || theme.post_excerpt || "",
        }));
      } else if (Array.isArray(data)) {
        processedThemes = data.map((theme) => {
          const themeName = theme.name || theme.post_title || "";
          // Detect withPhoto dari nama - jika ada "(Tanpa Foto)" maka false
          const hasPhoto = !themeName.includes("(Tanpa Foto)");

          return {
            id: theme.id || theme.ID,
            name: themeName,
            category:
              typeof theme.category === "object"
                ? theme.category?.title ||
                  theme.category?.name ||
                  "Uncategorized"
                : theme.category || theme.term_name || "Uncategorized",
            image: theme.image || theme.thumbnail || theme.featured_image || "",
            demoUrl:
              theme.demo_url || theme.preview_url || theme.preview || "#",
            withPhoto: hasPhoto,
            price: theme.price || 0,
            description: theme.description || theme.post_excerpt || "",
          };
        });
      }

      // Cache the data
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: processedThemes,
          timestamp: Date.now(),
        })
      );

      setThemes(processedThemes);
    } catch (err) {
      console.error("❌ [useTheme] Error fetching themes:", err);
      console.error("❌ [useTheme] Error message:", err.message);
      console.error("❌ [useTheme] Error stack:", err.stack);
      setError(err.message);

      // If fetch fails and we have cached data, use it
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          setThemes(data);
          setError("Using cached data - " + err.message);
        }
      } catch (cacheError) {
        console.error("Error loading cached themes:", cacheError);
      }
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies - only fetch once

  useEffect(() => {
    fetchThemes();
  }, [fetchThemes]);

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
    refetch: fetchThemes,
  };
};

export default useTheme;
