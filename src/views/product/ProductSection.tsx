"use client";
import { useState } from "react";
import FilterSidebar from "@/src/components/FilterSidebar/FilterSidebar";
import Pagination from "@/src/components/Pagination/Pagination";
import ProductCard from "@/src/components/ProductCard/ProductCard";
import ProductHero from "@/src/components/ProductCard/ProductHero";
import StartupSummary from "@/src/components/StartupSummary/StartupSummary";

const MOCK_PRODUCTS = [
    { id: "1", title: "Pop Ame", category: "Desain Grafis", description: "Aksesori handmade dari bahan daur ulang dengan desain playful dan customizable", price: 17000, image: "/images/svg/product1.svg" },
    { id: "2", title: "Ravière", category: "Teknologi Informasi", description: "Modest fashion minimalis dengan desain yang ringan, nyaman, dan timeless", price: 17000, image: "/images/svg/product1.svg" },
    { id: "3", title: "Anyare", category: "Desain Grafis", description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, elegan, dan modern", price: 17000, image: "/images/svg/product1.svg" },
    { id: "4", title: "Briviba", category: "Manajemen Bisnis", description: "Brand Apparel yang mengekspresikan gaya dengan desain yang nyaman untuk daily wear.", price: 17000, image: "/images/svg/product1.svg" },
    { id: "5", title: "Kukatoo", category: "Desain Grafis", description: "Cookies dengan berbagai varian rasa unik yang dikemas dan dibuat untuk camilan sehari - hari", price: 17000, image: "/images/svg/product1.svg" },
    { id: "6", title: "Nocturnals", category: "Administrasi Bisnis", description: "Brand Streetwear limited edition premium yang menghadirkan desain eksklusif dan menarik", price: 17000, image: "/images/svg/product1.svg" },
];


export default function ProductSection() {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 3;

    return (
        <main className="min-h-screen bg-[#F6F6F6] pb-20">
            <ProductHero />

            <div className="layout-container flex flex-col lg:flex-row gap-8 xl:gap-12 mt-10 px-4 md:px-10 lg:px-0">

                {/* KIRI: Filter Sidebar (Akan berada di atas di mobile, di kiri di desktop) */}
                <aside className="w-full lg:w-[280px] shrink-0">
                    <FilterSidebar />
                </aside>

                {/* KANAN: Content Area */}
                <div className="flex-1 flex flex-col gap-6 md:gap-8">

                    {/* Title Header */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-[20px] md:text-[24px] font-bold text-[#1E1E1E]">
                            Semua Produk
                        </h2>
                        <p className="text-[12px] md:text-[14px] text-[#8F8F8F]">
                            Menampilkan {MOCK_PRODUCTS.length} Produk
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-y-6 gap-x-4 md:gap-x-6">
                        {MOCK_PRODUCTS.map((item) => (
                            <div
                                key={item.id}
                                className="flex w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] max-w-[400px] lg:max-w-none"
                            >
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}