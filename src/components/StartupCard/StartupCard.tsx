"use client";

import React from "react";
import Link from "next/link";
import { Startup } from "@/src/types/startup";
import Image from "next/image";

interface StartupCardProps {
  startup: Startup;
}

export const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  return (
    <div 
      className="w-full max-w-[397px] h-full min-h-[246px] bg-white p-[20px] flex flex-col justify-between"
      style={{
        borderRadius: "21.47px",
        boxShadow: "0px 5.37px 26.84px 0px rgba(58, 58, 58, 0.10)",
      }}
    >
      {/* Header: Team Avatars & Department */}
      <div className="flex justify-between items-start mb-[16px]">
        {/* Dynamic Team Photos Stack */}
        <div className="flex -space-x-2 overflow-hidden">
          {startup.teamPhotos.map((photo, index) => (
            <div 
              key={index}
              className="relative w-[45px] h-[45px] rounded-full border-2 border-white overflow-hidden bg-gray-200"
            >
              <Image
                src={photo}
                alt={`Team ${index}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
          {/* Logika jika tim lebih dari 5 orang bisa ditambahkan counter +n di sini */}
        </div>

        {/* Department Tag */}
        <span className="text-[#7F7F7F] text-[14px] font-normal leading-tight mt-2">
          {startup.department}
        </span>
      </div>

      {/* Body: Name & Description */}
      <div className="flex-1">
        <h2 className="text-[#1E1E1E] text-[28px] font-bold mb-[8px] leading-tight">
          {startup.name}
        </h2>
        <p className="text-[#7F7F7F] text-[14px] leading-[1.4] line-clamp-2">
          {startup.description}
        </p>
      </div>

      {/* Footer: Button */}
      <div className="mt-[20px]">
        <Link href={`/profil-startup/${startup.id}`} className="w-full block">
          <button 
            className="w-full h-[45px] bg-[#1E1E1E] text-white text-[14px] font-medium transition-opacity hover:opacity-90 active:scale-[0.98] duration-200"
            style={{ borderRadius: "10.42px" }}
          >
            Lihat Profil Startup
          </button>
        </Link>
      </div>
    </div>
  );
};