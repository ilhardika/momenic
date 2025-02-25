import  { useState } from "react";
import { Eye, MessageCircle, Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import useThemes from "../../../hooks/useThemes";

// ThemeCard Component
const ThemeCard = ({ theme }) => {
  // Extract theme name from featured_image URL
  const getThemeSlug = (url) => {
    const match = url.match(/themes\/([^/]+)/);
    return match ? match[1] : "";
  };

  // Generate preview URL
  const previewUrl = `https://momenic.webinvit.id/preview/${getThemeSlug(
    theme.featured_image
  )}`;

  // Generate WhatsApp URL
  const whatsappUrl = `https://api.whatsapp.com/send?phone=6285179897917&text=Halo Minmo, saya ingin pesan undangan digital tema ${theme.name}`;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="aspect-square overflow-hidden">
        <img
          src={theme.featured_image}
          alt={theme.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content - Adjusted padding and button sizes for mobile */}
      <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <h3 className="font-secondary text-base sm:text-lg text-white mb-2 sm:mb-4 text-center">
          {theme.name}
        </h3>
        <div className="flex gap-1.5 sm:gap-2 w-full">
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center space-x-1 sm:space-x-2 rounded-full bg-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-secondary text-[#3F4D34] transition-colors hover:bg-[#3F4D34] hover:text-white"
          >
            <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Preview</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center space-x-1 sm:space-x-2 rounded-full bg-[#128C7E] px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-secondary text-white transition-colors hover:bg-[#2d5c56]"
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>Pesan</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// Theme Component
const Theme = () => {
  const {
    themes,
    loading,
    error,
    selectedCategory,
    setSelectedCategory,
    categories,
  } = useThemes();

  // Set Wedding as default category on mount
  React.useEffect(() => {
    setSelectedCategory(1); // 1 is Wedding category ID
  }, []); // Empty dependency array means this runs once on mount

  // For text animation only
  const [animatedCategory, setAnimatedCategory] = useState(1); // Default to Wedding

  const displayCategories = categories.filter((category) => category.id !== 0);

  // Get current category name for chip selection
  const currentCategory =
    categories.find((cat) => cat.id === selectedCategory)?.name || "Wedding";

  // Get animated category name for text
  const animatedCategoryName =
    categories.find((cat) => cat.id === animatedCategory)?.name || "Wedding";

  // Auto rotate text category every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedCategory((current) => {
        const categoryIds = displayCategories.map((cat) => cat.id);
        const currentIndex = categoryIds.indexOf(current);
        const nextIndex = (currentIndex + 1) % categoryIds.length;
        return categoryIds[nextIndex];
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [displayCategories]);

  // Filter themes by selected category (not animated category)
  const filteredThemes = themes
    .filter((theme) => theme.category_id === selectedCategory)
    .slice(0, 6);

  if (loading) {
    return (
      <section className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;

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
            <span key={animatedCategoryName} className="font-semibold">
              {animatedCategoryName}
            </span>{" "}
            tersedia lebih dari 450+ koleksi tema eksklusif yang menawan
          </p>
        </div>

        {/* Search and Category Filter */}
        <div className="mb-8">
          {/* Category Chips with horizontal scroll */}
          <div className="relative mb-8 overflow-hidden">
            <div className="overflow-x-scroll touch-pan-x pb-4">
              <div className="flex gap-2 px-4 min-w-max">
                {displayCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full font-secondary text-sm transition-all duration-300 whitespace-nowrap
                      ${
                        selectedCategory === category.id
                          ? "bg-[#3F4D34] text-white"
                          : "bg-[#3F4D34]/10 text-[#3F4D34] hover:bg-[#3F4D34]/20"
                      }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient overlays to indicate scroll */}
            <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </div>
        </div>
        {/* Themes Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredThemes.map((theme) => (
            <ThemeCard key={theme.id} theme={theme} />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Link
            to="/tema"
            className="inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-full bg-[#3F4D34] text-white font-secondary text-sm sm:text-base hover:bg-[#2d3a26] transition-colors duration-300"
          >
            <span>Lihat 450+ Tema Lainnya</span>
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Theme;
