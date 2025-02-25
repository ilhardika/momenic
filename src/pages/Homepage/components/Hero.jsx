import React from "react";
import { MessageCircle, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-32 px-4 md:py-1 mt-16">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#E4E9CB] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center max-w-4xl relative z-10">
        {/* Top Badge - Enhanced for better mobile display */}
        <div className="mb-8 sm:mb-12 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#3F4D34]/10">
            <Sparkles className="w-4 h-4 text-[#3F4D34] mr-2" />
            <span className="font-secondary text-[#3F4D34] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm">
              Momenic Digital Invitation 2
            </span>
          </div>
        </div>

        {/* Main Content - Improved spacing and responsive text */}
        <div className="space-y-6 sm:space-y-8">
          <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-[#3F4D34] leading-tight opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards]">
            Undangan Digital
            <span className="block mt-1 sm:mt-2 text-[#4A5B3E] opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
              Tanpa Batas Pengiriman
            </span>
          </h1>

          <p className="font-secondary text-base sm:text-lg md:text-xl text-[#3F4D34]/80 max-w-2xl mx-auto leading-relaxed opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards] px-4">
            Pilih dari 450+ tema eksklusif dan kirim undangan digitalmu ke semua
            tamu dengan mudah dalam 3 langkah sederhana
          </p>

          {/* Steps Grid - Enhanced for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto my-8 sm:my-12 opacity-0 animate-[fadeIn_1s_ease-out_0.9s_forwards]">
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

          {/* Price Section - Improved visual hierarchy */}
          <div className="space-y-2 sm:space-y-3 opacity-0 animate-[fadeIn_1s_ease-out_1s_forwards] bg-white/50 backdrop-blur-sm py-4 px-6 rounded-2xl inline-block mx-auto">
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

          {/* WhatsApp Button - Enhanced mobile experience */}
          <div className="relative inline-block group opacity-0 animate-[fadeIn_1s_ease-out_1.2s_forwards] sm:mt-8 ml-5">
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
    </section>
  );
};

export default Hero;
