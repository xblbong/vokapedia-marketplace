"use client";

import React, { useRef, use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductView from "@/src/components/ProductCard/ProductView";
import StartupSummary from "@/src/components/StartupSummary/StartupSummary";
import ProductCard from "@/src/components/ProductCard/ProductCard";


const startupData = {
    id: "startup-123",
    name: "Pop Ame",
    logoUrl: "/images/svg/pp-akun.svg",
    productCount: 5,
    category: "Aksesoris",
    studyProgram: "Desain Grafis",
    hasEcommerce: false,
    hasWhatsapp: true
};

const MOCK_PRODUCTS = [
    { id: "1", title: "Pop Ame", category: "Desain Grafis", description: "Aksesori handmade dari bahan daur ulang dengan desain playful dan customizable", price: 17000, image: "/images/svg/product1.svg" },
    { id: "2", title: "Ravière", category: "Teknologi Informasi", description: "Modest fashion minimalis dengan desain yang ringan, nyaman, dan timeless", price: 17000, image: "/images/svg/product1.svg" },
    { id: "3", title: "Anyare", category: "Desain Grafis", description: "Produk dekoratif olahan limbah tempurung kelapa dengan desain sederhana, elegan, dan modern", price: 17000, image: "/images/svg/product1.svg" },
    { id: "4", title: "Briviba", category: "Manajemen Bisnis", description: "Brand Apparel yang mengekspresikan gaya dengan desain yang nyaman untuk daily wear.", price: 17000, image: "/images/svg/product1.svg" },
    { id: "5", title: "Kukatoo", category: "Desain Grafis", description: "Cookies dengan berbagai varian rasa unik yang dikemas dan dibuat untuk camilan sehari - hari", price: 17000, image: "/images/svg/product1.svg" },
    { id: "6", title: "Nocturnals", category: "Administrasi Bisnis", description: "Brand Streetwear limited edition premium yang menghadirkan desain eksklusif dan menarik", price: 17000, image: "/images/svg/product1.svg" },
];


export default function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = use(params);
    const scrollRef = useRef<HTMLDivElement>(null);

    // State untuk mengontrol visibilitas tombol
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Fungsi untuk mengecek posisi scroll
    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

            // Jika scrollLeft > 0, berarti bisa back
            setCanScrollLeft(scrollLeft > 5);

            // Jika scrollLeft + lebar tampilan < total lebar konten, berarti bisa next
            // Kita beri toleransi 5px untuk pembulatan browser
            setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
        }
    };

    // Jalankan pengecekan saat pertama kali render
    useEffect(() => {
        checkScrollPosition();
        window.addEventListener("resize", checkScrollPosition);
        return () => window.removeEventListener("resize", checkScrollPosition);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.8;
            const scrollTo = direction === "left"
                ? scrollRef.current.scrollLeft - scrollAmount
                : scrollRef.current.scrollLeft + scrollAmount;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const productData = {
        id: id,
        title: "Keychain Recycle | Pop Ame",
        description: "Keychain handmade dari bahan daur ulang seperti mainan bekas dan clay...",
        price: 17000,
        images: [
            "/images/svg/product1.svg",
            "/images/png/product2.png",
            "/images/svg/product1.svg",
            "/images/png/product3.png"
        ],
        ecommerceUrl: "https://tokopedia.com",
        whatsappUrl: "https://wa.me/62812345678"
    };

    return (
        <main className="min-h-screen bg-[#F6F6F6]">
            <div className="layout-container mt-36 pt-10">
                <div className="flex items-center gap-2 text-[14px] text-[#8F8F8F]">
                    <Link href="/" className="hover:text-black">Beranda</Link>
                    <ChevronRight size={14} />
                    <Link href="/produk" className="hover:text-black">Produk</Link>
                    <ChevronRight size={14} />
                    <span className="text-black font-medium truncate">{productData.title}</span>
                </div>
            </div>

            <ProductView product={productData} />

            {/* Akun Brand */}
            <StartupSummary startup={startupData} />
            <div className="layout-container mt-10 mb-14">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-[24px] md:text-[28px] font-bold text-[#1E1E1E]">Produk Lainnya</h3>
                        <div className="w-12 h-1 bg-[#0062FF] mt-1 rounded-full"></div>
                    </div>
                    <Link href="/produk" className="group flex items-center gap-2 text-[#0062FF] font-bold hover:underline">
                        Lihat Lainnya <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="relative group/slider">
                    {/* Tombol Back: Muncul HANYA jika canScrollLeft true */}
                    {canScrollLeft && (
                        <button
                            onClick={() => scroll("left")}
                            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden lg:flex items-center justify-center border border-gray-100 text-[#1E1E1E] hover:bg-[#0062FF] hover:text-white transition-all"
                        >
                            <ChevronLeft size={24} />
                        </button>
                    )}

                    {/* Wrapper Scroll: Tambahkan onScroll event */}
                    <div
                        ref={scrollRef}
                        onScroll={checkScrollPosition}
                        className="flex flex-nowrap overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide"
                    >
                        {MOCK_PRODUCTS.map((item) => (
                            <div key={item.id} className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[31.5%] snap-start">
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>

                    {/* Tombol Next: Muncul HANYA jika canScrollRight true */}
                    {canScrollRight && (
                        <button
                            onClick={() => scroll("right")}
                            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden lg:flex items-center justify-center border border-gray-100 text-[#1E1E1E] hover:bg-[#0062FF] hover:text-white transition-all"
                        >
                            <ChevronRight size={24} />
                        </button>
                    )}
                </div>
            </div>
        </main>
    );
}