import { Pencil, Clock, Music } from "lucide-react";

const benefits = [
  {
    icon: Pencil,
    label: "Free Revisi",
    desc: "Revisi konten undangan secara gratis sebelum disebarkan.",
  },
  {
    icon: Clock,
    label: "One Day Service",
    desc: "Selesai dalam 1 hari kerja setelah semua data lengkap diterima.",
  },
  {
    icon: Music,
    label: "Custom Backsound",
    desc: "Pilih lagu favorit untuk mengiringi undangan digitalmu.",
  },
];

const Benefits = () => {
  return (
    <section className="py-16 sm:py-20 px-4 bg-[#F7F8F4]">
      <div className="container mx-auto max-w-4xl">
        <h2 className="font-primary text-3xl sm:text-4xl text-[#3F4D34] text-center mb-12 sm:mb-16">
          Kenapa Momenic?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
          {benefits.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#3F4D34]/10 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-[#3F4D34]" />
              </div>
              <h3 className="font-secondary font-bold text-sm uppercase tracking-wider text-[#3F4D34] mb-3 leading-snug">
                {label}
              </h3>
              <p className="font-secondary text-sm text-[#3F4D34]/60 leading-relaxed">
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