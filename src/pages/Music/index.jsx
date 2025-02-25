import React, { useRef, useEffect, useState } from "react";
import useMusic from "../../hooks/useMusic";
import MusicPlayer from "./components/MusicPlayer";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

function Music() {
  const { musics, loading, error, currentPlaying, setCurrentPlaying } =
    useMusic();
  const audioRef = useRef(new Audio());
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Audio control effect
  useEffect(() => {
    const audio = audioRef.current;

    if (currentPlaying) {
      audio.src = currentPlaying.musicUrl;
      audio.play();
    } else {
      audio.pause();
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [currentPlaying]);

  const handlePlayPause = (music) => {
    if (currentPlaying?.id === music.id) {
      setCurrentPlaying(null);
    } else {
      setCurrentPlaying(music);
    }
  };

  // Filter musics based on search
  const filteredMusics = musics.filter(
    (music) =>
      music.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      music.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMusics.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMusics = filteredMusics.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Maximum number of visible page buttons
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust if current page is near the start
      if (currentPage <= halfVisible + 1) {
        endPage = maxVisible - 1;
      }

      // Adjust if current page is near the end
      if (currentPage >= totalPages - halfVisible) {
        startPage = totalPages - maxVisible + 2;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="py-20 sm:py-28 my-16">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="space-y-4 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-20 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 sm:py-28 my-16">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="text-red-500 font-secondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-28 my-16">
      {/* Hero Section */}
      <div className="relative mb-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Pilihan Musik Undangan
          </h1>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Temukan musik yang sempurna untuk momen spesialmu
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 mb-8">
        <div className="container mx-auto max-w-3xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari musik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pr-12 rounded-full border border-[#3F4D34]/20 
                       focus:outline-none focus:border-[#3F4D34]/40 
                       font-secondary text-[#3F4D34]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3F4D34]/40" />
          </div>
        </div>
      </div>

      {/* Music List with Pagination */}
      <div className="px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="space-y-2 mb-8">
            {paginatedMusics.map((music) => (
              <MusicPlayer
                key={music.id}
                music={music}
                isPlaying={currentPlaying?.id === music.id}
                onPlayPause={handlePlayPause}
              />
            ))}
          </div>

          {/* Updated Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  currentPage === 1
                    ? "text-[#3F4D34]/40 cursor-not-allowed"
                    : "text-[#3F4D34] hover:bg-[#3F4D34]/10"
                }`}
                aria-label="Previous page"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-1">
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="px-2 text-[#3F4D34]/60"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[2rem] h-8 rounded-full font-secondary text-sm transition-colors duration-200
                        ${
                          currentPage === page
                            ? "bg-[#3F4D34] text-white"
                            : "text-[#3F4D34] hover:bg-[#3F4D34]/10"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  currentPage === totalPages
                    ? "text-[#3F4D34]/40 cursor-not-allowed"
                    : "text-[#3F4D34] hover:bg-[#3F4D34]/10"
                }`}
                aria-label="Next page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Music;
