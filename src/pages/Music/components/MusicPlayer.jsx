import React from "react";
import { Play, Pause } from "lucide-react";

function MusicPlayer({ music, isPlaying, onPlayPause }) {
  return (
    <div className="group bg-white rounded-lg p-4 hover:bg-[#3F4D34]/5 transition-colors">
      <div className="flex items-center gap-4">
        {/* Play/Pause Button */}
        <button
          onClick={() => onPlayPause(music)}
          className={`shrink-0 w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
            isPlaying 
              ? "bg-[#3F4D34] text-white" 
              : "bg-[#3F4D34]/10 text-[#3F4D34] hover:bg-[#3F4D34]/20"
          }`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5" />
          )}
        </button>

        {/* Title and Category */}
        <div className="min-w-0">
          <h3 className="font-secondary text-[#3F4D34] text-base sm:text-lg break-words">
            {music.title}
          </h3>
          <span className="text-sm text-[#3F4D34]/60 font-secondary">
            {music.category}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
