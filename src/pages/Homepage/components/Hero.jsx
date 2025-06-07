import { useState, useEffect } from "react";
import { MessageCircle, Sparkles, Headset } from "lucide-react";

// Import your hero images here
import heroImage1 from "../../../assets/hero-1.webp";
import heroImage2 from "../../../assets/hero-2.webp";
import heroImage3 from "../../../assets/hero-3.webp";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Background images for the slider
  const backgroundImages = [heroImage1, heroImage2, heroImage3];

  // Auto change background image every 1 second (changed from 5000ms to 1000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 1000); // Changed to 1000ms (1 second)

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32 px-4 mt-16 md:mt-20">
      {/* Background Image Slider */}
      <div className="absolute inset-0">
        {/* Background images - each with fade transition */}
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}

        {/* Lighter green-tinted overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#404C34]/60 via-[#2A3524]/55 to-[#1A211A]/70" />

        {/* Enhanced green accent light from top */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#8FAD83]/20 to-transparent" />

        {/* Center radial effect with green tone */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(circle at center, rgba(143, 173, 131, 0.2) 0%, rgba(0, 0, 0, 0) 70%)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
        {/* Top Badge - Green accent */}
        <div className="mb-8 md:mb-12 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#404C34]/30 backdrop-blur-sm border border-[#8FAD83]/30">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E5E5E5] mr-1.5 sm:mr-2" />
            <span className="font-secondary text-[#E5E5E5] uppercase tracking-[0.12em] sm:tracking-[0.2em] text-xs sm:text-sm">
              Premium Digital Invitation
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col h-[60vh] justify-between">
          {/* Main Content */}
          <div className="space-y-6 md:space-y-8 mb-8">
            <h1 className="font-primary text-[32px] sm:text-4xl md:text-5xl lg:text-6xl font-normal text-white leading-tight opacity-0 animate-[fadeIn_1s_ease-out_0.3s_forwards] drop-shadow-md">
              Undangan Digital Express
              <span className="block italic mt-1 sm:mt-2 text-[#E5E5E5] text-[20px] sm:text-[26px] md:text-[32px] opacity-0 animate-[fadeIn_1s_ease-out_0.6s_forwards]">
                Premium, Murah, Fitur Lengkap
              </span>
            </h1>

            {/* Enhanced green accent divider */}
            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-[#8FAD83] to-transparent mx-auto opacity-0 animate-[fadeIn_1s_ease-out_0.8s_forwards]"></div>
          </div>

          {/* Button Section with more spacing */}
          <div className="space-y-6 md:space-y-8 mt-auto">
            {/* Buttons - Side by side on desktop, stacked on mobile */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* Konsultasi Gratis Button - Always on top for mobile - White version */}
              <div className="relative inline-block group opacity-0 animate-[fadeIn_1s_ease-out_1.2s_forwards] w-full sm:w-auto">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8FAD83]/20 to-[#8FAD83]/40 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <a
                  href="https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo,%20saya%20ingin%20konsultasi%20gratis%20tentang%20Undangan%20Digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#404C34]
                           rounded-full transition-all duration-300 font-secondary font-medium text-base sm:text-lg
                           shadow-md hover:shadow-lg border border-white/10
                           transform hover:-translate-y-0.5 group w-full sm:w-auto justify-center"
                >
                  <Headset className="w-5 h-5 mr-2 transition-transform group-hover:scale-110 text-[#404C34]" />
                  <span>Konsultasi Gratis</span>
                </a>
              </div>

              {/* WhatsApp Button */}
              <div className="relative inline-block group opacity-0 animate-[fadeIn_1s_ease-out_1.2s_forwards] w-full sm:w-auto">
                <div
                  className="absolute -inset-1 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse mb-5"
                  style={{
                    background: "linear-gradient(to right, #404C34, #526444)",
                  }}
                ></div>
                <a
                  href="https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo,%20saya%20ingin%20pesan%20Undangan%20Digital%20Website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-[#404C34] hover:bg-[#526444] text-white 
                           rounded-full transition-all duration-300 font-secondary font-medium text-base sm:text-lg
                           shadow-[0_4px_14px_0_rgba(64,76,52,0.4)] hover:shadow-[0_6px_20px_0_rgba(64,76,52,0.5)]
                           transform hover:-translate-y-0.5 group w-full sm:w-auto justify-center"
                >
                  <MessageCircle className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" />
                  <span>Pesan Sekarang</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
