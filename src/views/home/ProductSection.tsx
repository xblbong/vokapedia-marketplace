"use client";

import ProductCard from "@/src/components/ProductCard/ProductCard";

const MOCK_PRODUCTS = [
  { id: "1", title: "Pop Ame", category: "Desain Grafis", description: "Aksesori handmade dari bahan daur ulang dengan desain playful dan customizable", price: 17000, image: "/images/svg/product1.svg" },
  { id: "2", title: "Ravière", category: "Teknologi Informasi", description: "Modest fashion minimalis dengan desain yang ringan, nyaman, dan timeless", price: 17000, image: "/images/svg/product1.svg" },
  { id: "3", title: "Anyare", category: "Desain Grafis", description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, elegan, dan modern", price: 17000, image: "/images/svg/product1.svg" },
  { id: "4", title: "Briviba", category: "Manajemen Bisnis", description: "Brand Apparel yang mengekspresikan gaya dengan desain yang nyaman untuk daily wear.", price: 17000, image: "/images/svg/product1.svg" },
  { id: "5", title: "Kukatoo", category: "Desain Grafis", description: "Cookies dengan berbagai varian rasa unik yang dikemas dan dibuat untuk camilan sehari - hari", price: 17000, image: "/images/svg/product1.svg" },
  { id: "6", title: "Nocturnals", category: "Administrasi Bisnis", description: "Brand Streetwear limited edition premium yang menghadirkan desain eksklusif dan menarik", price: 17000, image: "/images/svg/product1.svg" },
];

export default function ProductSection() {
  return (
    <section className="layout-container py-10 md:py-16 lg:py-[80px] flex flex-col gap-8 md:gap-[40px]">

      {/* Header: Title & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#1E1E1E]">
          Produk Kami
        </h2>

        {/* Filter Section - Di mobile dibuat scrollable jika terlalu panjang */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 items-center w-full md:w-auto">
          <span className="text-[16px] md:text-[20px] font-bold text-[#1E1E1E]">Filter</span>
          <div className="flex gap-2 sm:gap-3">
            <div className="border border-[#C3C3C3] rounded-[10px] px-3 py-2 md:px-[12px] md:py-[6px] flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-[13px] md:text-[16px]">Prodi</span>
              <svg width="10" height="6" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
            <div className="border border-[#C3C3C3] rounded-[10px] px-3 py-2 md:px-[12px] md:py-[6px] flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
              <span className="text-[13px] md:text-[16px]">Kategori</span>
              <svg width="10" height="6" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round" /></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-y-8 gap-x-5 md:gap-x-6 lg:gap-x-8">
        {MOCK_PRODUCTS.map((item) => (
          <div
            key={item.id}
            className="flex w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-24px)] max-w-[397px]"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      {/* Button Action: Padding & Font dinamis */}
      <button className="w-full h-[54px] md:h-[68px] bg-[#1E1E1E] rounded-[12px] md:rounded-[15px] mt-4 flex items-center justify-center gap-3 group hover:bg-black transition-all">
        <span className="text-white text-[16px] md:text-[20px] font-bold">Lihat Semua Produk</span>
        <svg
          className="transition-transform group-hover:translate-x-2 w-5 h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </button>

    </section>
  );
}