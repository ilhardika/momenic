import React from "react";
import ThemeList from "./components/ThemeList";

function ThemePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Theme Gallery</h1>
      <ThemeList />
    </div>
  );
}

export default ThemePage;
