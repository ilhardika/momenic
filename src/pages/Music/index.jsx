import { useState, useEffect } from "react";
import useMusic from "../../hooks/useMusic";
import { Play, Pause } from "lucide-react";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";

function Music() {
  const {
    musics,
    loading,
    error,
    page,
    setPage,
    totalPages,
    search,
    setSearch,
  } = useMusic();
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [countdown, setCountdown] = useState(15);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentlyPlaying?.audio) {
        currentlyPlaying.audio.pause();
        currentlyPlaying.audio = null;
      }
    };
  }, [currentlyPlaying]);

  // Countdown timer for loading state
  useEffect(() => {
    if (!loading || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, countdown]);

  const handlePlay = (musicUrl, id) => {
    // Pause current audio if playing
    if (currentlyPlaying?.audio) {
      currentlyPlaying.audio.pause();
    }

    // Toggle off if clicking the same track
    if (currentlyPlaying?.id === id) {
      setCurrentlyPlaying(null);
      return;
    }

    // Play the new track
    const audio = new Audio(musicUrl);
    audio.addEventListener("ended", () => setCurrentlyPlaying(null));
    audio.addEventListener("error", () => setCurrentlyPlaying(null));

    audio.play().catch((err) => {
      console.error("Failed to play audio:", err);
      setCurrentlyPlaying(null);
    });

    setCurrentlyPlaying({ id, audio });
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-20 sm:py-28 my-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <h2 className="font-primary text-2xl text-[#3F4D34] mb-3">
              Menyiapkan koleksi musik...
            </h2>
            {countdown > 0 && (
              <p className="text-[#3F4D34]/60 font-secondary text-sm">
                Mohon tunggu {countdown} detik
              </p>
            )}
          </div>

          {/* Skeleton loading */}
          <div className="space-y-3">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse p-4 bg-white rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-20 sm:py-28 my-16">
        <div className="container mx-auto max-w-5xl px-4 text-center">
          <p className="text-red-500 font-secondary text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-28 my-16">
      {/* Header */}
      <div className="relative mb-12 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-4">
            Pilihan Musik
          </h1>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            Koleksi musik untuk menyempurnakan undangan digital Anda
          </p>

          <Search
            onSearch={setSearch}
            placeholder="Cari musik..."
            debounceTime={300}
            value={search}
          />
        </div>
      </div>

      {/* Empty state */}
      {musics.length === 0 && (
        <div className="text-center py-10">
          <p className="text-[#3F4D34]/80 font-secondary text-lg">
            {search
              ? `Tidak ada musik yang cocok dengan pencarian "${search}"`
              : "Tidak ada musik tersedia saat ini"}
          </p>
        </div>
      )}

      {/* Music List */}
      {musics.length > 0 && (
        <div className="px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="space-y-3 mb-8">
              {musics.map((item) => (
                <a
                  key={item.id}
                  href={item.musicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-white hover:bg-gray-50 p-4 transition-all duration-200 block"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePlay(item.musicUrl, item.id);
                      }}
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        currentlyPlaying?.id === item.id
                          ? "bg-[#3F4D34] text-white"
                          : "bg-[#3F4D34]/10 text-[#3F4D34] group-hover:bg-[#3F4D34] group-hover:text-white"
                      }`}
                      aria-label={
                        currentlyPlaying?.id === item.id ? "Pause" : "Play"
                      }
                    >
                      {currentlyPlaying?.id === item.id ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Play className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <h6 className="font-secondary text-lg text-[#3F4D34] font-medium break-words whitespace-pre-wrap">
                        {item.title}
                      </h6>
                      <p className="text-sm text-gray-500 font-secondary">
                        {item.category}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Music;
