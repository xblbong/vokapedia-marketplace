import FilterSidebar from "@/src/components/FilterSidebar/FilterSidebar";
import ProductCard from "@/src/components/ProductCard/ProductCard";
import ProductHero from "@/src/components/ProductCard/ProductHero";

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

                    <div className="flex flex-wrap justify-center gap-y-8 gap-x-5 md:gap-x-6 lg:gap-x-8">
                        {MOCK_PRODUCTS.map((item) => (
                            <div
                                key={item.id}
                                className="flex w-full sm:w-[40rem] lg:w-[17rem]"
                            >
                                <ProductCard product={item} />
                            </div>
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