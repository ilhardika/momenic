import { Eye, MessageCircle } from "lucide-react";
import pricelist from "../data/pricelist.json";

const getThemePrice = (themeType, hasPhoto) => {
  const priceInfo = pricelist.pricelist.find((item) => item.theme === themeType);
  if (!priceInfo) return { discount: 0, original: 0 };
  if (hasPhoto) {
    return {
      discount: priceInfo.discountPrice || 0,
      original: priceInfo.originalPrice || 0,
    };
  } else {
    return {
      discount: priceInfo.withoutPhoto?.discountPrice || 0,
      original: priceInfo.withoutPhoto?.originalPrice || 0,
    };
  }
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const ThemeCard = ({ theme }) => {
  const price = getThemePrice(theme.theme_type, theme.has_photo);

  const waMessage = encodeURIComponent(
    `Halo Minmo, saya ingin pesan undangan digital Tema: ${theme.name}, dengan Harga Diskon: ${formatCurrency(price.discount)}`
  );

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:shadow-lg font-secondary">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={theme.featured_image}
          alt={theme.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width="180"
          height="180"
        />
        {/* Theme type badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-block bg-black/60 backdrop-blur-sm text-white text-[10px] sm:text-xs px-2.5 py-1 rounded-full">
            {theme.category_type}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <h3 className="font-secondary text-xs sm:text-sm font-medium text-[#3F4D34] mb-2 leading-snug line-clamp-2">
          {theme.name}
        </h3>

        {/* Price */}
        <div className="mb-3">
          {price.original > price.discount && (
            <span className="block text-[10px] sm:text-xs text-gray-400 line-through leading-none mb-0.5">
              {formatCurrency(price.original)}
            </span>
          )}
          <span className="text-sm sm:text-base font-semibold text-[#3F4D34]">
            {formatCurrency(price.discount)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <a
            href={theme.preview_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-full border border-[#3F4D34] px-2 py-1.5 text-[10px] sm:text-xs font-secondary text-[#3F4D34] transition-colors hover:bg-[#3F4D34] hover:text-white"
            onClick={(e) => { e.stopPropagation(); if (typeof window.fbq === "function") window.fbq("track", "ViewContent", { content_name: theme.name }); }}
          >
            <Eye className="h-3 w-3 shrink-0" />
            <span>Preview</span>
          </a>
          <a
            href={`https://api.whatsapp.com/send?phone=6285179897917&text=${waMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-full bg-[#128C7E] px-2 py-1.5 text-[10px] sm:text-xs font-secondary text-white transition-colors hover:bg-[#0a6e5c]"
            onClick={(e) => { e.stopPropagation(); if (typeof window.fbq === "function") window.fbq("track", "Lead", { content_name: theme.name, currency: "IDR", value: price.discount }); }}
          >
            <MessageCircle className="h-3 w-3 shrink-0" />
            <span>Pesan</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;
