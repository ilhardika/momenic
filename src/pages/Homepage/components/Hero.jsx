import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";
import mockupPhone from "../../../assets/mockup-phone.webp";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32 px-4 mt-16 md:mt-20">
      {/* Background Layers */}
      <div className="absolute inset-0">
        {/* Base background */}
        <div className="absolute inset-0 bg-[#E4E9CB] opacity-80" />

        {/* Gradient overlays for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E4E9CB] via-[#E4E9CB]/80 to-transparent opacity-90" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Top Badge */}
        <div className="mb-8 md:mb-12 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#3F4D34]/10">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3F4D34] mr-1.5 sm:mr-2" />
            <span className="font-secondary text-[#3F4D34] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-xs sm:text-sm">
              Momenic Digital Invitation
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          {/* Main Content */}
          <div className="space-y-6 md:space-y-8">
            <h1 className="font-primary text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#3F4D34] leading-tight opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
              Undangan Digital
              <span className="block mt-1 sm:mt-2 text-[#3F4D34] text-[28px] sm:text-[32px] md:text-[40px] opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
                Tanpa Batas Pengiriman
              </span>
            </h1>

            {/* Phone Mockup - Adjusted spacing */}
            <div className="relative w-full max-w-xs sm:max-w-sm mx-auto my-8 md:my-12 opacity-0 animate-[fadeIn_1s_ease-out_0.9s_forwards]">
              <img
                src={mockupPhone}
                alt="Phone Mockup"
                className="w-full h-auto object-contain transform transition-all duration-300 animate-float
                        hover:scale-105 drop-shadow-2xl"
                style={{
                  filter: "drop-shadow(0 0 20px rgba(63, 77, 52, 0.2))",
                }}
              />
            </div>

            <p className="font-secondary text-sm sm:text-base md:text-lg text-[#3F4D34]/80 max-w-xl mx-auto leading-relaxed opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards] px-2">
              Pilih dari 450+ tema eksklusif dan kirim undangan digitalmu ke
              semua tamu dengan mudah dalam 3 langkah sederhana
            </p>
          </div>

          {/* Steps Grid - Adjusted spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-3xl mx-auto mb-12 md:mb-16 opacity-0 animate-[fadeIn_1s_ease-out_0.9s_forwards]">
            {[
              { number: "1", text: "Pilih Tema" },
              { number: "2", text: "Edit Data" },
              { number: "3", text: "Kirim Undangan" },
            ].map((step, index) => (
              <div
                key={step.number}
                className="flex flex-row sm:flex-col items-center sm:space-y-3 text-[#3F4D34] p-4 sm:p-6 rounded-xl bg-[#3F4D34]/5 hover:bg-[#3F4D34]/10 transition-colors"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#3F4D34]/10 flex items-center justify-center mr-4 sm:mr-0">
                  <span className="font-secondary font-bold text-lg sm:text-xl">
                    {step.number}
                  </span>
                </div>
                <span className="font-secondary text-base sm:text-lg">
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          {/* Price and Button Section - Adjusted spacing */}
          <div className="space-y-6 md:space-y-8 mb-8 md:mb-12">
            {/* Price Section */}
            <div className="space-y-1.5 sm:space-y-3 opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards] bg-white/50 backdrop-blur-sm py-3 px-4 sm:py-4 sm:px-6 rounded-xl sm:rounded-2xl inline-block">
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <span className="text-[#3F4D34]/60 line-through font-secondary text-base sm:text-lg">
                  Rp 299.000
                </span>
                <span className="text-[#3F4D34] font-secondary font-bold text-xl sm:text-2xl">
                  Rp 150.000
                </span>
              </div>
              <p className="text-[#3F4D34]/80 font-secondary text-xs sm:text-sm">
                *Harga promo terbatas
              </p>
            </div>

            {/* WhatsApp Button */}
            <div className="relative inline-block group opacity-0 animate-[fadeIn_1s_ease-out_1.2s_forwards] w-full sm:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#3F4D34] to-[#4A5B3E] rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse mb-5"></div>
              <a
                href="https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo,%20saya%20ingin%20pesan%20Undangan%20Digital%20Website"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#3F4D34] hover:bg-[#4A5B3E] text-white 
                         rounded-full transition-all duration-300 font-secondary font-medium text-base sm:text-lg
                         shadow-[0_4px_14px_0_rgba(63,77,52,0.39)] hover:shadow-[0_6px_20px_0_rgba(63,77,52,0.39)]
                         transform hover:-translate-y-0.5 group w-full sm:w-auto justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                <span>Pesan Sekarang</span>
              </a>
            </div>
          </div>
        </div>

        {/* Enhanced decorative elements - Mobile optimized */}
        <div className="absolute top-1/3 right-4 sm:right-12 w-24 sm:w-32 h-24 sm:h-32 bg-[#3F4D34]/5 rounded-full blur-2xl sm:blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 left-4 sm:left-12 w-32 sm:w-40 h-32 sm:h-40 bg-[#3F4D34]/5 rounded-full blur-2xl sm:blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-20 sm:w-24 h-20 sm:h-24 bg-[#3F4D34]/5 rounded-full blur-xl sm:blur-2xl animate-pulse delay-500" />
      </div>
    </section>
  );
};

export default Hero;
