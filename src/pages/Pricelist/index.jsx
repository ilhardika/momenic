import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pricelist from "../../data/pricelist.json";
import { Check, X, ArrowRight } from "lucide-react";

function Pricelist() {
  const [withPhoto, setWithPhoto] = useState(true);
  const navigate = useNavigate();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate discount percentage
  const calculateDiscount = (original, discounted) => {
    const percentage = Math.round(((original - discounted) / original) * 100);
    return percentage;
  };

  // Translate time periods to Indonesian
  const translateTimePeriod = (period) => {
    if (!period) return "";

    // Replace common English time periods with Indonesian
    return period
      .replace("14 months", "14 bulan")
      .replace("1 year", "1 tahun")
      .replace("Lifetime", "Selamanya")
      .replace("6 months", "6 bulan")
      .replace("3 months", "3 bulan")
      .replace("month", "bulan")
      .replace("year", "tahun")
      .replace("forever", "selamanya");
  };

  // Key differentiating features only
  const getDifferentiatingFeatures = (item) => {
    const features = [];

    // Add active period - with translated period
    if (item.details?.activePeriod) {
      features.push(
        `Aktif selama ${translateTimePeriod(item.details.activePeriod)}`
      );
    }

    // Add photo gallery info when "Dengan Foto" is selected
    if (withPhoto && item.details?.maxGalleryPhotos) {
      features.push(`${item.details.maxGalleryPhotos} foto gallery`);
    }

    // Always add "Tanpa Foto" as a feature when that option is selected
    if (!withPhoto) {
      features.push("Tanpa foto gallery");
    }

    // For "Without Photo" theme, add additional excludes
    if (!withPhoto && item.details?.excludes) {
      item.details.excludes.forEach((exclude) => {
        if (
          exclude.toLowerCase() !== "foto" &&
          exclude.toLowerCase() !== "foto gallery"
        ) {
          features.push(`Tanpa ${exclude}`);
        }
      });
    }

    return features;
  };

  // Handle redirect to theme page with appropriate search params
  const handleViewThemes = (themeType) => {
    const params = new URLSearchParams();
    params.set("category", themeType);
    params.set("withphoto", withPhoto.toString());
    navigate(`/tema?${params.toString()}`);
  };

  return (
    <div className="bg-gradient-to-b from-[#F8FAF5] to-white min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl font-primary text-[#404C34] mb-4">
            Daftar Harga
          </h1>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Pilih paket undangan digital yang sesuai dengan kebutuhan acara
            spesial Anda.
          </p>

          {/* Toggle */}
          <div className="mt-8 inline-flex items-center bg-white p-1 rounded-full border border-[#E5E7EB] shadow-sm">
            <button
              className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                withPhoto
                  ? "bg-[#404C34] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setWithPhoto(true)}
            >
              Dengan Foto
            </button>
            <button
              className={`px-5 py-2.5 rounded-full text-sm sm:text-base font-medium transition-colors ${
                !withPhoto
                  ? "bg-[#404C34] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              onClick={() => setWithPhoto(false)}
            >
              Tanpa Foto
            </button>
          </div>
        </div>

        {/* Price Cards - Now 2 columns on mobile, 3 on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {pricelist.pricelist.map((item, index) => {
            // Skip if this is not meant to be displayed in current mode
            if (
              !withPhoto &&
              !item.withoutPhoto &&
              item.theme !== "Without Photo"
            )
              return null;
            if (withPhoto && item.theme === "Without Photo") return null;

            // Set price based on withPhoto toggle
            const price = withPhoto
              ? { discount: item.discountPrice, original: item.originalPrice }
              : item.withoutPhoto
              ? {
                  discount: item.withoutPhoto.discountPrice,
                  original: item.withoutPhoto.originalPrice,
                }
              : { discount: item.discountPrice, original: item.originalPrice };

            // Skip if there's no price for the selected option
            if (!price.discount || !price.original) return null;

            // Calculate discount percentage if applicable
            const discountPercentage =
              price.original > price.discount
                ? calculateDiscount(price.original, price.discount)
                : 0;

            // Get key features that differentiate this package
            const features = getDifferentiatingFeatures(item);

            // Determine if this is a featured card (first one)
            const isFeatured = index === 0;

            return (
              <div
                key={index}
                className={`group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col transform hover:-translate-y-1 ${
                  isFeatured ? "relative" : ""
                }`}
              >
                {/* Badge for featured item */}
                {isFeatured && (
                  <div className="absolute top-0 right-0 bg-[#404C34] text-white text-xs font-bold py-1 px-3 rounded-bl-lg z-10">
                    POPULER
                  </div>
                )}

                {/* Card Header */}
                <div
                  className={`px-4 py-5 sm:p-6 ${
                    isFeatured
                      ? "bg-gradient-to-br from-[#404C34] to-[#5A6D49]"
                      : "bg-gradient-to-r from-[#F8FAF5] to-[#E8F0DE]"
                  }`}
                >
                  {/* Theme Name */}
                  <h3
                    className={`text-lg sm:text-xl mb-1 ${
                      isFeatured ? "text-white" : "text-[#2A3824]"
                    }`}
                  >
                    {item.theme}
                  </h3>

                  {/* Price Section - Stacked on mobile, inline on desktop */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline mb-1">
                    {price.discount < price.original && (
                      <span
                        className={`text-xs line-through mb-1 sm:mb-0 sm:text-sm sm:order-2 sm:ml-2 ${
                          isFeatured ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {formatCurrency(price.original)}
                      </span>
                    )}
                    <span
                      className={`text-2xl sm:text-3xl font-semibold sm:order-1 ${
                        isFeatured ? "text-white" : "text-[#2A3824]"
                      }`}
                    >
                      {formatCurrency(price.discount)}
                    </span>
                  </div>

                  {/* Discount Badge */}
                  {discountPercentage > 0 && (
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        isFeatured
                          ? "bg-white text-[#404C34]"
                          : "bg-[#404C34] text-white"
                      } mt-1`}
                    >
                      Hemat {discountPercentage}%
                    </span>
                  )}
                </div>

                {/* Key Features */}
                <div className="flex-grow px-4 py-3 sm:p-4 bg-white">
                  <ul className="space-y-2">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        {feature.startsWith("Tanpa") ? (
                          <X className="h-4 w-4 text-gray-400 mr-1.5 flex-shrink-0" />
                        ) : (
                          <Check className="h-4 w-4 text-[#404C34] mr-1.5 flex-shrink-0" />
                        )}
                        <span
                          className={
                            feature.startsWith("Tanpa")
                              ? "text-gray-500"
                              : "text-gray-700"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button - Changed from "Pesan" to "Lihat Tema" */}
                <div className="p-4 pt-2 sm:p-4">
                  <button
                    onClick={() => handleViewThemes(item.theme)}
                    className={`w-full inline-flex justify-center items-center px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all ${
                      isFeatured
                        ? "bg-[#404C34] hover:bg-[#526444] text-white shadow-md hover:shadow-lg"
                        : "bg-white text-[#404C34] border-2 border-[#404C34] hover:bg-[#F8FAF5] group-hover:border-[#526444]"
                    }`}
                  >
                    <span>Lihat Tema</span>
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-primary text-[#404C34] mb-4">
            Pertanyaan Umum
          </h2>
          <div className="mt-8 max-w-3xl mx-auto text-left space-y-4">
            {[
              {
                question: "Berapa lama proses pembuatan undangan digital?",
                answer:
                  "Proses pembuatan undangan digital standar membutuhkan waktu 1-3 hari kerja sejak data lengkap dan pembayaran kami terima.",
              },
              {
                question: "Apakah saya bisa request revisi?",
                answer:
                  "Ya, Anda mendapatkan kesempatan revisi sebanyak 2 kali untuk memastikan undangan sesuai dengan harapan Anda.",
              },
              {
                question: "Bagaimana cara tamu mengakses undangan digital?",
                answer:
                  "Tamu dapat mengakses undangan digital melalui link yang akan kami berikan. Link ini dapat dibagikan melalui WhatsApp, email, atau media sosial.",
              },
              {
                question:
                  "Apakah ada batasan jumlah tamu yang bisa mengakses undangan?",
                answer:
                  "Tidak ada batasan jumlah tamu yang dapat mengakses undangan digital Anda. Semua paket menyediakan akses tidak terbatas.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg text-[#2A3824] mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">
            Masih punya pertanyaan atau butuh bantuan untuk memilih paket yang
            tepat?
          </p>
          <a
            href="https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo,%20saya%20ingin%20konsultasi%20tentang%20undangan%20digital"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-full bg-[#404C34] hover:bg-[#526444] text-white font-medium text-base transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Konsultasi Gratis
          </a>
        </div>
      </div>
    </div>
  );
}

export default Pricelist;
