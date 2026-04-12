import { useLocation, Link } from "react-router-dom";
import { Home, Crown, Palette, Tag, ClipboardList } from "lucide-react";

const items = [
  { label: "Home", icon: Home, href: "/#home", section: "home" },
  { label: "Fitur", icon: Crown, href: "/#fitur", section: "fitur" },
  { label: "Katalog", icon: Palette, href: "/#katalog", section: "katalog" },
  { label: "Harga", icon: Tag, href: "/#harga", section: "harga" },
  { label: "Cara Pesan", icon: ClipboardList, href: "/#cara-pesan", section: "cara-pesan" },
];

const MobileNav = () => {
  const { pathname, hash } = useLocation();
  const isHome = pathname === "/";

  const handleClick = (section) => {
    if (isHome) {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t border-gray-200 shadow-lg">
      <div className="flex">
        {items.map(({ label, icon: Icon, href, section, external }) => {
          const active = isHome && hash === `#${section}`;
          if (external) {
            return (
              <a
                key={section}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-gray-400 hover:text-[#3F4D34] transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span className="font-secondary text-[10px]">{label}</span>
              </a>
            );
          }
          return isHome ? (
            <button
              key={section}
              onClick={() => handleClick(section)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                active ? "text-[#3F4D34]" : "text-gray-400"
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="font-secondary text-[10px]">{label}</span>
            </button>
          ) : (
            <Link
              key={section}
              to={href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-gray-400 hover:text-[#3F4D34] transition-colors"
            >
              <Icon className="w-5 h-5" />
              <span className="font-secondary text-[10px]">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
