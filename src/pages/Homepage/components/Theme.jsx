import { useState, useEffect, useMemo } from "react";
import { Eye, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import useTheme from "../../../hooks/useTheme";
import pricelist from "../../../data/pricelist.json";

const Theme = () => {
  const [itemsToShow, setItemsToShow] = useState(6); // Show 6 items by default
  const [loadingMore, setLoadingMore] = useState(false);

  // Use the custom theme hook
  const {
    rawThemes,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    withPhoto,
    setWithPhoto,
  } = useTheme();

  // Transform and process themes from API
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

  // Set default category to "3D Motion" on initial load
  useEffect(() => {
    if (themes.length > 0 && !selectedCategory) {
      setSelectedCategory("3D Motion");
    }
  }, [themes, selectedCategory, setSelectedCategory]);

  // For text animation only - now using Wedding, Khitan, Aqiqah
  const [animatedCategory, setAnimatedCategory] = useState("Wedding");
  const animationCategories = [
    "Wedding/Pernikahan",
    "Engagement/Lamaran",
    "Ulang Tahun",
    "Khitan",
    "Aqiqah",
  ];

  // Auto rotate text category every second with specified values
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedCategory((current) => {
        const currentIndex = animationCategories.indexOf(current);
        const nextIndex = (currentIndex + 1) % animationCategories.length;
        return animationCategories[nextIndex];
      });
    }, 1000);

    return () => clearInterval(timer);
  });

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

  // Filter themes by selected category and photo option
  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      // Filter by theme type category
      let matchesCategory = theme.theme_type === selectedCategory;

      // Filter by photo option (changed to match Pricelist)
      let matchesPhotoOption = withPhoto ? theme.has_photo : !theme.has_photo;

      return matchesCategory && matchesPhotoOption;
    });
  }, [themes, selectedCategory, withPhoto]);

  // Get the subset of themes to display
  const displayedThemes = useMemo(() => {
    return filteredThemes.slice(0, itemsToShow);
  }, [filteredThemes, itemsToShow]);

  // Check if there are more items to load
  const hasMoreItems = itemsToShow < filteredThemes.length;

  // Handle loading more items
  const handleLoadMore = () => {
    if (!hasMoreItems) return;

    setLoadingMore(true);

    // Simulate network delay
    setTimeout(() => {
      setItemsToShow((prev) => prev + 6);
      setLoadingMore(false);
    }, 500);
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

  // Function to create enhanced WhatsApp message with price - EXACTLY like ThemeList
  const createWhatsAppMessage = (theme) => {
    const price = getThemePrice(theme.theme_type, theme.has_photo);

    const message = `Halo Minmo, saya ingin pesan undangan digital Tema: ${
      theme.name
    }, dengan Harga Diskon: ${formatCurrency(price.discount)}`;

    return encodeURIComponent(message);
  };

  if (loading) {
    return (
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 flex justify-center">
            <div className="h-6 w-48 animate-pulse rounded-full bg-gray-200"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
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
    <section className="py-20 sm:py-28 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-4">
            Pilihan Tema Unggulan
          </h2>
          <p className="font-secondary text-[#3F4D34]/80 text-base sm:text-lg max-w-3xl mx-auto mb-8">
            Rayakan Momen{" "}
            <span key={animatedCategory} className="font-semibold">
              {animatedCategory}
            </span>{" "}
            dengan koleksi tema eksklusif yang menawan
          </p>
        </div>

        {/* Category and Photo Option Filters */}
        <div className="mb-10 space-y-6">
          {/* First Level Filters - Theme Type Category Pills - Center aligned */}
          <div className="relative mb-8 overflow-hidden">
            <div className="overflow-x-scroll touch-pan-x pb-4">
              <div className="flex justify-center gap-2 px-4 min-w-max">
                {themeTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedCategory(type);
                      // Reset items to show when changing category
                      setItemsToShow(6);
                    }}
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
                  onClick={() => setWithPhoto(true)}
                >
                  Dengan Foto
                </button>
                <button
                  className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                    !withPhoto
                      ? "bg-[#3F4D34] text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  onClick={() => setWithPhoto(false)}
                >
                  Tanpa Foto
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Themes Grid - With badges and hover effects - */}
        {filteredThemes.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-7">
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

                  {/* Category badge  */}
                  <div className="absolute top-1 left-1 md:top-2.5 md:left-3 lg:top-3 lg:left-4">
                    <span className="inline-block min-w-20 text-center bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {theme.category_type}
                    </span>
                  </div>

                  {/* Overlay - Just black overlay, no zoom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Content on hover */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-2 sm:p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 z-20">
                    <h3 className="font-secondary text-sm sm:text-base md:text-lg text-white mb-2 sm:mb-3 text-center">
                      {theme.name}
                    </h3>
                    <div className="flex gap-1.5 sm:gap-2 w-full">
                      <a
                        href={theme.preview_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-1 rounded-full bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-secondary text-[#3F4D34] transition-all duration-200 hover:bg-[#3F4D34] hover:text-white hover:shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Preview</span>
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?phone=6285179897917&text=${createWhatsAppMessage(
                          theme
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center space-x-1 rounded-full bg-[#128C7E] px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs font-secondary text-white transition-all duration-200 hover:bg-[#0a6e5c] hover:shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MessageCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        <span>Pesan</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            {hasMoreItems && (
              <div className="mt-12 flex justify-center">
                <Link
                  to="/tema?category=3D+Motion&withphoto=true"
                  className="px-8 py-3 bg-[#3F4D34] text-white rounded-full font-secondary transition-all duration-300 hover:bg-[#2c3823] focus:outline-none focus:ring-2 focus:ring-[#3F4D34] focus:ring-opacity-50 shadow-md hover:shadow-lg inline-flex items-center"
                >
                  <span className="flex items-center">Lihat Semua Tema</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <p className="text-[#3F4D34]/80 font-secondary text-lg mb-2">
              Tidak ada tema tersedia untuk kategori ini
            </p>
            <p className="text-gray-500 text-sm max-w-md mx-auto">
              Silakan pilih kategori tema yang berbeda
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Theme;
