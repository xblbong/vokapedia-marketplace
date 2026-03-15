"use client";
import Image from "next/image";

interface ProgramStudiProps {
  programStudis: {
    title: string;
    desc: string;
    icon: string;
  }[];
}

export default function ProgramStudi({ programStudis }: ProgramStudiProps) {
  return (
    <section className="layout-container py-12 md:py-20 flex flex-col items-center gap-10 md:gap-[60px]">
      
      {/* Header Section: Font size dibuat dinamis */}
      <div className="text-center flex flex-col gap-1 md:gap-2 px-4">
        <h2 className="text-[24px] sm:text-[28px] md:text-[38px] font-semibold text-[#000000] leading-tight">
          Program Studi Fakultas Vokasi
        </h2>
        <p className="text-[16px] md:text-[20px] lg:text-[24px] text-[#7F7F7F] font-normal">
          Universitas Brawijaya
        </p>
      </div>

      {/* Cards Container: Menggunakan Grid untuk kontrol jumlah kolom yang presisi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-[24px] w-full">
        {programStudis.map((prodi, index) => (
          <div 
            key={index}
            className="w-full h-auto min-h-[200px] bg-white border border-[#C3C3C3] rounded-[20px] p-6 flex flex-col items-center text-center gap-4 md:gap-[20px] hover:border-black hover:shadow-xl transition-all duration-300 group cursor-default"
          >
            {/* Icon Box: Ukuran sedikit mengecil di mobile */}
            <div className="w-16 h-16 md:w-[80px] md:h-[80px] relative flex items-center justify-center transition-transform group-hover:scale-110">
              <Image 
                src={prodi.icon} 
                alt={prodi.title} 
                width={70} 
                height={70} 
                className="object-contain w-full h-full"
              />
            </div>

            {/* Title: Ukuran 16px sudah pas, hanya line-height yang dijaga */}
            <h3 className="text-[16px] font-bold text-[#1E1E1E] leading-tight px-1">
              {prodi.title}
            </h3>

            {/* Description: Ukuran 10px terlalu kecil untuk UX, dinaikkan ke 12px di desktop */}
            <p className="text-[11px] md:text-[12px] text-[#8F8F8F] leading-[1.6] font-normal">
              {prodi.desc}
            </p>
          </div>
        ))}
      </div>

    </section>
  );
}