import {
  Quote,
  Users,
  MapPin,
  MessageSquareHeart,
  Clock,
  Image,
  Wallet,
  Heart,
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Quote className="w-6 h-6" />,
      title: "Quotes & Salam",
      description:
        "Tambahkan kata-kata bermakna dan salam pembuka yang mewakili momen spesialmu",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Profil Mempelai",
      description:
        "Perkenalkan dirimu dengan tampilan profil yang elegan dan menarik",
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Integrasi Maps",
      description:
        "Mudahkan tamu menemukan lokasi acara dengan petunjuk arah yang akurat",
    },
    {
      icon: <MessageSquareHeart className="w-6 h-6" />,
      title: "RSVP & Ucapan",
      description:
        "Terima konfirmasi kehadiran dan ucapan dari para tamu secara digital",
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Countdown Acara",
      description:
        "Hitung mundur menuju momen spesialmu dengan tampilan yang menarik",
    },
    {
      icon: <Image className="w-6 h-6" />,
      title: "Galeri Foto, Video & Streaming",
      description: "Bagikan momen indahmu melalui galeri yang memukau",
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      title: "Amplop Digital",
      description:
        "Terima hadiah secara digital melalui berbagai metode pembayaran",
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Love Story",
      description: "Ceritakan kisah cintamu dengan timeline yang menarik",
    },
  ];

  return (
    <section className="py-20 sm:py-28 px-4 bg-[#E4E9CB]/30">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-6">
            Fitur Undangan Paling Lengkap
          </h2>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Berbagai fitur menarik yang dapat kamu sesuaikan dengan kebutuhan
            undangan digitalmu
          </p>
        </div>

        {/* Features with Flexbox layout */}
        <div className="flex flex-wrap justify-center max-w-4xl mx-auto">
          {features.map((feature, index) => (
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
                      <div className="text-[#3F4D34]">{feature.icon}</div>
                    </div>
                    <h3 className="font-secondary text-sm sm:text-lg md:text-xl text-[#3F4D34]">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Back of card */}
                  <div
                    className="absolute inset-0 p-3 sm:p-6 rounded-2xl bg-[#3F4D34]
                            flex items-center justify-center text-center
                            [backface-visibility:hidden] [transform:rotateX(180deg)]"
                  >
                    <p className="font-secondary text-white text-xs sm:text-base leading-relaxed">
                      {feature.description}
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

export default Features;