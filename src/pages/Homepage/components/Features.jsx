import { Check } from "lucide-react";

const features = [
  "Sebar Undangan Sepuasnya",
  "Custom Penerima Nama Tamu",
  "Profil Mempelai",
  "Informasi Detail Acara",
  "Bisa Ganti Tema",
  "Konfirmasi Kehadiran / RSVP",
  "Ucapan & Do'a",
  "Bebas Custom Backsound",
  "Navigasi Google Map",
  "Amplop Digital (No. Rekening)",
  "Penerima Kado",
  "Galeri Foto",
  "Video Prewedding",
  "Quotes / Ayat Suci",
  "Dresscode",
  "Live Streaming",
  "Love Story",
  "Hitung Mundur (Countdown)",
  "Masa Aktif 1 Tahun",
];

const Features = () => {
  return (
    <section className="py-14 sm:py-16 px-4 bg-[#E4E9CB]/30">
      <div className="container mx-auto max-w-3xl">
        {/* Section Header */}
        <h2 className="font-primary text-3xl sm:text-4xl text-[#3F4D34] mb-8 text-center">
          Fitur Undangan
        </h2>

        {/* Feature List */}
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#3F4D34] flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[2.5]" />
              </span>
              <span className="font-secondary text-sm sm:text-base text-[#3F4D34]">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Features;