import React from "react";
import ThemeList from "./components/ThemeList";

function ThemePage() {
  return (
    <div className="py-20 sm:py-28">
      {/* Hero Section */}
      <div className="relative mb-16 px-4 mt-16">
        <div className="container mx-auto max-w-6xl text-center">
          {/* Header */}
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Pilihan Tema Undangan Digital
          </h1>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Temukan tema undangan digital yang sesuai dengan gayamu dari ratusan
            pilihan tema eksklusif kami
          </p>
        </div>
      </div>

      {/* Theme List Component */}
      <ThemeList />
    </div>
  );
}

export default ThemePage;
