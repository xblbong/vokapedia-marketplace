import FilterSidebar from "@/src/components/FilterSidebar/FilterSidebar";
import ProductCard from "@/src/components/ProductCard/ProductCard";
import ProductHero from "@/src/components/ProductCard/ProductHero";


export default function ProdukPage() {
  return (
    <main className="min-h-screen bg-[#F6F6F6] pb-20">
      <ProductHero />
      
      <div className="layout-container flex flex-col lg:flex-row gap-10">
        {/* KIRI: Filter Sidebar */}
        <FilterSidebar />

        {/* KANAN: Content Area */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="flex justify-between items-center">
             <h2 className="text-[24px] font-bold text-[#1E1E1E]">Semua Produk</h2>
          </div>

          {/* Grid Produk - Menggunakan Flex Wrap agar responsive */}
          <div className="flex flex-wrap gap-6 justify-center lg:justify-start">
            {/* Map data produk kamu di sini */}
            {[1,2,3,4,5,6,7,8,9].map((id) => (
              <ProductCard
                key={id} 
                product={{
                  id: String(id),
                  title: "Pop Ame",
                  category: "Desain Grafis",
                  description: "Aksesori handmade dari bahan daur ulang...",
                  price: 17000,
                  image: "/images/p-1.jpg"
                }} 
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center opacity-50">←</button>
            <button className="w-10 h-10 rounded-full bg-[#0062FF] text-white font-bold">1</button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50">2</button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50">3</button>
            <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50">→</button>
          </div>
        </div>
      </div>
    </main>
  );
}