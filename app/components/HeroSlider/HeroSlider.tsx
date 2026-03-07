"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SlideData {
  id: number;
  tagline: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

const DUMMY_DATA: SlideData[] = [
  {
    id: 1,
    tagline: "Berita Terkini",
    title: "Opening Brawijaya University Education Expo 2026",
    description: "Menandai pembukaan resmi rangkaian kegiatan kegiatan Brawijaya University Education Expo 2026 yang mempertemukan sivitas akademika, mitra, dan calon mahasiswa.",
    image: "/images/svg/background.svg",
    link: "/berita/1",
  },
  {
    id: 2,
    tagline: "Info Kampus",
    title: "Vokasi UB Raih Penghargaan Startup Inovatif 2025",
    description: "Prestasi gemilang kembali ditorehkan oleh mahasiswa vokasi dalam ajang nasional tahunan yang diadakan di Jakarta kemarin malam.",
    image: "/images/svg/background.svg",
    link: "/berita/2",
  },
  {
    id: 3,
    tagline: "Agenda",
    title: "Workshop Kewirausahaan Digital untuk Mahasiswa",
    description: "Ikuti rangkaian workshop intensif untuk mengasah skill bisnis digital kamu bersama mentor ahli dari berbagai startup ternama.",
    image: "/images/svg/background.svg",
    link: "/berita/3",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Autoplay logic: 3 detik sekali
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === DUMMY_DATA.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full flex flex-col items-center gap-[32px] mt-[12rem]">
      {/* Main Slider Container (Spec: 1240x488) */}
      <div className="relative w-full max-w-[1240px] h-[488px] overflow-hidden rounded-[20px] shadow-lg">
        {DUMMY_DATA.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />

            {/* Overlay Gradient (Biar teks kebaca jelas) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content Container (Spec: 1139x211) */}
            <div className="absolute bottom-[40px] left-[50px] right-[50px] flex justify-between items-end gap-[28px] text-white">
              
              {/* Text Area (Spec: 662px) */}
              <div className="max-w-[662px] flex flex-col gap-[14px]">
                {/* Tagline */}
                <div className="w-fit bg-[#007AFF] px-[16px] py-[6px] rounded-[8px]">
                  <span className="text-lg font-normal capitalize tracking-wider">
                    {slide.tagline}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-[30px] w-[425px] font-bold leading-[1.2] tracking-[-0.5px]">
                  {slide.title}
                </h1>

                {/* Description (Truncated/Line-clamp) */}
                <p className="text-lg font-normal opacity-90 line-clamp-2 leading-[1.6]">
                  {slide.description}
                </p>
              </div>

              {/* Action Button (Spec: 195x52) */}
              <Link 
                href={slide.link}
                className="group flex items-center gap-[10px] w-[210px] h-[52px] px-[10px] py-[10px] bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all backdrop-blur-sm"
              >
                <div className="w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <span className="text-[14px] font-bold capitalize tracking-widest text-white">
                  Selengkapnya
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots (Bulatan di bawah) */}
      <div className="flex gap-[12px]">
        {DUMMY_DATA.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-[12px] h-[12px] rounded-full transition-all duration-300 ${
              current === i ? "bg-[#4D4D4D] scale-125" : "bg-[#C4C4C4] hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}