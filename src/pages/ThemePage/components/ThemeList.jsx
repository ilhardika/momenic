import React, { useState, useEffect, useMemo } from "react";
import { Eye, MessageCircle, Search as SearchIcon } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Search from "../../../components/Search";
import themeData from "../../../data/theme.json";
import pricelist from "../../../data/pricelist.json";

const ThemeList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get initial values from URL params or use defaults
  const initialCategory = searchParams.get("category") || "3D Motion";
  const initialPhotoValue = searchParams.get("withphoto") !== "false"; // true by default unless explicitly set to false
  const initialSearchQuery = searchParams.get("search") || "";

  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [withPhoto, setWithPhoto] = useState(initialPhotoValue);
  const [itemsToShow, setItemsToShow] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Process theme data on component mount
  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      // Transform the data directly without the complex processing
      const transformedThemes = themeData.map((theme, index) => {
        const id = theme.ID || `theme-${index}`;
        const previewUrl = theme.preview || "";

        // Transform the URL from the.invisimple.id to momenic.invisimple.id
        const modifiedPreviewUrl = previewUrl.replace(
          "the.invisimple.id",
          "momenic.invisimple.id"
        );

        // Extract theme type for categorization
        const name = theme.name || "";
        let themeType = "3D Motion";

        if (name.startsWith("3D Motion")) {
          themeType = "3D Motion";
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
        const hasPhoto = !name.includes("(Tanpa Foto)");

        return {
          id,
          name,
          featured_image:
            theme.thumbnail ||
            `https://via.placeholder.com/600x600?text=${name.replace(
              /\s+/g,
              "+"
            )}`,
          preview_url: modifiedPreviewUrl,
          category_id: theme.category?.id?.toString() || "1",
          category_name: theme.category?.title || "Pernikahan",
          category_type: theme.category?.type || "Tema general",
          theme_type: themeType,
          has_photo: hasPhoto,
          slug: name.toLowerCase().replace(/\s+/g, "").replace(/[()]/g, ""),
        };
      });

      setThemes(transformedThemes);
      setLoading(false);

      // If there's a name parameter, find and select the specific theme
      const nameParam = searchParams.get("name");
      if (nameParam) {
        const matchedTheme = transformedThemes.find(
          (theme) => theme.slug === nameParam.toLowerCase()
        );

        if (matchedTheme) {
          setSelectedCategory(matchedTheme.theme_type);
          setWithPhoto(matchedTheme.has_photo);
        }
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [searchParams]);

  // Define theme types in the specific order requested
  const themeTypes = useMemo(() => {
    // Fixed order as specified
    const orderedTypes = [
      "3D Motion",
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
    return themes.filter((theme) => {
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
  }, [themes, searchQuery, selectedCategory, withPhoto]);

  // Get the subset of themes to display
  const displayedThemes = useMemo(() => {
    return filteredThemes.slice(0, itemsToShow);
  }, [filteredThemes, itemsToShow]);

  // Check if there are more items to load
  const hasMoreItems = itemsToShow < filteredThemes.length;

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedCategory) {
      params.set("category", selectedCategory);
    }

    params.set("withphoto", withPhoto.toString());

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

  // Handle direct theme selection
  const handleThemeSelect = (theme) => {
    // Create a shareable URL for this specific theme
    const params = new URLSearchParams();
    params.set("name", theme.slug);
    params.set("category", theme.theme_type);
    params.set("withphoto", theme.has_photo.toString());
    navigate(`/tema?${params.toString()}`);
  };

  // New function to get theme price information
  const getThemePrice = (themeType, hasPhoto) => {
    const priceInfo = pricelist.pricelist.find(
      (item) => item.theme === themeType
    );

    if (!priceInfo) return { discount: 0, original: 0 };

    if (hasPhoto) {
      return {
        discount: priceInfo.discountPrice || 0,
        original: priceInfo.originalPrice || 0,
      };
    } else {
      return {
        discount: priceInfo.withoutPhoto?.discountPrice || 0,
        original: priceInfo.withoutPhoto?.originalPrice || 0,
      };
    }
  };

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to create enhanced WhatsApp message with price
  const createWhatsAppMessage = (theme) => {
    const price = getThemePrice(theme.theme_type, theme.has_photo);

    const message = `Halo Minmo, saya ingin pesan undangan digital Tema: ${theme.name}, dengan Harga Diskon: ${formatCurrency(price.discount)}`;

    return encodeURIComponent(message);
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
                <div
                  key={theme.id}
                  className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg"
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={theme.featured_image}
                      alt={theme.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Theme type badge */}
                  <div className="absolute top-2 left-2.5">
                    <span className="inline-block min-w-20 text-center bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {theme.category_type}
                    </span>
                  </div>

                  {/* Overlay - Just black overlay, no zoom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 z-20">
                    <h3 className="font-secondary text-base sm:text-lg text-white mb-3 sm:mb-4 text-center">
                      {theme.name}
                    </h3>
                    <div className="flex gap-2 sm:gap-3 w-full">
                      <a
                        href={theme.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-1 sm:space-x-2 rounded-full bg-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-secondary text-[#3F4D34] transition-all duration-200 hover:bg-[#3F4D34] hover:text-white hover:shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Preview</span>
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?phone=6285179897917&text=${createWhatsAppMessage(
                          theme
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-1 sm:space-x-2 rounded-full bg-[#128C7E] px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-secondary text-white transition-all duration-200 hover:bg-[#0a6e5c] hover:shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        <span>Pesan</span>
                      </a>
                    </div>
                  </div>

                  {/* Clickable overlay for direct theme URLs - Move this below buttons */}
                  <button
                    onClick={() => handleThemeSelect(theme)}
                    className="absolute inset-0 z-10 opacity-0"
                    aria-label={`Select ${theme.name}`}
                  />
                </div>
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
