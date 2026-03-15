"use client";

import Image from "next/image";
import { Share2 } from "lucide-react";
import ProductCard from "@/src/components/ProductCard/ProductCard";
import { StartupInfo } from "@/src/types/star-up/detail-startup";
import ErrorState from "@/src/components/shared/ErrorState";

interface DetailProfilProps {
    startup: StartupInfo;
    products: {
        id: string;
        title: string;
        category: string;
        description: string;
        price: number;
        image: string;
    }[];
}

export default function DetailProfilStartup({ startup: data, products: filteredProducts }: DetailProfilProps) {

    // JIKA DATA TIDAK DITEMUKAN
    if (!data) {
        return (
            <ErrorState
                title="Profil Startup Belum Tersedia"
                message={`Kami tidak bisa menemukan startup yang kamu cari.`}
                suggestion="Tips: Cari startup keren lainnya di halaman utama kami."
            />
        );
    }

    return (
        <main className="bg-white mt-10 md:mt-20 min-h-screen">
            {/* HEADER BANNER */}
            <section className="relative w-full h-[249px]">
                <Image src={data.bannerImage} alt="Banner" fill className="object-cover" priority />
            </section>

            <div className="max-w-[1440px] mx-auto px-6 md:px-[100px] relative">
                {/* FOTO PROFIL OVERLAP (LINGKARAN) */}
                <div className="absolute -top-[75px] w-[151px] h-[151px] rounded-full border-[5px] border-white overflow-hidden bg-white shadow-md z-10">
                    <Image src={data.profileImage} alt={data.name} fill className="object-cover" />
                </div>


                {/* INFO & TEAM GRID */}
                <div className="flex flex-col lg:flex-row gap-[57px] mb-[100px]">
                    {/* SISI KIRI: DESKRIPSI */}
                    <div className="flex-1">
                        {/* MENU HEADER */}
                        <div className="flex justify-between items-center pt-[100px] mb-8">
                            <span className="text-[#0062FF] font-semibold text-[16px]">PROFIL</span>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Tautan Disalin!");
                                }}
                                className="flex items-center gap-2 text-[#1E1E1E] hover:opacity-60 transition-all"
                            >
                                {/* logo share */}
                                <Image src="/images/svg/icons/share.svg" alt="Share Icon" width={18} height={18} />
                                <span className="text-[14px]">Bagikan</span>
                            </button>
                        </div>
                        <div className="select-none flex justify-between items-center gap-4 mb-6 flex-wrap">
                            <h1 className="text-[32px] md:text-[40px] font-bold text-[#1E1E1E]">{data.name}</h1>
                            <span className="bg-[#CFE1FF] text-[#0062FF] px-4 py-2 rounded-[8px] text-[16px] font-medium">
                                {data.category}
                            </span>
                        </div>
                        <p className="text-[16px] md:text-[20px] leading-[160%] text-[#7F7F7F] max-w-[810px]">
                            {data.description}
                        </p>
                    </div>

                    {/* SISI KANAN: TIM STARTUP */}
                    <div className="w-full lg:w-[316px] mt-4 md:mt-20 border-t lg:border-t-0 lg:border-l border-[#E5E5E5] pt-8 lg:pt-0 lg:pl-[57px]">
                        <h2 className="text-[#0062FF] font-semibold text-[14px] mb-8 tracking-wider">TIM STARTUP</h2>
                        <div className="flex flex-col gap-6">
                            {data.team.map((member) => (
                                <div key={member.id} className="flex items-center gap-4 group">
                                    {/* Foto Black & White */}
                                    <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 border border-gray-100">
                                        <Image src={member.photo} alt={member.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[11px] text-[#7F7F7F]">{member.role}</span>
                                        <span className="text-[16px] font-semibold text-[#1E1E1E] leading-tight">{member.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* PRODUK KAMI */}
                <section className="pb-[120px]">
                    <h2 className="text-[22px] font-bold text-[#1E1E1E] mb-8">Produk Kami</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))
                        ) : (
                            <p className="text-gray-400">Toko ini belum memiliki produk.</p>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}