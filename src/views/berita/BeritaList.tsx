"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Pagination from "@/src/components/Pagination/Pagination";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface BeritaListProps {
  berita: {
    slug: string;
    judul: string;
    isi_berita: string;
    gambar: string;
    kategori: string;
    tanggal: string;
  }[];
  currentPage: number;
  totalPages: number;
}

export default function BeritaList({ berita, currentPage, totalPages }: BeritaListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.set("page", page.toString());
    router.push(`${pathname}?${current.toString()}`, { scroll: true });
  };

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>?/gm, '');
  };

  return (
    <div className="layout-container py-10 mt-8 md:mt-14 lg:mt-20">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-[#0062FF] font-medium hover:underline mb-4">
          <ArrowLeft size={16} /> Kembali ke Beranda
        </Link>
        <div className="flex items-center gap-2 text-[13px] md:text-[14px] text-[#8F8F8F] flex-wrap mt-2">
          <Link href="/" className="hover:text-[#1E1E1E]">Beranda</Link>
          <ChevronRight size={14} />
          <span className="text-[#1E1E1E] font-medium">Berita Terbaru</span>
        </div>
      </div>

      <h1 className="text-[28px] md:text-[36px] font-bold text-[#1E1E1E] mb-8">Berita Terbaru</h1>

      {berita.length === 0 ? (
        <p className="text-gray-500 py-10 text-center">Belum ada berita yang diterbitkan saat ini.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {berita.map((item) => (
            <Link
              key={item.slug}
              href={`/berita/${item.slug}`}
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden">
                <Image
                  src={item.gambar || "/images/svg/background.svg"}
                  alt={item.judul}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-[#0062FF] text-white px-3 py-1 rounded-md text-[12px] font-bold capitalize">
                  {item.kategori}
                </div>
              </div>
              <div className="p-5 flex flex-col gap-3 flex-1">
                <span className="text-[12px] font-medium text-gray-500">{item.tanggal}</span>
                <h3 className="text-[18px] font-bold text-[#1E1E1E] line-clamp-2 leading-snug group-hover:text-[#0062FF] transition-colors">
                  {item.judul}
                </h3>
                <p className="text-[14px] text-gray-600 line-clamp-3 leading-relaxed mt-auto">
                  {stripHtml(item.isi_berita).substring(0, 150)}{item.isi_berita.length > 150 ? '...' : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}
