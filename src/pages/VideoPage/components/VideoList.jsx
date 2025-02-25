import React from "react";
import useVideos from "../../../hooks/useVideos";

const VideoList = () => {
  const { videos, loading, error } = useVideos();

  if (loading) return <div>Loading videos...</div>;
  if (error) return <div>{error}</div>;
  if (!videos || videos.length === 0) return <div>No videos found</div>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Video Themes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {videos.map((video) => (
          <article key={video.id} className="border rounded-lg overflow-hidden">
            <div className="relative pt-[56.25%]">
              <img
                src={video.imageUrl}
                alt={video.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <span className="absolute top-2 right-2 bg-yellow-400 text-sm px-2 py-1 rounded-full">
                {video.category}
              </span>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-medium mb-2">{video.title}</h2>
              <div className="flex gap-2 mb-4">
                <span className="text-red-600 font-bold">{video.price}</span>
                <span className="text-gray-400 line-through">
                  {video.originalPrice}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => window.open(video.previewUrl, "_blank")}
                  className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-full"
                >
                  Preview
                </button>
                <a
                  href={video.orderUrl}
                  target="_blank"
                  rel="nofollow"
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-center"
                >
                  Pesan
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
