import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "../assets/website-icon.png";
import { Link } from "react-router-dom";
import { trackEvent } from "../utils/analytics";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Fitur", href: "/#fitur" },
  { label: "Katalog", href: "/#katalog" },
  { label: "Daftar Harga", href: "/#harga" },
  { label: "Cara Pesan", href: "/#cara-pesan" },
];

const WA_HREF = "https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[0_2px_16px_rgba(0,0,0,0.07)]"
          : "bg-white/95"
      }`}
    >
      <nav className="container mx-auto px-5 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-40">
          <img src={logo} alt="Momenic" className="w-10 h-10 sm:w-12 sm:h-12" width="48" height="48" loading="eager" />
          <div className="flex flex-col leading-none">
            <span className="text-xl sm:text-2xl font-primary text-[#3F4D34]">
              Momenic
            </span>
            <span className="italic text-[10px] sm:text-xs font-secondary text-[#3F4D34]/60">
              Make your special moment iconic
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {/* Pill nav links */}
          <div className="flex items-center bg-[#3F4D34]/5 rounded-full px-1 py-1 gap-0.5">
            {navItems.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => trackEvent("nav_click", { link_label: label })}
                className="font-secondary text-[#3F4D34] text-sm px-4 py-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all duration-200 whitespace-nowrap"
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("nav_click", { link_label: "Hubungi Admin" })}
            className="ml-3 font-secondary px-5 py-2 rounded-full bg-[#3F4D34] text-white text-sm hover:bg-[#526444] active:scale-95 transition-all duration-200 whitespace-nowrap shadow-sm"
          >
            Hubungi Admin
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 w-9 h-9 flex items-center justify-center rounded-full bg-[#3F4D34]/8 text-[#3F4D34] hover:bg-[#3F4D34]/15 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Overlay */}
        {isOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setIsOpen(false)} />
        )}

        {/* Mobile Drawer */}
        <div
          className={`fixed top-0 right-0 h-full w-72 bg-white z-40 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center gap-3 px-6 pt-5 pb-4 border-b border-gray-100">
            <img src={logo} alt="Momenic" className="w-9 h-9" />
            <span className="font-primary text-lg text-[#3F4D34]">Momenic</span>
          </div>

          {/* Drawer links */}
          <div className="flex flex-col px-4 pt-4 gap-1">
            {navItems.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="font-secondary text-[#3F4D34] text-sm px-4 py-3 rounded-xl hover:bg-[#3F4D34]/6 transition-colors"
                onClick={() => { trackEvent("nav_click", { link_label: label }); setIsOpen(false); }}
              >
                {label}
              </a>
            ))}
          </div>

          {/* Drawer CTA */}
          <div className="px-4 mt-4">
            <a
              href={WA_HREF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackEvent("nav_click", { link_label: "Hubungi Admin" }); setIsOpen(false); }}
              className="block w-full text-center font-secondary px-5 py-3 rounded-xl bg-[#3F4D34] text-white text-sm hover:bg-[#526444] transition-colors"
            >
              Hubungi Admin
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
