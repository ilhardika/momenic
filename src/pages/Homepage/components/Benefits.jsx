import { Pencil, Clock, Music } from "lucide-react";

const benefits = [
  {
    icon: Pencil,
    label: "Free Revisi",
    desc: "Revisi konten undangan secara gratis sebelum disebarkan.",
    number: "01",
  },
  {
    icon: Clock,
    label: "One Day Service",
    desc: "Selesai dalam 1 hari kerja setelah semua data lengkap diterima.",
    number: "02",
  },
  {
    icon: Music,
    label: "Custom Backsound",
    desc: "Pilih lagu favorit untuk mengiringi undangan digitalmu.",
    number: "03",
  },
];

const Benefits = () => {
  return (
    <section className="py-16 sm:py-20 px-4 bg-[#3F4D34] overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-12 sm:mb-14">
          <p className="font-secondary text-xs tracking-[0.2em] uppercase text-white/50 mb-3">
            Keunggulan Kami
          </p>
          <h2 className="font-primary text-3xl sm:text-4xl text-white">
            Kenapa Momenic?
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden">
          {benefits.map(({ icon: Icon, label, desc, number }) => (
            <div
              key={label}
              className="relative bg-[#3F4D34] p-8 group hover:bg-[#4e6040] transition-colors duration-300"
            >
              {/* Large faded number */}
              <span className="absolute top-5 right-6 font-primary text-6xl text-white/[0.06] select-none leading-none">
                {number}
              </span>

              {/* Icon */}
              <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20 transition-colors duration-300">
                <Icon className="w-5 h-5 text-white" />
              </div>

              {/* Text */}
              <h3 className="font-secondary font-semibold text-lg text-white mb-2">
                {label}
              </h3>
              <p className="font-secondary text-sm text-white/60 leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
