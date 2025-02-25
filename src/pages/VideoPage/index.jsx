import React from "react";
import VideoList from "./components/VideoList";

function VideoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Video Gallery</h1>
      <VideoList />
    </div>
  );
}

export default VideoPage;
