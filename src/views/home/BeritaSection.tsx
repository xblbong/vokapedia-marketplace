"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface BeritaProps {
    berita: {
        slug: string;
        judul: string;
        isi_berita: string;
        gambar: string;
        section_type: string;
        tanggal: string;
        kategori: string;
    }[];
    title: string;
}

export default function BeritaSection({ berita, title }: BeritaProps) {
    if (berita.length === 0) {
        return (
            <section className="w-full bg-white mt-10 md:mt-20 mb-10">
                <div className="layout-container py-10 border-b border-gray-200">
                    <h2 className="text-[24px] md:text-[32px] font-bold text-[#1E1E1E] mb-8">{title}</h2>
                    <p className="text-center text-gray-500 py-10">Belum ada berita terbaru saat ini.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="w-full bg-white mt-10 md:mt-20 mb-10 border-b border-gray-200">
            <div className="layout-container py-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className="text-[24px] md:text-[32px] font-bold text-[#1E1E1E]">{title}</h2>
                    <Link href="/berita" className="group flex items-center gap-2 text-[#0062FF] font-bold hover:underline">
                        Lihat Semua <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

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
                                    {item.isi_berita}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
