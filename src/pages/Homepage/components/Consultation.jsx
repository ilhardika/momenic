import { MessageCircle } from "lucide-react";

const Consultation = () => {
  return (
    <section className="py-14 sm:py-16 px-4 bg-[#F7F8F4]">
      <div className="container mx-auto max-w-xl text-center">
        <h2 className="font-primary text-3xl sm:text-4xl text-[#3F4D34] mb-4">
          Butuh Konsultasi?
        </h2>
        <p className="font-secondary text-[#3F4D34]/80 text-base sm:text-lg leading-relaxed mb-8">
          Jika kamu memiliki pertanyaan lain yang belum terjawab atau
          membutuhkan informasi lainnya mengenai undangan digital, silakan
          kontak kami.
        </p>
        <a
          href="https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo,%20saya%20ingin%20konsultasi%20tentang%20undangan%20digital"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-[#3F4D34] text-white font-secondary rounded-full hover:bg-[#2c3823] transition-colors shadow-md"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Hubungi Kami</span>
        </a>
      </div>
    </section>
  );
};

export default Consultation;
