import React, { useState } from "react";
import { Eye, MessageCircle } from "lucide-react";
import useVideos from "../../../hooks/useVideos";
import VideoModal from "./VideoModal";
import Search from "../../../components/Search";
import Pagination from "../../../components/Pagination";

const VideoList = () => {
  const { videos, loading, error, selectedType, setSelectedType } = useVideos();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 12;

  const videoTypes = [
    { id: "invitation", name: "Undangan" },
    { id: "greeting", name: "Ucapan" },
  ];

  // Filter videos by search query
  const filteredVideos = videos?.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil((filteredVideos?.length || 0) / PER_PAGE);
  const paginatedVideos = filteredVideos?.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedType]);

  const handlePreviewClick = (video) => {
    setSelectedVideo(video);
  };

  if (loading) {
    return (
      <section className="px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Search Bar Skeleton */}
          <div className="mb-8">
            <div className="max-w-xl mx-auto h-12 rounded-full bg-gray-200 animate-pulse" />
          </div>
          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[16/9] rounded-2xl bg-gray-200" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) return null;
  if (!videos || videos.length === 0) return null;

  return (
    <div className="px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Search Bar */}
        <div className="mb-8">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={`Cari video ${
              selectedType === "invitation" ? "undangan" : "ucapan"
            }...`}
          />
        </div>

        {/* Type Selection Pills */}
        <div className="mb-8">
          <div className="flex justify-center gap-2">
            {videoTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`px-6 py-2 rounded-full font-secondary text-sm transition-all duration-300
                  ${
                    selectedType === type.id
                      ? "bg-[#3F4D34] text-white"
                      : "bg-[#3F4D34]/10 text-[#3F4D34] hover:bg-[#3F4D34]/20"
                  }`}
              >
                {type.name}
              </button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {paginatedVideos.map((video) => (
            <article
              key={video.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-md h-full"
            >
              {/* Image Container */}
              <div className="w-full h-full bg-gray-100">
                <img
                  src={video.imageUrl}
                  alt={video.title}
                  className="w-full h-auto" // Changed from absolute positioning to natural flow
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#128C7E] text-xs font-secondary text-white">
                  {video.category}
                </span>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-3 sm:p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <h3 className="font-secondary text-base sm:text-lg text-white mb-2 sm:mb-4 text-center">
                  {video.title}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-3 w-full">
                  <span className="text-white font-bold">{video.price}</span>
                  <span className="text-white/60 line-through text-sm">
                    {video.originalPrice}
                  </span>
                </div>
                <div className="flex gap-1.5 sm:gap-2 w-full">
                  <button
                    onClick={() => handlePreviewClick(video)}
                    className="flex-1 inline-flex items-center justify-center space-x-1 sm:space-x-2 rounded-full bg-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-secondary text-[#3F4D34] transition-colors hover:bg-[#3F4D34] hover:text-white"
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Preview</span>
                  </button>
                  <a
                    href={video.orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center space-x-1 sm:space-x-2 rounded-full bg-[#128C7E] px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-secondary text-white transition-colors hover:bg-[#2d5c56]"
                  >
                    <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Pesan</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Video Modal */}
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          video={selectedVideo}
        />
      </div>
    </div>
  );
};

export default VideoList;
