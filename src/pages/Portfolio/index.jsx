import React from "react";
import usePortfolio from "../../hooks/usePortfolio";

function Portfolio() {
  const { portfolios, loading, error } = usePortfolio();

  if (loading) {
    return (
      <div className="py-20 sm:py-28 my-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-xl aspect-square mb-3" />
                <div className="h-4 bg-gray-200 rounded-lg w-1/2 mb-2" />
                <div className="h-5 bg-gray-200 rounded-lg w-3/4" />
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
        <div className="container mx-auto max-w-6xl px-4 text-center">
          <p className="text-red-500 font-secondary">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 sm:py-28 my-16">
      {/* Hero Section */}
      <div className="relative mb-16 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Portfolio Kami
          </h1>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Undangan yang sudah kami buat dengan sepenuh hati
          </p>
        </div>
      </div>

      {/* Portfolio Grid */}
      <div className="px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {portfolios.map((item) => (
              <article
                key={item.id}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="aspect-square relative overflow-hidden bg-[#3F4D34]/5">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-[#3F4D34]/10 text-xs font-secondary text-[#3F4D34] mb-2">
                      {item.category}
                    </span>
                    <h3 className="font-secondary text-base sm:text-lg text-[#3F4D34] line-clamp-2 group-hover:text-[#4A5B3E] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Portfolio;
