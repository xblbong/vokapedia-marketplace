"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface SlideData {
  id: string; // Changed to string
  tagline: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

interface HeroSliderProps {
  slides: SlideData[];
}

export default function HeroSlider({ slides }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);

  // Fallback to empty if no slides
  const displaySlides = slides && slides.length > 0 ? slides : [];

  useEffect(() => {
    if (displaySlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === displaySlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [displaySlides.length]);

  if (displaySlides.length === 0) return null;

  return (
    <section className="w-full flex flex-col items-center gap-6 md:gap-[32px] mt-40 md:mt-40 lg:mt-[12rem] px-4 md:px-10 lg:px-0">
      
      <div className="relative w-full max-w-[1240px] h-[350px] sm:h-[400px] md:h-[488px] overflow-hidden rounded-[16px] md:rounded-[20px] shadow-lg">
        {displaySlides.map((slide, index) => (
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

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 md:bottom-[40px] md:left-[50px] md:right-[50px] flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-[28px] text-white">
              
              {/* Text Area */}
              <div className="w-full md:max-w-[662px] flex flex-col gap-3 md:gap-[14px]">
                {/* Tagline: Ukuran font disesuaikan */}
                <div className="w-fit bg-[#007AFF] px-3 py-1 md:px-[16px] md:py-[6px] rounded-[6px] md:rounded-[8px]">
                  <span className="text-[12px] md:text-lg font-normal capitalize tracking-wider">
                    {slide.tagline}
                  </span>
                </div>

                <h1 className="text-[20px] sm:text-[24px] md:text-[30px] md:w-[425px] font-bold leading-tight md:leading-[1.2] tracking-[-0.5px]">
                  {slide.title}
                </h1>

                <p className="text-[14px] md:text-lg font-normal opacity-90 line-clamp-2 leading-relaxed md:leading-[1.6]">
                  {slide.description}
                </p>
              </div>

              <Link 
                href={slide.link}
                className="group flex items-center gap-3 w-fit md:w-[210px] h-[44px] md:h-[52px] px-4 md:px-[10px] bg-white/10 hover:bg-white/20 border border-white/30 rounded-full transition-all backdrop-blur-sm shrink-0"
              >
                <div className="w-7 h-7 md:w-[32px] md:h-[32px] bg-white rounded-full flex items-center justify-center transition-transform group-hover:rotate-45">
                  <svg width="14" height="14" className="md:w-[18px] md:h-[18px]" viewBox="0 0 24 24" fill="none" stroke="#1E1E1E" strokeWidth="2.5">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </div>
                <span className="text-[12px] md:text-[14px] font-bold capitalize tracking-widest text-white">
                  Selengkapnya
                </span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 md:gap-[12px] z-20">
        {displaySlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-[8px] h-[8px] md:w-[12px] md:h-[12px] rounded-full transition-all duration-300 ${
              current === i ? "bg-[#4D4D4D] scale-125" : "bg-[#C4C4C4] hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}