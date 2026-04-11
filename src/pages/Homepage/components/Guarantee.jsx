import { ShieldCheck, ThumbsUp } from "lucide-react";
import guaranteeImage from "../../../assets/guarantee-300.webp";

function Guarantee() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto max-w-xs text-center">
        <img
          src={guaranteeImage}
          alt="Money Back Guarantee"
          className="w-28 h-28 mx-auto mb-4"
          width="300"
          height="300"
          loading="lazy"
          decoding="async"
        />
        <h3 className="font-primary text-xl sm:text-2xl text-[#3F4D34] mb-2">
          Garansi 100% Uang Kembali
        </h3>
        <p className="font-secondary text-sm sm:text-base text-[#3F4D34]/70 leading-relaxed mb-8">
          Apabila undangan tidak di kerjakan dalam waktu 3 hari (kecuali hari
          libur)
        </p>

        {/* Trust badges */}
        <div className="flex justify-center gap-10">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-9 h-9 text-[#3F4D34]/40" />
            <span className="font-secondary text-xs tracking-widest uppercase text-[#3F4D34]/50">
              Transaksi Aman
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ThumbsUp className="w-9 h-9 text-[#3F4D34]/40" />
            <span className="font-secondary text-xs tracking-widest uppercase text-[#3F4D34]/50">
              Jaminan Kepuasan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Guarantee;
