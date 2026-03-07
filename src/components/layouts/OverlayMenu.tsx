"use client";
import { OVERLAY_MENU } from "@/src/components/constants/navigation";
import Link from "next/link";

export default function OverlayMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/98 animate-in slide-in-from-top duration-500 overflow-y-auto">
      {/* Container: Padding disesuaikan untuk Mobile, Tablet, dan Desktop */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 xl:px-20 py-8 md:py-10 relative">
        
        {/* Close button: Ukuran lebih kecil di mobile (32px) dan standar di desktop (42px) */}
        <button 
          onClick={onClose} 
          className="absolute right-6 top-6 md:right-10 md:top-10 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg 
            width="32" 
            height="32" 
            className="md:w-[42px] md:h-[42px]" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#1E1E1E" 
            strokeWidth="2.5"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Content Wrapper: Margin top dikurangi di mobile agar menu langsung terlihat */}
        <div className="mt-16 md:mt-24 space-y-10 md:space-y-16">
          {OVERLAY_MENU.map((section, idx) => (
            <div key={idx} className="border-b border-[#C3C3C3] pb-8 md:pb-10">
              
              {/* Header section (e.g., Program) - Ukuran font adaptif */}
              <h3 className="text-[20px] md:text-[24px] font-bold text-[#1E1E1E] mb-6 md:mb-8 uppercase tracking-wide">
                {section.title}
              </h3>
              
              {/* Grid: Gap horizontal dikurangi di layar sedang agar teks tidak bertabrakan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-20 gap-y-4 md:gap-y-6">
                {section.items.map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.href} 
                    onClick={onClose}
                    className="text-[18px] md:text-[20px] xl:text-[22px] font-normal text-[#1E1E1E] hover:text-[#8F8F8F] transition-colors flex justify-between items-center py-1"
                  >
                    {item.label}
                    {/* Opsional: Panah kecil hanya muncul di desktop untuk mempermanis UI */}
                    <span className="hidden md:inline-block opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}