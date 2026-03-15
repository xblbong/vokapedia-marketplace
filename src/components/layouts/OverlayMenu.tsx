"use client";

import { useState, useEffect } from "react";
import { OVERLAY_MENU, USER_NAV_LINKS } from "@/src/components/constants/navigation";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/src/hooks/useDebounce";

export default function OverlayMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
     setSearchTerm(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
      const currentParam = searchParams.get("q") || "";
      if (debouncedSearchTerm !== currentParam && isOpen) {
          const url = new URL("/produk", window.location.href);
          
          if (pathname === "/produk") {
              searchParams.forEach((val, key) => {
                  if (key !== "q" && key !== "page") url.searchParams.set(key, val);
              });
          }

          if (debouncedSearchTerm) {
              url.searchParams.set("q", debouncedSearchTerm);
          } else {
              url.searchParams.delete("q");
          }
          url.searchParams.delete("page");

          router.push(url.pathname + url.search);
          onClose(); // auto close on mobile after search
      }
  }, [debouncedSearchTerm, pathname, router, searchParams, isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white animate-in fade-in slide-in-from-top duration-300 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 relative">
        
        {/* Header Overlay: Close Button */}
        <div className="flex justify-end mb-6">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={32} className="text-[#1E1E1E]" />
          </button>
        </div>

        {/* 1. Mobile Search Bar (Hanya muncul di mobile/tablet < lg) */}
        <div className="lg:hidden mb-10">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Cari startup atau produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-[52px] pl-5 pr-12 rounded-xl border border-[#C3C3C3] bg-[#F8F9FA] focus:outline-none focus:border-[#0062FF]"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8F8F8F]" size={20} />
          </div>
        </div>

        {/* 2. Main Navigation (Hanya muncul di mobile/tablet < md) */}
        <div className="md:hidden mb-12 space-y-4">
          <h3 className="text-[14px] font-bold text-[#8F8F8F] capitalize tracking-widest mb-4">Menu Utama</h3>
          <div className="flex flex-col gap-4">
            {USER_NAV_LINKS.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                onClick={onClose}
                className="text-[24px] font-bold text-[#1E1E1E] flex items-center justify-between"
              >
                {link.name}
                <ArrowRight size={20} className="text-[#0062FF]" />
              </Link>
            ))}
          </div>
          <div className="h-[1px] bg-gray-200 w-full mt-8"></div>
        </div>

        {/* 3. Secondary Navigation (OVERLAY_MENU) */}
        <div className="space-y-12 md:space-y-16">
          {OVERLAY_MENU.map((section, idx) => (
            <div key={idx} className="pb-4">
              <h3 className="text-[18px] md:text-[20px] font-bold text-[#1E1E1E] mb-6 capitalize tracking-wider">
                {section.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                {section.items.map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.href} 
                    onClick={onClose}
                    className="text-[18px] md:text-[20px] font-normal text-[#545454] hover:text-[#0062FF] transition-colors border-b border-gray-50 pb-2 md:border-none"
                  >
                    {item.label}
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