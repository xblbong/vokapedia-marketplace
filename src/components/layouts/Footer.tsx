"use client";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-[#00122F] text-white pt-12 md:pt-16 lg:pt-[80px]">
            <div className="layout-container pb-10 md:pb-[60px]">
                {/* Main Grid: Stack di mobile, 2 kolom di tablet, 3 kolom di desktop */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-20">

                    {/* Column 1: Logos & Addresses */}
                    <div className="flex flex-col gap-8 md:gap-10 w-full lg:w-auto">
                        {/* Logos Group: Responsif gap & size */}
                        <div className="flex items-center gap-4 md:gap-6 mb-2">
                            <Image src="/images/svg/logo/ub.svg" alt="UB" width={38} height={40} className="object-contain md:w-[43px] md:h-[44px]" />
                            <Image src="/images/svg/logo/vokasi.svg" alt="Vokasi UB" width={35} height={37} className="object-contain md:w-[40px] md:h-[42px]" />
                            <Image src="/images/svg/logo/bik.svg" alt="BIK" width={60} height={32} className="object-contain md:w-[70px] md:h-[37px]" />
                        </div>

                        {/* Addresses Row: Stack di mobile, row di tablet */}
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-20">
                            <div className="flex flex-col max-w-[280px]">
                                <h4 className="text-[14px] mb-2 font-bold capitalize">Main Campus</h4>
                                <p className="text-[13px] md:text-[14px] leading-[1.6] opacity-70 font-normal">
                                    Jl. Veteran No 12 – 14, Ketawanggede, Malang, Jawa Timur, Indonesia
                                </p>
                            </div>
                            <div className="flex flex-col max-w-[280px]">
                                <h4 className="text-[14px] mb-2 font-bold capitalize">Dieng Campus</h4>
                                <p className="text-[13px] md:text-[14px] leading-[1.6] opacity-70 font-normal">
                                    Jl. Puncak Dieng, Kunci, Kalisongo, Kec. Dau, Kabupaten Malang, Jawa Timur, 65151, Indonesia
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Contact Us */}
                    <div className="flex flex-col min-w-[200px]">
                        <h4 className="text-[14px] font-bold mb-4 md:mb-6 capitalize">Contact Us</h4>
                        <ul className="flex flex-col gap-4">
                            <li className="flex items-center gap-4 text-[13px] md:text-[14px] opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/global-line.svg" alt="Web" width={20} height={20} className="md:w-[22px] md:h-[22px]" />
                                <a href="https://vokasi.ub.ac.id" target="_blank" rel="noopener noreferrer">vokasi.ub.ac.id</a>
                            </li>
                            <li className="flex items-center gap-4 text-[13px] md:text-[14px] opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/whatsapp-line.svg" alt="WA" width={20} height={20} />
                                <span>0896-5294-4096</span>
                            </li>
                            <li className="flex items-center gap-4 text-[13px] md:text-[14px] opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/tiktok-line.svg" alt="Tiktok" width={20} height={20} />
                                <span>@vokasiub</span>
                            </li>
                            <li className="flex items-center gap-4 text-[13px] md:text-[14px] opacity-80 hover:opacity-100 transition-opacity">
                                <Image src="/images/svg/icons/instagram-line.svg" alt="IG" width={20} height={20} />
                                <span>@vokasiub</span>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Email Section */}
                    <div className="flex flex-col gap-4">
                        <h4 className="text-[14px] font-bold capitalize">Email</h4>
                        <button className="w-full sm:w-[227px] h-[40px] md:h-[36px] px-6 py-2 bg-white/10 backdrop-blur-[10px] border border-white/20 rounded-[10px] transition-all duration-300 flex items-center justify-center gap-2 hover:bg-white/20 hover:border-white/40 group">
                            <span className="text-[13px] md:text-[14px] font-medium text-white leading-none">
                                Connect with Us
                            </span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:translate-x-1">
                                <path d="M5 12h14M12 5l7 7-7 7"/>
                            </svg>
                        </button>
                    </div>

                </div>
            </div>

            {/* Copyright Bar: Stack di mobile */}
            <div className="w-full bg-[#002663] py-6">
                <div className="layout-container flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <p className="text-[12px] md:text-[14px] opacity-60">
                        Copyright © 2026 PSIK Fakultas Vokasi Universitas Brawijaya
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-[12px] md:text-[14px] opacity-60">
                        <Link href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
                        <Link href="#" className="hover:opacity-100 transition-opacity">Term of Service</Link>
                        <Link href="#" className="hover:opacity-100 transition-opacity">Site Map</Link>
                    </div>
                </div>
            </div>

            {/* Floating WA: Ukuran lebih kecil di mobile agar tidak menutupi teks */}
            <Link
                href="https://wa.me/6289652944096"
                target="_blank"
                className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 hover:scale-110 transition-transform active:scale-95"
            >
                <div className="relative w-[55px] h-[55px] md:w-[75px] md:h-[75px]">
                    <Image src="/images/svg/icons/wa.svg" alt="WA" fill className="drop-shadow-2xl object-contain" />
                </div>
            </Link>
        </footer>
    );
}