import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/website-icon.png";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Fitur", href: "/#fitur" },
  { label: "Katalog", href: "/#katalog" },
  { label: "Daftar Harga", href: "/#harga" },
  { label: "Hubungi Admin", href: "https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo" },
];

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
            src={logo}
            alt="Momenic"
            className="w-12 h-12 sm:w-14 sm:h-14"
            width="56"
            height="56"
            loading="eager"
          />
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-primary text-[#3F4D34]">
              Momenic
            </span>
            <span className="italic text-xs sm:text-sm font-secondary text-[#3F4D34]/85 -mt-1">
              Make your special moment iconic
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 text-[#3F4D34] hover:text-[#4A5B3E] transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
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
            {navItems.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="font-secondary text-[#3F4D34] hover:text-[#4A5B3E] transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
