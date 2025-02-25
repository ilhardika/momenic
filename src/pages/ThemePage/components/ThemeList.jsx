import { Eye, MessageCircle, Search } from "lucide-react";
import useThemes from "../../../hooks/useThemes.jsx";

const ThemeList = () => {
  const {
    themes,
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
  } = useThemes();

  // Extract theme name from featured_image URL
  const getThemeSlug = (url) => {
    const match = url.match(/themes\/([^/]+)/);
    return match ? match[1] : "";
  };

  if (loading) {
    return (
      <section className="px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[...Array(12)].map(
              (
                _,
                i // Changed from 8 to 12
              ) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gray-200"
                />
              )
            )}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;

  return (
    <div className="px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Cari tema undangan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pr-12 rounded-full border border-[#3F4D34]/20 
                       focus:outline-none focus:border-[#3F4D34]/40 
                       font-secondary text-[#3F4D34]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3F4D34]/40" />
          </div>

          {/* Category Pills */}
          <div className="relative mb-8 overflow-hidden">
            <div className="overflow-x-scroll touch-pan-x pb-4">
              <div className="flex gap-2 px-4 min-w-max">
                {categories.map((category) => (
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

        {/* Theme Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {themes.slice((currentPage - 1) * 14, currentPage * 12).map(
            (
              theme // Added slice to show 12 items per page
            ) => (
              <div
                key={theme.id}
                className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={theme.featured_image}
                    alt={theme.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <h3 className="font-secondary text-base sm:text-lg text-white mb-2 sm:mb-4 text-center">
                    {theme.name}
                  </h3>
                  <div className="flex gap-1.5 sm:gap-2 w-full">
                    <a
                      href={`https://momenic.webinvit.id/preview/${getThemeSlug(
                        theme.featured_image
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center space-x-1 sm:space-x-2 rounded-full bg-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-secondary text-[#3F4D34] transition-colors hover:bg-[#3F4D34] hover:text-white"
                    >
                      <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Preview</span>
                    </a>
                    <a
                      href={`https://api.whatsapp.com/send?phone=6285179897917&text=Halo Minmo, saya ingin pesan undangan digital tema ${theme.name}`}
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
            )
          )}
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-3">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-6 py-2 rounded-full border border-[#3F4D34] text-[#3F4D34] font-secondary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-[#3F4D34] hover:text-white transition-colors"
          >
            Previous
          </button>
          <div className="flex items-center px-4 font-secondary text-[#3F4D34]">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-6 py-2 rounded-full border border-[#3F4D34] text-[#3F4D34] font-secondary
                     disabled:opacity-50 disabled:cursor-not-allowed
                     hover:bg-[#3F4D34] hover:text-white transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeList;
