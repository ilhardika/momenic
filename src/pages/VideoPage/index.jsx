import React from "react";
import VideoList from "./components/VideoList";
import FAQ from "./components/FAQ";

function VideoPage() {
  return (
    <div className="py-20 sm:py-28 my-16">
      {/* Hero Section */}
      <div className="relative mb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          {/* Header */}
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Pilihan Video Undangan Digital
          </h1>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Temukan video undangan digital yang sesuai dengan gayamu dari
            koleksi video eksklusif kami
          </p>
        </div>
      </div>

      {/* Video List Component */}
      <VideoList />

      {/* FAQ Component */}
      <FAQ/>
    </div>
  );
}

export default VideoPage;
