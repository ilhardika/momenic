import { Link } from "react-router-dom";
import { Instagram } from "lucide-react";
import logo from "../assets/website-icon.png";
import { trackEvent } from "../utils/analytics";

const Footer = () => {
  return (
    <footer className="bg-[#3F4D34] text-white pb-20 md:pb-0">
      <div className="container mx-auto max-w-2xl px-6 py-10 flex flex-col items-center text-center gap-5">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Momenic" className="w-10 h-10" />
          <span className="font-primary text-2xl tracking-wide">Momenic</span>
        </div>

        {/* Contacts */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 font-secondary text-sm text-white/80">
          <a
            href="https://api.whatsapp.com/send?phone=6285179897917"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("footer_wa_click")}
            className="hover:text-white transition-colors"
          >
            +6285179897917
          </a>
          <span className="hidden sm:block text-white/30">|</span>
          <a
            href="https://instagram.com/momenic.id"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("footer_ig_click")}
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Instagram className="w-4 h-4" />
            momenic.id
          </a>
        </div>

        {/* Copyright */}
        <p className="font-secondary text-xs text-white/50">
          Copyright © 2020 – 2026
        </p>
      </div>
    </footer>
  );
};

export default Footer;
