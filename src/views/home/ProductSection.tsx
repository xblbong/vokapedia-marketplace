"use client";

import ProductCard from "@/src/components/ProductCard/ProductCard";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductSectionProps {
  products: {
    id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    image: string;
  }[];
}

export default function ProductSection({ products }: ProductSectionProps) {
  const router = useRouter();

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
            <select
              onChange={(e) => { if (e.target.value) router.push(`/produk?prodi=${e.target.value}`) }}
              className="border border-[#C3C3C3] rounded-[10px] px-3 py-2 md:px-[12px] md:py-[6px] text-[13px] md:text-[16px] cursor-pointer hover:bg-gray-50 transition-colors appearance-none pr-8 bg-no-repeat bg-[position:right_10px_center] outline-none"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%231E1E1E' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}
            >
              <option value="" disabled selected>Prodi</option>
              <option value="Teknologi Informasi">Teknologi Informasi</option>
              <option value="Administrasi Bisnis">Administrasi Bisnis</option>
              <option value="Keuangan & Perbankan">Keuangan & Perbankan</option>
              <option value="Manajemen Perhotelan">Manajemen Perhotelan</option>
              <option value="Desain Grafis">Desain Grafis</option>
            </select>
            
            <select
              onChange={(e) => { if (e.target.value) router.push(`/produk?kategori=${e.target.value}`) }}
              className="border border-[#C3C3C3] rounded-[10px] px-3 py-2 md:px-[12px] md:py-[6px] text-[13px] md:text-[16px] cursor-pointer hover:bg-gray-50 transition-colors appearance-none pr-8 bg-no-repeat bg-[position:right_10px_center] outline-none"
              style={{ backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L6 6L11 1' stroke='%231E1E1E' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")` }}
            >
              <option value="" disabled selected>Kategori</option>
              <option value="Fashion">Fashion</option>
              <option value="Aksesori">Aksesori</option>
              <option value="Kuliner">Kuliner</option>
              <option value="Interior & Dekor">Interior & Dekor</option>
              <option value="Jasa Kreatif">Jasa Kreatif</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-start gap-y-8 gap-x-5 md:gap-x-6 lg:gap-x-8">
        {products.map((item) => (
          <div
            key={item.id}
            className="flex w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-24px)] max-w-[397px]"
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>

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