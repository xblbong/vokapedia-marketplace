"use client";

import ProductCard from "@/app/components/ProductCard/ProductCard";

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
    <section className="layout-container py-[80px] flex flex-col gap-[40px]">
      
      {/* Header: Title & Filter (Responsive Flex) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-4">
        <h2 className="text-[28px] sm:text-[32px] font-bold text-[#1E1E1E]">Produk Kami</h2>
        
        <div className="flex gap-[16px] items-center self-end sm:self-auto">
          <span className="text-[18px] sm:text-[20px] font-bold text-[#1E1E1E]">Filter</span>
          <div className="flex gap-3">
             <div className="border border-[#C3C3C3] rounded-[10px] px-[12px] py-[6px] flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
               <span className="text-[14px] sm:text-[16px]">Prodi</span>
               <svg width="10" height="6" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/></svg>
             </div>
             <div className="border border-[#C3C3C3] rounded-[10px] px-[12px] py-[6px] flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors">
               <span className="text-[14px] sm:text-[16px]">Kategori</span>
               <svg width="10" height="6" viewBox="0 0 12 8" fill="none"><path d="M1 1L6 6L11 1" stroke="#1E1E1E" strokeWidth="2" strokeLinecap="round"/></svg>
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-between gap-y-[32px] gap-x-[20px]">
        {MOCK_PRODUCTS.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>

      {/* Button Action */}
      <button className="w-full h-[60px] sm:h-[68px] bg-[#1E1E1E] rounded-[15px] mt-[10px] flex items-center justify-center gap-[12px] group hover:bg-black transition-all">
        <span className="text-white text-[18px] sm:text-[20px] font-bold">Lihat Semua Produk</span>
        <svg 
          className="transition-transform group-hover:translate-x-2"
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

    </section>
  );
}