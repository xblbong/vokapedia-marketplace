"use client";

import ProductCard from "@/src/components/ProductCard/ProductCard";
import { ChevronDown, Filter, Search } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";

interface ProductSectionProps {
  products: {
    id: string;
    title: string;
    category: string;
    kategori: string;
    description: string;
    price: number;
    image: string;
  }[];
  prodiList: string[];
  kategoriList: string[];
}

export default function ProductSection({ products, prodiList, kategoriList }: ProductSectionProps) {
  const [activeProdi, setActiveProdi] = useState("");
  const [activeKategori, setActiveKategori] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchProdi = activeProdi ? (product.category === activeProdi || product.category === "Lainnya" && activeProdi === "Lainnya") : true;
      const matchKategori = activeKategori ? (product.kategori === activeKategori || product.kategori === "Lainnya" && activeKategori === "Lainnya") : true;

      return matchProdi && matchKategori;
    });
  }, [products, activeProdi, activeKategori]);

  return (
    <section className="layout-container py-10 md:py-16 lg:py-[80px] flex flex-col gap-8 md:gap-[40px]">

      {/* Header: Title & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full gap-6">
        <h2 className="text-[24px] sm:text-[28px] md:text-[32px] font-bold text-[#1E1E1E]">
          Produk Kami
        </h2>

        {/* Filter Section - Di mobile dibuat scrollable jika terlalu panjang */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">

          {/* Label Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[16px] md:text-[20px] font-bold text-[#1E1E1E]">Filter</span>
          </div>

          {/* Container Select - Di mobile susun vertikal, di tablet+ susun horizontal */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            {/* Select Prodi */}
            <div className="relative w-full sm:w-auto min-w-[140px]">
              <select
                value={activeProdi}
                onChange={(e) => setActiveProdi(e.target.value)}
                className="appearance-none w-full bg-white border border-[#C3C3C3] rounded-[10px] pl-4 pr-10 py-2.5 md:py-2 text-[14px] md:text-[16px] cursor-pointer hover:border-black transition-all outline-none capitalize flex-1 overflow-hidden text-ellipsis"
              >
                <option value="">Semua Prodi</option>
                {prodiList.map((prodi) => (
                  <option key={prodi} value={prodi}>{prodi}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#1E1E1E]" />
            </div>

            {/* Select Kategori */}
            <div className="relative w-full sm:w-auto min-w-[140px]">
              <select
                value={activeKategori}
                onChange={(e) => setActiveKategori(e.target.value)}
                className="appearance-none w-full bg-white border border-[#C3C3C3] rounded-[10px] pl-4 pr-10 py-2.5 md:py-2 text-[14px] md:text-[16px] cursor-pointer hover:border-black transition-all outline-none capitalize flex-1 overflow-hidden text-ellipsis"
              >
                <option value="">Semua Kategori</option>
                {kategoriList.map((kat) => (
                  <option key={kat} value={kat}>{kat}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-[#1E1E1E]" />
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="flex flex-wrap justify-start gap-y-8 gap-x-5 md:gap-x-6 lg:gap-x-8">
          {filteredProducts.map((item) => (
            <div
              key={item.id}
              className="flex w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-24px)] max-w-[397px]"
            >
              <ProductCard product={{ ...item, category: item.category }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-2xl border border-gray-100 text-center px-4 w-full nav-shadow">
          <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] mb-6 relative flex items-center justify-center">
            <Search className="w-full h-full text-gray-300 opacity-60" strokeWidth={1} />
          </div>
          <h3 className="text-[20px] md:text-[24px] font-bold text-[#1E1E1E] mb-3">Produk Tidak Ditemukan</h3>
          <p className="text-[14px] md:text-[16px] text-[#8F8F8F] max-w-[450px] mb-8">
            Belum ada produk untuk kombinasi filter yang dipilih di halaman utama ini.
          </p>
        </div>
      )}

      {/* Button Action: Padding & Font dinamis */}
      <Link href="/produk" className="w-full h-[54px] md:h-[68px] bg-[#1E1E1E] rounded-[12px] md:rounded-[15px] mt-4 flex items-center justify-center gap-3 group hover:bg-black transition-all">
        <span className="text-white text-[16px] md:text-[20px] font-bold">Lihat Semua Produk</span>
        <svg
          className="transition-transform group-hover:translate-x-2 w-5 h-5 md:w-6 md:h-6"
          viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>

    </section>
  );
}