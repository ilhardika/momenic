import {
  Infinity,
  Users,
  Pencil,
  Clock,
  Music,
  BookOpenText,
} from "lucide-react";

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
      icon: <BookOpenText className="w-6 h-6" />,
      title: "Buku Tamu Digital",
      description:
        "Kenangan ucapan manis oleh tamu lewat teks atau video langsung di undangan digitalmu",
    },
    {
      icon: <Pencil className="w-6 h-6" />,
      title: "Free Revisi",
      description: "Revisi konten undangan secara gratis sebelum disebarkan",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "One Day Service",
      description:
        "Proses pembuatan undangan selesai dalam satu hari kerja setelah data lengkap diterima",
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: "Custom Music",
      description: "Pilih musik favoritmu untuk mengiringi undangan",
    },
  ];

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

        {/* Benefits with Flexbox layout - matching Features component */}
        <div className="flex flex-wrap justify-center max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="w-1/2 md:w-1/3 px-2 sm:px-3 lg:px-4 mb-4 sm:mb-6 lg:mb-8"
            >
              <div className="group h-[170px] sm:h-[220px] w-full [perspective:1000px]">
                <div
                  className="relative h-full w-full transition-transform duration-500 
                           [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]"
                >
                  {/* Front of card */}
                  <div
                    className="absolute inset-0 p-3 sm:p-6 rounded-2xl bg-white 
                            border border-[#3F4D34]/10 hover:border-[#3F4D34]/20
                            flex flex-col items-center justify-center text-center
                            [backface-visibility:hidden]"
                  >
                    <div
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-[#3F4D34]/10
                              flex items-center justify-center mb-2 sm:mb-4
                              transition-all duration-300 ease-in-out
                              group-hover:scale-110"
                    >
                      <div className="text-[#3F4D34]">{benefit.icon}</div>
                    </div>
                    <h3 className="font-secondary text-sm sm:text-lg md:text-xl text-[#3F4D34]">
                      {benefit.title}
                    </h3>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 p-3 sm:p-6 rounded-2xl bg-[#3F4D34]
                            flex items-center justify-center text-center
                            [backface-visibility:hidden] [transform:rotateX(180deg)]"
                  >
                    <p className="font-secondary text-white text-xs sm:text-base leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
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
