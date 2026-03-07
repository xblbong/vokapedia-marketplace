"use client";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // Logika sederhana untuk menampilkan angka halaman
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-3 md:gap-6 mt-10">
      
      {/* Tombol Back - Circle */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-sm
          ${currentPage === 1 
            ? "bg-[#EDEDED] cursor-not-allowed" 
            : "bg-[#FFFFFF] hover:bg-gray-50 active:scale-90"}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
          stroke={currentPage === 1 ? "#C2C2C2" : "#0062FF"} 
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>

      {/* Container Angka - Capsule (Pill) */}
      <div className="bg-[#FFFFFF] h-10 md:h-12 px-1.5 md:px-2 rounded-full flex items-center gap-1 shadow-sm border border-[#EDEDED]/50">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`text-[14px] md:text-[16px] font-bold w-7 h-7 md:w-9 md:h-9 rounded-full transition-all flex items-center justify-center
              ${currentPage === page 
                ? "bg-[#0062FF] text-[#FFFFFF] shadow-md scale-110" 
                : "text-[#C2C2C2] hover:text-[#0062FF]"}`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Tombol Next - Circle */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all shadow-sm
          ${currentPage === totalPages 
            ? "bg-[#EDEDED] cursor-not-allowed" 
            : "bg-[#FFFFFF] hover:bg-gray-50 active:scale-90 border border-[#EDEDED]/50"}`}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
          stroke={currentPage === totalPages ? "#C2C2C2" : "#0062FF"} 
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>

    </div>
  );
}