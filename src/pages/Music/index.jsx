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
  const [countdown, setCountdown] = useState(25);

  // Add handleSearch function
  const handleSearch = (value) => {
    setSearch(value);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (currentlyPlaying?.audio) {
        currentlyPlaying.audio.pause();
        currentlyPlaying.audio = null;
      }
    };
  });

  // Add countdown effect
  useEffect(() => {
    let timer;
    if (loading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [loading, countdown]);

  const handlePlay = (musicUrl, id) => {
    if (currentlyPlaying?.audio) {
      currentlyPlaying.audio.pause();
    }

    if (currentlyPlaying?.id === id) {
      setCurrentlyPlaying(null);
      return;
    }

    const audio = new Audio(musicUrl);
    // Add event listeners for better performance
    audio.addEventListener("ended", () => {
      setCurrentlyPlaying(null);
    });
    audio.addEventListener("error", () => {
      setCurrentlyPlaying(null);
    });

    audio.play();
    setCurrentlyPlaying({ id, audio });
  };

  if (loading) {
    return (
      <div className="py-20 sm:py-28 my-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="text-center mb-8">
            <p className="text-[#3F4D34] font-secondary text-lg mb-2">
              Mohon maaf atas ketidaknyamanannya
            </p>
            <p className="text-[#3F4D34]/80 font-secondary mb-4">
              Sistem sedang mempersiapkan daftar musik untuk Anda
            </p>
            <p className="text-[#3F4D34]/60 font-secondary text-sm">
              Estimasi waktu tunggu: {countdown} detik
            </p>
          </div>
          <div className="space-y-4">
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
      {/* Hero Section */}
      <div className="relative mb-16 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Pilihan Musik
          </h1>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            Koleksi musik untuk undangan digital Anda
          </p>

          {/* Update Search component usage */}
          <Search
            onSearch={handleSearch}
            placeholder="Cari musik..."
            debounceTime={300}
          />
        </div>
      </div>

      {/* Add Empty State Message */}
      {musics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#3F4D34]/80 font-secondary text-lg mb-4">
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
            <div className="space-y-3">
              {musics.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white hover:bg-gray-50 p-4  transition-all duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => handlePlay(item.musicUrl, item.id)}
                      className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-200 ${
                        currentlyPlaying?.id === item.id
                          ? "bg-[#3F4D34] text-white"
                          : "bg-[#3F4D34]/10 text-[#3F4D34] group-hover:bg-[#3F4D34] group-hover:text-white"
                      }`}
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
                    <div className="flex-shrink-0 hidden sm:block">
                      <span className="text-sm text-gray-500 font-secondary">
                        {currentlyPlaying?.id === item.id
                          ? "Now Playing"
                          : "Click to Play"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Music;
