import { ShieldCheck, ThumbsUp } from "lucide-react";

const banks = ["BCA", "BCA Mobile", "Mandiri", "BSI", "CIMB Niaga", "BNI", "BRI", "Alfamart", "Indomaret", "GoPay", "OVO", "DANA", "LinkAja", "ShopeePay", "QRIS"];

const PaymentMethods = () => {
  return (
    <section className="py-14 sm:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-2xl text-center">
        <h2 className="font-secondary text-xs sm:text-sm tracking-[0.2em] uppercase text-[#3F4D34]/50 mb-6">
          Metode Pembayaran
        </h2>

        {/* Bank / Payment logos as styled chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {banks.map((bank) => (
            <span
              key={bank}
              className="font-secondary text-xs sm:text-sm text-[#3F4D34] border border-[#3F4D34]/20 rounded-lg px-3 py-1.5 bg-[#F7F8F4]"
            >
              {bank}
            </span>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex justify-center gap-10 sm:gap-16">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="w-9 h-9 text-[#3F4D34]/40" />
            <span className="font-secondary text-xs sm:text-sm tracking-widest uppercase text-[#3F4D34]/50">
              Transaksi Aman
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ThumbsUp className="w-9 h-9 text-[#3F4D34]/40" />
            <span className="font-secondary text-xs sm:text-sm tracking-widest uppercase text-[#3F4D34]/50">
              Jaminan Kepuasan
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethods;
