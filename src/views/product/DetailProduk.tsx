"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductView from "@/src/components/ProductCard/ProductView";
import StartupSummary from "@/src/components/StartupSummary/StartupSummary";
import ProductCard from "@/src/components/ProductCard/ProductCard";

interface DetailProdukProps {
    productData: {
        id: string;
        title: string;
        description: string;
        price: number;
        images: string[];
        ecommerceUrl: string;
        whatsappUrl: string;
    };
    startupData: {
        id: string;
        name: string;
        logoUrl: string;
        productCount: number;
        category: string;
        studyProgram: string;
        hasEcommerce: boolean;
        hasWhatsapp: boolean;
    };
    otherProducts: {
        id: string;
        title: string;
        category: string;
        description: string;
        price: number;
        image: string;
    }[];
}

export default function DetailProduk({ productData, startupData, otherProducts }: DetailProdukProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    // State untuk mengontrol visibilitas tombol
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Fungsi untuk mengecek posisi scroll
    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
            setCanScrollLeft(scrollLeft > 5);
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
            
            {otherProducts.length > 0 && (
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
                        {canScrollLeft && (
                            <button
                                onClick={() => scroll("left")}
                                className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full hidden lg:flex items-center justify-center border border-gray-100 text-[#1E1E1E] hover:bg-[#0062FF] hover:text-white transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}

                        <div
                            ref={scrollRef}
                            onScroll={checkScrollPosition}
                            className="flex flex-nowrap overflow-x-auto gap-4 md:gap-6 pb-6 snap-x snap-mandatory scrollbar-hide"
                        >
                            {otherProducts.map((item) => (
                                <div key={item.id} className="flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[31.5%] snap-start">
                                    <ProductCard product={item} />
                                </div>
                            ))}
                        </div>

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
            )}
        </main>
    );
}
