import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Apakah ada batas revisinya?",
    answer:
      "Untuk revisi maksimal 2x jika lebih dari itu akan dikenakan biaya sebesar 50.000 / revisi.",
  },
  {
    question: "Apakah boleh request backsound/music?",
    answer: "Kamu bebas request music apapun yg kamu suka.",
  },
  {
    question: "Apakah bisa request ilustrasi?",
    answer:
      "Request ilustrasi baju pengantin sepasang adalah sebesar 200rb. Atau kamu bisa request ganti dengan foto asli.",
  },
  {
    question: "Apakah bisa request kata-kata?",
    answer:
      "Ya kamu bisa request kata kata dengan catatan hnya mengganti slot text yg ada.",
  },
  {
    question: "Berapa lama proses pembuatannya?",
    answer:
      "Untuk membuat undangan video 3D adalah sekitar 5-7 hari kerja belum termasuk revisi.",
  },
  {
    question: "Apakah bisa di custom desain?",
    answer:
      "Tentu saja kamu bisa custom desain harga fleksible sesuai dengan kerumitan. Silakan konsultasi terlebih dahulu dengan admin.",
  },
  {
    question: "Apa format video yang saya terima?",
    answer:
      "Anda akan mendapatkan file video mp4 Ukuran Full HD 1080x1920 dikirim via google drive.",
  },
];

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <button
        className="flex w-full items-center justify-between p-6 text-left "
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-secondary text-[#3F4D34] text-base sm:text-lg font-medium pr-4">
          {question}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-[#3F4D34]/60 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="p-6 pt-0">
          <p className="font-secondary text-[#3F4D34]/80 text-sm sm:text-base leading-relaxed">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}

function FAQ() {
  return (
    <section className="px-4 py-20 sm:py-28 bg-[#3F4D34]/5">
      <div className="container mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="font-primary text-2xl sm:text-3xl md:text-4xl text-[#3F4D34] mb-4">
            Pertanyaan yang Sering Ditanyakan
          </h2>
          <p className="font-secondary text-[#3F4D34]/80 max-w-2xl mx-auto">
            Temukan jawaban untuk pertanyaan umum tentang layanan video undangan
            digital kami
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;
