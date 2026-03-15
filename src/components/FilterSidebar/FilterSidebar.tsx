"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export interface FilterItem {
  name: string;
  count: number;
}

interface FilterSidebarProps {
  prodiList: FilterItem[];
  kategoriList: FilterItem[];
  activeProdi: string;
  activeKategori: string;
  onProdiChange: (val: string) => void;
  onKategoriChange: (val: string) => void;
}

export default function FilterSidebar({
  prodiList,
  kategoriList,
  activeProdi,
  activeKategori,
  onProdiChange,
  onKategoriChange
}: FilterSidebarProps) {
  // State untuk Dropdown (Buka/Tutup)
  const [isOpenProdi, setIsOpenProdi] = useState(true);
  const [isOpenKategori, setIsOpenKategori] = useState(true);

  return (
    <aside className="w-full lg:w-[320px] flex flex-col gap-6 antialiased">

      {/* Group 1: Program Studi */}
      <div className="flex flex-col transition-all duration-300">
        {/* Header Accordion - Clickable */}
        <button 
          onClick={() => setIsOpenProdi(!isOpenProdi)}
          className="flex items-center justify-between px-5 py-4 bg-[#F1F1F1] rounded-xl hover:bg-[#EAEAEA] transition-colors"
        >
          <div className="flex items-center gap-3 text-[#1E1E1E] font-bold">
            <Image
              src="/images/svg/icons/school.svg" // Pastikan path benar
              alt="logo-school"
              width={26}
              height={26}
              className="object-contain"
            />            
            <span className="text-[16px]">Program Studi</span>
          </div>
          <ChevronDown 
            size={20} 
            className={`text-[#495057] transition-transform duration-300 ${isOpenProdi ? "rotate-180" : ""}`} 
          />
        </button>

        {/* List Items - Collapsible with Animation */}
        <div className={`overflow-hidden transition-all duration-300 ${isOpenProdi ? "max-h-[500px] mt-2" : "max-h-0"}`}>
          <div className="flex flex-col bg-white">
            {prodiList.map((item, i) => (
              <button
                key={i}
                onClick={() => onProdiChange(item.name)}
                className={`group flex items-center justify-between px-6 py-[14px] text-left transition-all border-b border-gray-100 last:border-none ${
                  activeProdi === item.name
                    ? "border-r-[4px] border-r-[#0062FF] bg-white"
                    : "border-r-[4px] border-r-transparent hover:bg-gray-50"
                  }`}
              >
                <span className={`text-[15px] transition-colors ${activeProdi === item.name ? "text-[#1E1E1E] font-bold" : "text-[#8F8F8F] font-medium"}`}>
                  {item.name} ({item.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Group 2: Kategori */}
      <div className="flex flex-col transition-all duration-300">
        {/* Header Accordion - Clickable */}
        <button 
          onClick={() => setIsOpenKategori(!isOpenKategori)}
          className="flex items-center justify-between px-5 py-4 bg-[#F1F1F1] rounded-xl hover:bg-[#EAEAEA] transition-colors"
        >
          <div className="flex items-center gap-3 text-[#1E1E1E] font-bold">
             <Image
              src="/images/svg/icons/school.svg"
              alt="logo-kategori"
              width={26}
              height={26}
              className="object-contain"
            />   
            <span className="text-[16px]">Kategori</span>
          </div>
          <ChevronDown 
            size={20} 
            className={`text-[#495057] transition-transform duration-300 ${isOpenKategori ? "rotate-180" : ""}`} 
          />
        </button>

        {/* List Items - Collapsible */}
        <div className={`overflow-hidden transition-all duration-300 ${isOpenKategori ? "max-h-[500px] mt-2" : "max-h-0"}`}>
          <div className="flex flex-col bg-white">
            {kategoriList.map((item, i) => (
              <button
                key={i}
                onClick={() => onKategoriChange(item.name)}
                className={`group flex items-center justify-between px-6 py-[14px] text-left transition-all border-b border-gray-100 last:border-none ${
                  activeKategori === item.name
                    ? "border-r-[4px] border-r-[#0062FF] bg-white"
                    : "border-r-[4px] border-r-transparent hover:bg-gray-50"
                  }`}
              >
                <span className={`text-[15px] transition-colors ${activeKategori === item.name ? "text-[#1E1E1E] font-bold" : "text-[#8F8F8F] font-medium"}`}>
                  {item.name} ({item.count})
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </aside>
  );
}