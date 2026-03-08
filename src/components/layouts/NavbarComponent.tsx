"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { USER_NAV_LINKS } from "@/src/components/constants/navigation";
import OverlayMenu from "./OverlayMenu";

export default function NavbarComponent() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const pathname = usePathname();

  // Konfigurasi Halaman Banner
  const showBanner = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-white">
      {/* Main Navbar Section */}
      <div className="layout-container nav-shadow px-4 md:px-10 lg:px-24 py-3 md:py-5 flex items-center justify-between min-h-[64px] md:min-h-[80px]">

        {/* Left: Logo & Search Bar */}
        <div className="flex items-center gap-6 lg:gap-10 flex-1">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/svg/logo-vokapedia.svg"
              alt="Vokapedia Logo"
              width={220}
              height={50}
              className="w-[140px] md:w-[180px] lg:w-[220px] h-auto object-contain"
              priority
            />
          </Link>

          <div className="hidden lg:flex relative w-full max-w-[320px] xl:max-w-[430px]">
            <input
              type="text"
              placeholder="Cari startup atau produk..."
              className="w-full h-[44px] xl:h-[48px] pl-5 pr-12 rounded-full border border-[#C3C3C3] focus:outline-none focus:border-[#0062FF] transition-all text-[14px] xl:text-[16px]"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Right: Navigation Links & Menu Toggle */}
        <div className="flex items-center gap-4 md:gap-8 lg:gap-12">
          <div className="hidden md:flex items-center gap-4 lg:gap-8 xl:gap-10">
            {USER_NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] lg:text-[16px] font-medium transition-colors ${isActive ? "text-[#1E1E1E] font-bold" : "text-[#545454] hover:text-[#1E1E1E]"
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => setIsOverlayOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors group"
            aria-label="Toggle Menu"
          >
            <svg width="30" height="20" viewBox="0 0 30 20" fill="none" className="md:w-[32px] md:h-[22px]">
              <rect width="30" height="3.5" rx="1.75" fill="#1E1E1E" />
              <rect y="8.25" width="30" height="3.5" rx="1.75" fill="#1E1E1E" />
              <rect y="16.5" width="30" height="3.5" rx="1.75" fill="#1E1E1E" />
              <circle cx="26" cy="1.75" r="1.75" fill="#1E1E1E" />
              <circle cx="26" cy="10" r="1.75" fill="#1E1E1E" />
              <circle cx="26" cy="18.25" r="1.75" fill="#1E1E1E" />
            </svg>
          </button>
        </div>
      </div>

      {/* Conditional Banner Section */}
      {showBanner && (
        <div className="bg-[#00132B] py-2.5 md:py-3.5 px-4 flex justify-center items-center">
          <p className="text-white text-center leading-tight tracking-wide">
            <span className="font-bold text-[10px] sm:text-[13px] md:text-[16px]">VOKAPEDIA</span>
            <span className="mx-2 text-[10px] md:text-[16px] opacity-50">|</span>
            <span className="font-normal text-[10px] sm:text-[13px] md:text-[16px] opacity-90">
              Marketplace Produk Startup Mahasiswa Fakultas Vokasi Universitas Brawijaya
            </span>
          </p>
        </div>
      )}

      {/* Overlay Navigation Menu */}
      <OverlayMenu isOpen={isOverlayOpen} onClose={() => setIsOverlayOpen(false)} />
    </nav>
  );
}