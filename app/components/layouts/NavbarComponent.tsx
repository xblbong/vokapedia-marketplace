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
      {/* Container Utama Navbar */}
      <div className="layout-container nav-shadow px-4 md:px-24 py-4 flex items-center justify-between min-h-[80px]">
        
        {/* KIRI: Logo & Search Bar */}
        <div className="flex items-center gap-10 flex-1">
          <Link href="/">
            <Image 
              src="/images/svg/logo-vokapedia.svg" 
              alt="Vokapedia" 
              width={220} 
              height={50} 
              className="object-contain shrink-0"
            />
          </Link>

          {/* Search Bar (Spesifikasi: 429x48, border #C3C3C3) */}
          <div className="hidden lg:flex relative w-full max-w-[429px] h-[48px]">
            <input
              type="text"
              placeholder="Cari.."
              className="w-full h-full pl-[20px] pr-[50px] rounded-[50px] border border-[#C3C3C3] focus:outline-none focus:ring-1 focus:ring-gray-400 transition-all
                         font-['DM_Sans'] font-normal text-[20px] leading-[28px] placeholder:text-[#8F8F8F]"
            />
            <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </div>
          </div>
        </div>

        {/* KANAN: Nav Links & Toggle */}
        <div className="flex items-center gap-[40px]">
          {/* Dinamis Nav Links */}
          <div className="hidden xl:flex items-center gap-[40px]">
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

          {/* Toggle Button (Spesifikasi: 42x42) */}
          <button 
            onClick={() => setIsOverlayOpen(true)}
            className="w-[42px] h-[42px] flex items-center justify-center cursor-pointer hover:bg-gray-50 rounded-md transition-colors"
          >
            <svg width="32" height="22" viewBox="0 0 30 20" fill="none">
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

      {/* Banner Biru Tua Bawah */}
      <div className="bg-[#00132B] py-[14px] px-4 flex justify-center items-center">
        <p className="text-white font-['DM_Sans'] text-center">
          <span className="font-bold text-[14px] md:text-[16px]">VOKAPEDIA</span> 
          <span className="mx-2">|</span>
          <span className="font-normal text-[14px] md:text-[16px] opacity-90">
            Marketplace Produk Startup Mahasiswa Fakultas Vokasi Universitas Brawijaya
          </span>
        </p>
      </div>

      {/* Overlay Menu Fullscreen */}
      <OverlayMenu isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </nav>
  );
}