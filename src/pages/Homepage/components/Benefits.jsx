import React from "react";
import { Infinity, Users, Pencil, Clock, Music, UserCheck } from "lucide-react";

const Benefits = () => {
  const benefits = [
    {
      icon: <Infinity className="w-6 h-6" />,
      title: "Aktif Selamanya",
      description: "Undangan digitalmu akan selalu aktif tanpa batas waktu",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Unlimited Tamu",
      description: "Kirim undangan ke semua tamu tanpa batasan jumlah",
    },
    {
      icon: <Pencil className="w-6 h-6" />,
      title: "Free Revisi",
      description: "Revisi konten undangan secara gratis sebelum disebarkan",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "One Day Service",
      description: "Proses pembuatan undangan selesai dalam satu hari kerja",
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Custom Music",
      description: "Pilih musik favoritmu untuk mengiringi undangan",
    },
  ];

  // Determine if we have an odd number of benefits
  const hasOddCount = benefits.length % 2 !== 0;

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden bg-white">
      {/* Content container with relative position to appear above background */}
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Keuntungan Menggunakan Undangan Digital di Momenic
          </h2>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Dirancang untuk membantu Kamu menciptakan undangan digital yang
            sempurna, sesuai dengan keinginan dan kebutuhan Kamu.
          </p>
        </div>

        {/* Benefits Grid - With proper centering for odd count */}
        <div
          className={`grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 max-w-[900px] mx-auto 
          ${hasOddCount ? "benefits-grid-odd" : ""}`}
        >
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`group h-[200px] sm:h-[220px] w-full [perspective:1000px]
                ${
                  hasOddCount && index === benefits.length - 1
                    ? "col-span-2 sm:col-span-1 md:col-span-1 mx-auto max-w-[280px] sm:max-w-none"
                    : ""
                }`}
            >
              <div
                className="relative h-full w-full transition-transform duration-500 
                         [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]"
              >
                {/* Front of card */}
                <div
                  className="absolute inset-0 p-4 sm:p-6 rounded-2xl bg-white 
                          border border-[#3F4D34]/10 hover:border-[#3F4D34]/20
                          flex flex-col items-center justify-center text-center
                          [backface-visibility:hidden]"
                >
                  <div
                    className="w-14 h-14 rounded-2xl bg-[#3F4D34]/10
                            flex items-center justify-center mb-4
                            transition-all duration-300 ease-in-out
                            group-hover:scale-110"
                  >
                    <div className="text-[#3F4D34]">{benefit.icon}</div>
                  </div>
                  <h3 className="font-secondary text-lg sm:text-xl text-[#3F4D34]">
                    {benefit.title}
                  </h3>
                </div>

                {/* Back of card */}
                <div
                  className="absolute inset-0 p-4 sm:p-6 rounded-2xl bg-[#3F4D34]
                          flex items-center justify-center text-center
                          [backface-visibility:hidden] [transform:rotateX(180deg)]"
                >
                  <p className="font-secondary text-white text-sm sm:text-base leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
