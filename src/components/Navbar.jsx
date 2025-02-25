import React from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <header className="bg-white shadow-sm fixed w-full top-0 z-50">
      <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center space-x-3 z-40">
          <img
            src="https://assets.satumomen.com/images/media/298604-media-1717688635.png"
            alt="Momenic"
            className="w-12 h-12 sm:w-14 sm:h-14"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-primary text-[#3F4D34]">
              Momenic
            </span>
            <span className="italic text-xs sm:text-sm font-secondary text-[#3F4D34]/70 -mt-1">
              Make your special moment iconic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/tema"
            className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
          >
            Tema
          </Link>
          <Link
            to="/video"
            className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
          >
            Video 3D
          </Link>
          <Link
            to="/portfolio"
            className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
          >
            Portfolio
          </Link>
          <Link
            to="/music"
            className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
          >
            Music
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 text-[#3F4D34] hover:text-[#4A5B3E] transition-colors"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Menu Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col pt-24 px-6 space-y-6">
            <Link
              to="/tema"
              className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Tema
            </Link>
            <Link
              to="/video"
              className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Video 3D
            </Link>
            <Link
              to="/portfolio"
              className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Portfolio
            </Link>
            <Link
              to="/music"
              className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Music
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
