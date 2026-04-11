import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Cara memesan undangan?",
    a: (
      <ol className="list-decimal list-inside space-y-1">
        <li>Silahkan pilih tema yang kamu inginkan kemudian klik pesan sekarang.</li>
        <li>Lakukan pembayaran, setelah melakukan pembayaran lakukan konfirmasi ke whatsapp admin.</li>
        <li>Setelah konfirmasi ke admin melalui whatsapp. Kemudian selanjutnya pesanan kamu akan segera di proses.</li>
      </ol>
    ),
  },
  {
    q: "Berapa lama undangan aktif?",
    a: "Untuk masa aktif undangan 1 tahun.",
  },
  {
    q: "Tanggal dan waktu belum fix?",
    a: "Kamu tetap bisa melakukan pemesanan walaupun tanggal dan waktu belum fix, karena nanti bisa menyusul bisa di edit kapanpun dan dimanapun.",
  },
  {
    q: "Belum foto prewedding?",
    a: "Jika kamu belum ada foto prewedding, kamu tetap bisa melakukan pemesanan dan mengisi data yang di perlukan terlebih dahulu. Jadi foto prewedding bisa menyusul.",
  },
  {
    q: "Tidak punya foto prewedding?",
    a: "Tenang, kami menyediakan tema tanpa foto yang bisa kamu gunakan. Atau kamu bisa menggunakan foto ilustrasi sebagai foto pengganti prewedding kamu. Kami sudah menyediakan beberapa pilihan ilustrasinya.",
  },
  {
    q: "Berapa lama proses pengerjaan?",
    a: "Untuk proses pembuatan 1-3 hari setelah semua data lengkap kami terima.",
  },
  {
    q: "Apakah ada batasan kirim undangan?",
    a: "Tidak ada batas untuk kirim undangan, cukup satu undangan untuk kirim ke banyak tamu.",
  },
  {
    q: "Apakah bisa refund?",
    a: "Setelah anda melakukan pembayaran, pesanan kamu tidak dapat dibatalkan. Silahkan kontak admin jika ada permasalahan.",
  },
  {
    q: "Persetujuan penting untuk dibaca!",
    a: "Bagi kamu yang sudah melakukan pemesanan di website kami, data yang masuk akan menjadi katalog dan portofolio. Jika itu dirasa keberatan, silakan hubungi admin.",
  },
];

const FAQItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#3F4D34]/10 last:border-0">
      <button
        className="w-full flex items-center justify-between gap-4 py-4 text-left"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <span className="font-secondary text-sm sm:text-base text-[#3F4D34] font-medium">
          {q}
        </span>
        <ChevronDown
          className={`flex-shrink-0 w-5 h-5 text-[#3F4D34] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-4 font-secondary text-sm sm:text-base text-[#3F4D34]/80 leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  return (
    <section className="py-14 sm:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-2xl">
        <h2 className="font-primary text-3xl sm:text-4xl text-[#3F4D34] mb-8 text-center">
          FAQ
        </h2>
        <div className="rounded-2xl border border-[#3F4D34]/10 bg-[#F7F8F4] px-5 sm:px-8">
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
