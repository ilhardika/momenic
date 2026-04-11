import { useState, useEffect, useMemo } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Search from "../../../components/Search";
import ThemeCard from "../../../components/ThemeCard";
import useTheme from "../../../hooks/useTheme";

const ThemeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get initial values from URL params or use defaults
  const initialCategory = searchParams.get("category") || "3D Motion";
  const initialPhotoValue = searchParams.get("withphoto") !== "false"; // true by default unless explicitly set to false
  const initialSearchQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Use the custom theme hook
  const {
    rawThemes, // Now using the correct unfiltered themes
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    withPhoto,
    setWithPhoto,
    categories,
    refetch,
  } = useTheme();

  // Transform and process themes from local JSON
  const themes = useMemo(() => {
    return rawThemes.map((theme) => {
      const name = theme.name || "";
      const previewUrl = theme.demoUrl || "";

      // Transform the URL from the.invisimple.id to momenic.invisimple.id
      const modifiedPreviewUrl = previewUrl.replace(
        "the.invisimple.id",
        "momenic.invisimple.id"
      );

      // Extract theme type for categorization
      let themeType = theme.category || "3D Motion";
      if (name.startsWith("3D Motion")) {
        themeType = "3D Motion";
      } else if (name.startsWith("Interaktif")) {
        themeType = "Interaktif";
      } else if (name.startsWith("Art")) {
        themeType = "Art";
      } else if (name.startsWith("Luxury")) {
        themeType = "Luxury";
      } else if (name.startsWith("Special")) {
        themeType = "Special";
      } else if (name.startsWith("Aqiqah")) {
        themeType = "Aqiqah";
      } else if (name.startsWith("Khitan")) {
        themeType = "Khitan";
      }

      // Determine if it has photo or not
      const hasPhoto =
        theme.withPhoto !== false && !name.includes("(Tanpa Foto)");

      return {
        id: theme.id,
        name,
        featured_image:
          theme.image ||
          `https://via.placeholder.com/600x600?text=${name.replace(
            /\s+/g,
            "+"
          )}`,
        preview_url: modifiedPreviewUrl,
        category_id: theme.id?.toString() || "1",
        category_name: theme.category || "Pernikahan",
        category_type: theme.category || "Tema general",
        theme_type: themeType,
        has_photo: hasPhoto,
        slug: name.toLowerCase().replace(/\s+/g, "").replace(/[()]/g, ""),
        description: theme.description || "",
      };
    });
  }, [rawThemes]);

  // Add console log after processing themes
  useEffect(() => {}, [themes]);

  // Initialize category from URL param and ensure default category is always in URL
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlWithPhoto = searchParams.get("withphoto");

    // If no category in URL, redirect to default category
    if (!urlCategory) {
      const params = new URLSearchParams();
      params.set("category", "3D Motion");
      params.set("withphoto", urlWithPhoto || "true");
      navigate(`/tema?${params.toString()}`, { replace: true });
    } else {
      // Sync selectedCategory with URL category
      setSelectedCategory(urlCategory);
    }
  }, [searchParams, setSelectedCategory, navigate]);

  // If there's a name parameter, find and select the specific theme
  useEffect(() => {
    const nameParam = searchParams.get("name");
    if (nameParam && themes.length > 0) {
      const matchedTheme = themes.find(
        (theme) => theme.slug === nameParam.toLowerCase()
      );

      if (matchedTheme) {
        setSelectedCategory(matchedTheme.theme_type);
        setWithPhoto(matchedTheme.has_photo);
      }
    }
  }, [searchParams, themes, setSelectedCategory, setWithPhoto]);

  // Define theme types in the specific order requested
  const themeTypes = useMemo(() => {
    // Fixed order as specified
    const orderedTypes = [
      "3D Motion",
      "Interaktif",
      "Art",
      "Luxury",
      "Special",
      "Aqiqah",
      "Khitan",
    ];

    // Filter to only include types that actually exist in the data
    return orderedTypes.filter((type) =>
      themes.some((theme) => theme.theme_type === type)
    );
  }, [themes]);

  // Check if the current selected category has photo variations
  const hasPhotoVariations = useMemo(() => {
    if (!selectedCategory) return false;

    const categoryThemes = themes.filter(
      (theme) => theme.theme_type === selectedCategory
    );

    const hasWithPhoto = categoryThemes.some((theme) => theme.has_photo);
    const hasWithoutPhoto = categoryThemes.some((theme) => !theme.has_photo);

    return hasWithPhoto && hasWithoutPhoto;
  }, [themes, selectedCategory]);

  // Filter themes based on search query, selected category and photo option
  const filteredThemes = useMemo(() => {
    const filtered = themes.filter((theme) => {
      // Filter by search query (search in both name and category_type)
      const nameMatches = theme.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const categoryTypeMatches = theme.category_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSearch = nameMatches || categoryTypeMatches;

      // Filter by theme type category
      let matchesCategory = true;
      if (selectedCategory) {
        matchesCategory = theme.theme_type === selectedCategory;
      }

      // Filter by photo option
      let matchesPhotoOption = withPhoto ? theme.has_photo : !theme.has_photo;

      return matchesSearch && matchesCategory && matchesPhotoOption;
    });

    return filtered;
  }, [themes, searchQuery, selectedCategory, withPhoto]);

  // Get the subset of themes to display
  const displayedThemes = useMemo(() => {
    const displayed = filteredThemes.slice(0, itemsToShow);

    return displayed;
  }, [filteredThemes, itemsToShow]);

  // Check if there are more items to load
  const hasMoreItems = itemsToShow < filteredThemes.length;

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    if (withPhoto !== null) {
      params.set("withphoto", withPhoto.toString());
    }

    if (searchQuery) {
      params.set("search", searchQuery);
    }

    setSearchParams(params);
  }, [selectedCategory, withPhoto, searchQuery, setSearchParams]);

  // Handle loading more items
  const handleLoadMore = () => {
    if (!hasMoreItems) return;

    setLoadingMore(true);

    // Simulate network delay
    setTimeout(() => {
      setItemsToShow((prev) => prev + 12);
      setLoadingMore(false);
    }, 500);
  };

  // Reset items to show when category or search changes
  useEffect(() => {
    setItemsToShow(12);
  }, [selectedCategory, searchQuery, withPhoto]);

  // Handle search
  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    // When changing category, reset to default "with photo" state
    setWithPhoto(true);
    setSelectedCategory(category);
  };

  // Handle photo option toggle
  const handlePhotoToggle = (hasPhoto) => {
    setWithPhoto(hasPhoto);
  };



  if (loading) {
    return (
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 flex justify-center">
            <div className="h-6 w-48 animate-pulse rounded-full bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <div className="aspect-square rounded-2xl bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-2/3 mx-auto rounded-full bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-1/2 mx-auto rounded-full bg-gray-200 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-200">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-red-200 text-red-600 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <p className="text-red-800 font-secondary text-lg mb-2">
              Gagal Memuat Tema
            </p>
            <p className="text-red-600 text-sm max-w-md mx-auto mb-4">
              {error}
            </p>
            <button
              onClick={refetch}
              className="px-6 py-2 bg-red-600 text-white rounded-full font-secondary hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <div className="px-4 py-6">

      <div className="container mx-auto max-w-6xl">
        {/* Search and Filters */}
        <div className="mb-10 space-y-6">
          {/* Search Bar with improved styling */}
          <div className="max-w-xl mx-auto">
            <Search
              onSearch={handleSearch}
              placeholder="Cari tema undangan..."
              debounceTime={300}
              initialValue={searchQuery}
            />
          </div>

          {/* First Level Filters - Theme Type Category Pills - Center aligned */}
          <div className="relative mb-8 overflow-hidden">
            <div className="overflow-x-scroll touch-pan-x pb-4">
              <div className="flex justify-center gap-2 px-4 min-w-max">
                {themeTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleCategorySelect(type)}
                    className={`px-5 py-2.5 rounded-full font-secondary text-sm transition-all duration-300 whitespace-nowrap
                      ${
                        selectedCategory === type
                          ? "bg-[#3F4D34] text-white shadow-md"
                          : "bg-[#3F4D34]/10 text-[#3F4D34] hover:bg-[#3F4D34]/20"
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient overlays to indicate scroll */}
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>

          {/* Photo Toggle - Using same style as Pricelist */}
          {hasPhotoVariations && (
            <div className="flex justify-center">
              <div className="inline-flex items-center bg-white p-1 rounded-full border border-[#E5E7EB] shadow-sm font-secondary">
                <button
                  className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                    withPhoto
                      ? "bg-[#3F4D34] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => handlePhotoToggle(true)}
                >
                  Dengan Foto
                </button>
                <button
                  className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                    !withPhoto
                      ? "bg-[#3F4D34] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => handlePhotoToggle(false)}
                >
                  Tanpa Foto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Empty State Message */}
        {filteredThemes.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gray-200 text-gray-400 rounded-full">
              <SearchIcon size={24} />
            </div>
            <p className="text-[#3F4D34]/80 font-secondary text-lg mb-2">
              {searchQuery
                ? `Tidak ada tema yang cocok dengan pencarian "${searchQuery}"`
                : "Tidak ada tema tersedia untuk kategori ini"}
            </p>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Coba gunakan kata kunci lain atau pilih kategori tema yang berbeda
            </p>
          </div>
        )}

        {/* Theme Grid */}
        {displayedThemes.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-7">
              {displayedThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreItems && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#3F4D34] text-white rounded-full font-secondary transition-all duration-300 hover:bg-[#2c3823] focus:outline-none focus:ring-2 focus:ring-[#3F4D34] focus:ring-opacity-50 disabled:opacity-70 shadow-md hover:shadow-lg"
                >
                  {loadingMore ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Muat Lebih Banyak
                      <span className="ml-2 bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                        {filteredThemes.length - itemsToShow}
                      </span>
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Results Counter */}
            <div className="mt-6 text-center text-sm text-gray-500">
              Menampilkan{" "}
              <span className="font-medium">{displayedThemes.length}</span> dari{" "}
              <span className="font-medium">{filteredThemes.length}</span> tema
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ThemeList;
