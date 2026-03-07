"use client";
import Image from "next/image";

export default function ProductHero() {
  return (
    <section className="mt-16 md:mt-20 lg:mt-20 py-6 md:py-10">
      <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] lg:h-[480px] overflow-hidden group">
        
        {/* Background Image */}
        <Image 
          src="/images/svg/bg-produk.svg" 
          alt="Banner Produk" 
          fill 
          className="object-cover"
          priority 
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute inset-0">
          <div className="layout-container h-full flex flex-col justify-end pb-8 md:pb-6 lg:pb-10 text-white px-6 md:px-0">
            <h1 className="text-[26px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-bold mb-2 leading-tight max-w-[90%] md:max-w-[700px]">
              Temukan Produk Kreatif Mahasiswa
            </h1>
            
            <p className="text-[14px] md:text-[18px] lg:text-[20px] opacity-90 font-normal">
              Koleksi terkurasi dari startup Vokasi UB
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}