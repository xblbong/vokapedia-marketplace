"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { USER_NAV_LINKS } from "@/app/components/constants/navigation";
import OverlayMenu from "./OverlayMenu";

export default function NavbarComponent() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white">
      {/* Container Utama Navbar - Padding & Height disesuaikan */}
      <div className="layout-container nav-shadow px-4 md:px-10 xl:px-24 py-3 md:py-4 flex items-center justify-between min-h-[64px] md:min-h-[80px]">
        
        {/* KIRI: Logo & Search Bar */}
        <div className="flex items-center gap-4 lg:gap-8 xl:gap-10 flex-1">
          <Link href="/" className="shrink-0">
            <Image 
              src="/images/svg/logo-vokapedia.svg" 
              alt="Vokapedia" 
              width={220} 
              height={50} 
              className="object-contain w-[140px] md:w-[180px] lg:w-[220px] h-auto" 
            />
          </Link>

          {/* Search Bar - Ukuran font & padding disesuaikan */}
          <div className="hidden lg:flex relative w-full max-w-[300px] xl:max-w-[429px] h-[40px] xl:h-[48px]">
            <input
              type="text"
              placeholder="Cari.."
              className="w-full h-full pl-4 pr-10 rounded-full border border-[#C3C3C3] focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all
                         font-['DM_Sans'] font-normal text-[14px] xl:text-[18px] placeholder:text-[#8F8F8F]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg width="18" height="18" className="xl:w-6 xl:h-6" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
          </div>
        </div>

        {/* KANAN: Nav Links & Toggle */}
        <div className="flex items-center gap-4 md:gap-8 xl:gap-[40px]">
          {/* Nav Links - Jarak antar menu disesuaikan */}
          <div className="hidden xl:flex items-center gap-6 xl:gap-[40px]">
            {USER_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive ? "text-menu-active" : "text-menu-inactive hover:text-[#1E1E1E] transition-colors"}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Toggle Button - Ukuran disesuaikan untuk mobile */}
          <button 
            onClick={() => setIsOverlayOpen(true)}
            className="w-9 h-9 md:w-[42px] md:h-[42px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          >
            <svg width="28" height="18" className="md:w-[30px] md:h-[20px]" viewBox="0 0 30 20" fill="none">
                <rect width="30" height="3.5" rx="1.75" fill="#1E1E1E"/>
                <rect y="8.25" width="30" height="3.5" rx="1.75" fill="#1E1E1E"/>
                <rect y="16.5" width="30" height="3.5" rx="1.75" fill="#1E1E1E"/>
                <circle cx="26" cy="1.75" r="1.75" fill="#1E1E1E"/>
                <circle cx="26" cy="10" r="1.75" fill="#1E1E1E"/>
                <circle cx="26" cy="18.25" r="1.75" fill="#1E1E1E"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Banner Biru Tua Bawah - Font size lebih dinamis agar tidak overflow di HP */}
      <div className="bg-[#00132B] py-2 md:py-[14px] px-4 flex justify-center items-center">
        <p className="text-white font-['DM_Sans'] text-center leading-tight">
          <span className="font-bold text-[10px] sm:text-[12px] md:text-[16px]">VOKAPEDIA</span> 
          <span className="mx-1 md:mx-2 text-[10px] md:text-[16px]">|</span>
          <span className="font-normal text-[10px] sm:text-[12px] md:text-[16px] opacity-90">
            Marketplace Produk Startup Mahasiswa Fakultas Vokasi Universitas Brawijaya
          </span>
        </p>
      </div>

      {/* Overlay Menu */}
      <OverlayMenu isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </nav>
  );
}