"use client";
import { OVERLAY_MENU } from "@/app/components/constants/navigation";
import Link from "next/link";

export default function OverlayMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white animate-in slide-in-from-top duration-500 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-10 relative">
        
        {/* Close button X */}
        <button onClick={onClose} className="absolute right-10 top-10 cursor-pointer">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mt-24 space-y-16">
          {OVERLAY_MENU.map((section, idx) => (
            <div key={idx} className="border-b border-[#C3C3C3] pb-10">
              {/* Header section (e.g., Program) */}
              <h3 className="text-[24px] font-bold text-[#1E1E1E] mb-8">{section.title}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-6">
                {section.items.map((item, i) => (
                  <Link 
                    key={i} 
                    href={item.href} 
                    onClick={onClose}
                    className="text-[20px] md:text-[22px] font-normal text-[#1E1E1E] hover:text-[#8F8F8F] transition-colors flex justify-between items-center"
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