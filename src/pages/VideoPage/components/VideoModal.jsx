import React, { useEffect, useRef, useState } from "react";
import { X, Maximize, Minimize } from "lucide-react";

function VideoModal({ isOpen, onClose, video }) {
  const modalRef = useRef(null);
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Generate video URL based on title
  const getVideoUrl = (title) => {
    const slugifiedTitle = title.toLowerCase().replace(/\s+/g, "-");
    return `https://assets.satumomen.com/videos/${slugifiedTitle}.mp4`;
  };

  // Get cover URL from title and video ID
  const getCoverUrl = (videoId) => {
    return `https://assets.satumomen.com/videos/cover/${videoId}.webp`;
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !document.fullscreenElement) onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
      onClick={(e) =>
        e.target === modalRef.current &&
        !document.fullscreenElement &&
        onClose()
      }
      ref={modalRef}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          <button
            onClick={handleFullscreen}
            className="p-2 text-white hover:text-white/80 transition-colors bg-black/40 rounded-full"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? (
              <Minimize className="w-6 h-6" />
            ) : (
              <Maximize className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white hover:text-white/80 transition-colors bg-black/40 rounded-full"
            aria-label="Close preview"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <video
          ref={videoRef}
          id="modalVideoPreview"
          autoPlay
          loop
          playsInline
          preload="metadata"
          controls
          className={`w-full h-full ${
            !isFullscreen ? "max-h-[80vh] object-contain" : ""
          }`}
          poster={getCoverUrl(video.id)}
          src={getVideoUrl(video.title)}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default VideoModal;
