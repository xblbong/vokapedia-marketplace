"use client";
import Image from "next/image";

export default function BikTefaSection() {
  return (
    <section className="w-full bg-white">
      {/* Container: Padding vertikal dikurangi di mobile agar tidak terlalu kosong */}
      <div className="layout-container py-12 md:py-20 lg:py-[100px] flex flex-col lg:flex-row items-center gap-10 md:gap-14 lg:gap-[80px]">
        
        {/* KIRI: Image Collage - Tinggi gambar adaptif */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-[250px] sm:h-[350px] md:h-[400px] rounded-[16px] md:rounded-[20px] overflow-hidden shadow-md">
            <Image
              src="/images/svg/frame.svg"
              alt="Kolase BIK TEFA Vokasi UB"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* KANAN: Text Content - Gap antar teks disesuaikan */}
        <div className="w-full lg:w-1/2 flex flex-col gap-4 md:gap-6">
          {/* Title: 24px di HP, 30px di Desktop */}
          <h2 className="text-[24px] md:text-[30px] font-bold text-[#1E1E1E] tracking-tight text-left">
            BIK – TEFA
          </h2>

          {/* Deskripsi: Ukuran font disesuaikan agar proporsional di layar kecil */}
          <p className="text-[16px] sm:text-[18px] lg:text-[20px] text-[#545454] leading-[1.6] md:leading-[1.7] font-normal text-left">
            <span className="font-bold text-black">Program Entrepreneurship Showcase</span> didukung oleh Badan Inovasi dan Kewirausahaan (BIK) serta Teaching Factory (TEFA) Fakultas Vokasi Universitas Brawijaya sebagai bagian dari pengembangan ekosistem kewirausahaan mahasiswa berbasis praktik dan industri.
          </p>
        </div>

      </div>
    </section>
  );
}