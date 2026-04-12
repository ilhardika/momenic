import { Download } from "lucide-react";

// Dynamically import all ilustrasi images
const ilustrasiModules = import.meta.glob(
  "../../assets/Ilustrasi Undangan Tanpa Foto/*.jpg",
  { eager: true }
);

// Build a lookup map: { "1-1": url, "1-2": url, ... }
const imageMap = {};
Object.entries(ilustrasiModules).forEach(([path, mod]) => {
  const match = path.match(/ilustrasi-(\d+)-(\d+)\.jpg$/);
  if (match) {
    imageMap[`${match[1]}-${match[2]}`] = mod.default;
  }
});

// Count how many unique ilustrasi groups exist
const totalGroups = Math.max(
  ...Object.keys(imageMap).map((k) => parseInt(k.split("-")[0]))
);

const groups = Array.from({ length: totalGroups }, (_, i) => i + 1);

// display order: Bersama (2), Wanita (1), Pria (3)
const displayOrder = [2, 1, 3];
const posLabel = {
  1: "Mempelai Wanita",
  2: "Mempelai Bersama",
  3: "Mempelai Pria",
};

function handleDownload(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.click();
}

function IlustrasiPage() {
  return (
    <div className="min-h-screen bg-white py-20 sm:py-28">
      {/* Header */}
      <div className="container mx-auto max-w-6xl px-4 mt-10 mb-12 text-center">
        <h1 className="font-primary text-3xl sm:text-4xl md:text-5xl text-[#3F4D34] mb-4">
          Ilustrasi <strong>Mempelai</strong>
        </h1>
        <p className="font-secondary text-[#3F4D34]/70 text-base sm:text-lg max-w-xl mx-auto">
          Koleksi ilustrasi mempelai untuk undangan digital tanpa foto
        </p>
      </div>

      {/* Groups */}
      <div className="container mx-auto max-w-5xl px-4 flex flex-col gap-10">
        {groups.map((num) => {
          const images = displayOrder.map((pos) => ({
            pos,
            url: imageMap[`${num}-${pos}`],
            label: posLabel[pos],
            filename: `ilustrasi-${num}-${pos}.jpg`,
          }));

          return (
            <div key={num} className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Group Header */}
              <div className="bg-[#3F9E8E] text-white text-center py-3 px-4">
                <span className="font-secondary font-semibold tracking-widest text-sm">
                  ILUSTRASI {String(num).padStart(2, "0")}
                </span>
              </div>

              {/* Images Grid */}
              <div className="bg-white p-4 grid grid-cols-3 gap-3 sm:gap-4">
                {images.map(({ pos, url, label, filename }) => (
                  <div key={pos} className="relative group rounded-xl overflow-hidden bg-gray-50">
                    {url ? (
                      <>
                        <img
                          src={url}
                          alt={`Ilustrasi ${num} - ${label}`}
                          className="w-full aspect-square object-cover object-top"
                          loading="lazy"
                        />
                        {/* Download Button */}
                        <button
                          onClick={() => handleDownload(url, filename)}
                          title={`Download ${label}`}
                          className="absolute bottom-2 right-2 bg-[#3F9E8E] hover:bg-[#347f71] text-white rounded-lg p-1.5 shadow-md transition-colors"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full aspect-square flex items-center justify-center text-gray-300 text-xs">
                        Tidak tersedia
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Labels */}
              <div className="bg-white pb-4 px-4 grid grid-cols-3 gap-3 sm:gap-4">
                {images.map(({ pos, label }) => (
                  <p key={pos} className="text-center font-secondary text-xs text-[#3F4D34]/60">
                    {label}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default IlustrasiPage;
