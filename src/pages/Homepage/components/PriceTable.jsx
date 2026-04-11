import pricelist from "../../../data/pricelist.json";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const rows = pricelist.pricelist.flatMap((item) => {
  const base = [
    {
      label: item.theme,
      gallery: item.maxGallery ?? null,
      theme: item.theme,
      withPhoto: true,
    },
  ];
  if (item.withoutPhoto) {
    base.push({
      label: `${item.theme} (Tanpa Foto)`,
      gallery: null,
      theme: item.theme,
      withPhoto: false,
    });
  }
  return base;
});

const getPrice = (themeName, withPhoto) => {
  const item = pricelist.pricelist.find((p) => p.theme === themeName);
  if (!item) return { discount: 0, original: 0 };
  if (withPhoto) return { discount: item.discountPrice, original: item.originalPrice };
  return {
    discount: item.withoutPhoto?.discountPrice ?? 0,
    original: item.withoutPhoto?.originalPrice ?? 0,
  };
};

const PriceTable = () => {
  return (
    <section id="harga" className="py-14 sm:py-16 px-4 bg-white">
      <div className="container mx-auto max-w-2xl">
        <h2 className="font-primary text-3xl sm:text-4xl text-[#3F4D34] mb-8 text-center">
          Daftar Harga
        </h2>

        <div className="overflow-hidden rounded-2xl border border-[#3F4D34]/20 shadow-sm">
          <div className="grid grid-cols-3 bg-[#3F4D34] text-white font-secondary text-sm font-medium">
            <div className="px-4 py-3">Tema</div>
            <div className="px-4 py-3 text-center">Galeri (Maks.)</div>
            <div className="px-4 py-3 text-center">Harga</div>
          </div>

          {rows.map((row, i) => {
            const price = getPrice(row.theme, row.withPhoto);
            return (
              <div
                key={i}
                className={`grid grid-cols-3 font-secondary text-sm border-t border-[#3F4D34]/10 ${
                  i % 2 === 0 ? "bg-white" : "bg-[#F7F8F4]"
                }`}
              >
                <div className="px-4 py-3 text-[#3F4D34]">{row.label}</div>
                <div className="px-4 py-3 text-center text-[#3F4D34]/70">
                  {row.gallery != null ? row.gallery : "-"}
                </div>
                <div className="px-4 py-3 text-center">
                  {price.original > price.discount && (
                    <span className="block text-[10px] text-gray-400 line-through leading-none">
                      {formatCurrency(price.original)}
                    </span>
                  )}
                  <span className="font-semibold text-[#3F4D34]">
                    {price.discount > 0 ? formatCurrency(price.discount) : "-"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PriceTable;