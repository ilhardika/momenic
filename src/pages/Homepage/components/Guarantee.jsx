import { Clock, CheckCircle } from "lucide-react";
import guaranteeImage from "../../../assets/guarantee-300.webp";

function Guarantee() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-[#F8FAF5]">
      <div className="container mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl shadow-lg border border-[#E8F0DE]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-[#8FAD83]"></div>
            <div className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full bg-[#8FAD83]"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 bg-white p-6 sm:p-8 flex flex-col items-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#EAEFE5] mb-4">
              <Clock className="w-4 h-4 text-[#3F4D34] mr-2" />
              <span className="text-[#3F4D34] font-medium text-sm">
                Jaminan Cepat
              </span>
            </div>

            {/* Main Content */}
            <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8">
              {/* Guarantee Image */}
              <div className="w-36 md:w-40 flex-shrink-0">
                <img
                  src={guaranteeImage}
                  alt="Money Back Guarantee"
                  className="w-full h-auto"
                  width="300"
                  height="300"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div>
                {/* Key Points - Bulleted for easy scanning */}
                <ul className="space-y-2 font-secondary">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#3F4D34] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Pengerjaan maksimal <strong>3 hari kerja</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#3F4D34] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Jika lebih lama, <strong>uang kembali 100%</strong>
                    </span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-[#3F4D34] mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">
                      Tidak termasuk hari libur dan weekend
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Guarantee;
