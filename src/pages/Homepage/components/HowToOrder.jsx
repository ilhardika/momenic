import { MessageCircle, Palette, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";

const HowToOrder = () => {
  const steps = [
    {
      id: 1,
      icon: <Palette className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Pilih Tema Undangan",
      description:
        "Tentukan undangan favorit kamu dari ratusan tema yg sudah kami sediakan",
    },
    {
      id: 2,
      icon: <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Chat Minmo",
      description:
        "Chat Minmo dan Minmo akan meminta data detil acara kamu, kamu juga bisa konsultasi terkait desain, harga dan tema.",
      action: {
        text: "Chat minmo sekarang",
        url: "https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo,%20saya%20ingin%20pesan%20Undangan%20Digital%20Website",
      },
    },
    {
      id: 3,
      icon: <CreditCard className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Lakukan Pembayaran",
      description:
        "Kamu dapat melakukan pembayaran sesuai paket yang kamu pilih. Minmo akan memberikanmu invoice lalu memproses pesanan kamu hingga selesai.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 bg-gradient-to-b from-[#E4E9CB]/30 to-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-primary text-2xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-4">
            Cara Order
          </h2>
          <p className="font-secondary text-[#3F4D34]/80 text-sm sm:text-lg max-w-2xl mx-auto">
            Buat undangan digitalmu dalam hitungan menit
          </p>
        </div>

        {/* Timeline Steps - Mobile Optimized */}
        <div className="relative">
          {/* Timeline Line - Visible on all screens, adjusted for mobile */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#3F4D34]/20 md:-translate-x-1/2" />

          <div className="space-y-8 sm:space-y-12 relative">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex gap-6 md:gap-16 items-start md:items-center ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Number Circle - Aligned left on mobile */}
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#3F4D34] text-white font-primary text-xl sm:text-2xl relative z-10">
                  {step.id}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="bg-white rounded-2xl p-5 sm:p-8 shadow-lg shadow-[#3F4D34]/5">
                    <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#3F4D34]/10 text-[#3F4D34] mb-4">
                      {step.icon}
                    </div>
                    <h3 className="font-primary text-lg sm:text-2xl text-[#3F4D34] mb-2 sm:mb-3">
                      {step.title}
                    </h3>
                    <p className="font-secondary text-[#3F4D34]/80 text-sm sm:text-base mb-4">
                      {step.description}
                    </p>
                    {step.action && (
                      <a
                        href={step.action.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full bg-[#2d5c56] text-white font-secondary text-sm hover:bg-[#1b4e44] transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{step.action.text}</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </section>
  );
};

export default HowToOrder;
