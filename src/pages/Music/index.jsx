import { useState, useEffect } from "react";
import { useMusic } from "../../hooks/useMusic";
import {
  Play,
  Pause,
  AlertCircle,
  RefreshCw,
  Search as SearchIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const Music = () => {
  const { musicList, loading, error, refreshMusic } = useMusic();
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [audio] = useState(new Audio());
  const [search, setSearch] = useState("");
  const [filteredMusic, setFilteredMusic] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Handle search filtering
  useEffect(() => {
    if (!musicList) return;

    if (!search.trim()) {
      setFilteredMusic(musicList);
    } else {
      const searchLower = search.toLowerCase();
      const filtered = musicList.filter(
        (music) =>
          music.title.toLowerCase().includes(searchLower) ||
          music.category.toLowerCase().includes(searchLower)
      );
      setFilteredMusic(filtered);
    }
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [search, musicList]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
      }
    };
  }, []);

  const handlePlayMusic = (musicUrl) => {
    if (currentPlaying === musicUrl) {
      // If the same song is clicked, pause it
      audio.pause();
      setCurrentPlaying(null);
    } else {
      // If a different song is clicked, play it
      audio.src = musicUrl;
      audio.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
      setCurrentPlaying(musicUrl);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredMusic.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredMusic.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination controls
  const goToPage = (page) => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="pt-40 container mx-auto max-w-5xl px-4">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <div className="animate-pulse mb-4">
            <div className="h-6 bg-[#3F4D34]/20 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-[#3F4D34] font-secondary">
            Sedang memuat list lagu, mohon tunggu beberapa detik
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-40 mb-8 container mx-auto max-w-5xl px-4">
        <div className="p-4 border border-red-500 rounded-lg bg-red-50 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={refreshMusic}
            className="ml-4 px-3 py-1 border border-red-500 rounded text-red-500 hover:bg-red-100 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-1" /> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-40 container mx-auto max-w-5xl px-4">
      {/* Hero Section */}
      <div className="mb-8">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Koleksi Musik untuk Background Undangan Digital
          </h2>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Pilih musik yang sempurna untuk mempercantik undangan digital Anda,
            menciptakan suasana yang sesuai dengan tema dan momen spesial Anda.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari musik..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3F4D34] focus:border-transparent"
          />
        </div>

        {/* Results count */}
        <div className="text-sm text-center text-[#3F4D34]/60 mb-4">
          {filteredMusic.length > 0 && (
            <span>Menampilkan {filteredMusic.length} lagu</span>
          )}
        </div>
      </div>

      {/* Empty State Message */}
      {filteredMusic.length === 0 && (
        <div className="text-center py-8 bg-white rounded-lg">
          <p className="text-[#3F4D34]/80 font-secondary">
            {search
              ? `Tidak ada musik yang cocok dengan pencarian "${search}"`
              : "Tidak ada musik tersedia saat ini"}
          </p>
        </div>
      )}

      {/* Music List */}
      {filteredMusic.length > 0 && (
        <>
          <div className="space-y-2 bg-white rounded-lg overflow-hidden">
            {currentItems.map((music, index) => (
              <div
                key={index}
                className="group hover:bg-gray-50 p-3 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handlePlayMusic(music.musicUrl)}
                    className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                      currentPlaying === music.musicUrl
                        ? "bg-[#3F4D34] text-white"
                        : "bg-[#3F4D34]/10 text-[#3F4D34] hover:bg-[#3F4D34] hover:text-white"
                    }`}
                  >
                    {currentPlaying === music.musicUrl ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <h6 className="font-secondary text-base text-[#3F4D34] font-medium truncate">
                      {music.title}
                    </h6>
                    <p className="text-xs text-gray-500 font-secondary">
                      {music.category}
                    </p>
                  </div>
                  {currentPlaying === music.musicUrl && (
                    <div className="text-xs text-[#3F4D34] font-medium">
                      Sedang diputar
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between mt-6 p-4 bg-white rounded-lg">
              <div className="flex space-x-1">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 rounded ${
                    currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#3F4D34] hover:bg-gray-100"
                  }`}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Page numbers - show max 5 page numbers with ellipsis */}
                <div className="flex items-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Calculate which page numbers to show
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={i}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded ${
                          currentPage === pageNum
                            ? "bg-[#3F4D34] text-white"
                            : "text-[#3F4D34] hover:bg-gray-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded ${
                    currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-[#3F4D34] hover:bg-gray-100"
                  }`}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Music;
