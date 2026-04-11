import { MessageCircle, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { trackEvent } from "../../../utils/analytics";

const Consultation = () => {
  return (
    <section id="hubungi" className="py-14 sm:py-16 px-4 bg-[#F7F8F4]">
      <div className="container mx-auto max-w-xl text-center">
        <h2 className="font-primary text-3xl sm:text-4xl text-[#3F4D34] mb-4">
          Butuh Konsultasi?
        </h2>
        <p className="font-secondary text-[#3F4D34]/80 text-base sm:text-lg leading-relaxed mb-8">
          Jika kamu memiliki pertanyaan lain yang belum terjawab atau
          membutuhkan informasi lainnya mengenai undangan digital, silakan
          kontak kami.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://api.whatsapp.com/send?phone=6285179897917&text=Halo%20Minmo,%20saya%20ingin%20konsultasi%20tentang%20undangan%20digital"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("consultation_hubungi_click")}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#3F4D34] text-white font-secondary rounded-full hover:bg-[#2c3823] transition-colors shadow-md"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Hubungi Kami</span>
          </a>
          <Link
            to="/tema"
            onClick={() => trackEvent("consultation_katalog_click")}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-[#3F4D34] text-[#3F4D34] font-secondary rounded-full hover:bg-[#3F4D34] hover:text-white transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Lihat Katalog Undangan</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Consultation;
