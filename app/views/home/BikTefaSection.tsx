import Image from "next/image";

export default function BikTefaSection() {
  return (
    <section className="w-full bg-white">
      <div className="layout-container py-[100px] flex flex-col lg:flex-row items-center gap-[60px] lg:gap-[80px]">
        
        {/* KIRI: Image Collage */}
        <div className="w-full lg:w-1/2">
          <div className="relative w-full h-[300px] md:h-[400px] rounded-[20px] overflow-hidden shadow-md">
            <Image
              src="/images/svg/frame.svg"
              alt="Kolase BIK TEFA Vokasi UB"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* KANAN: Text Content */}
        <div className="w-full lg:w-1/2 flex flex-col gap-[24px]">
          <h2 className="text-[30px] md:text-[30px] font-bold text-[#1E1E1E] tracking-tight">
            BIK – TEFA
          </h2>

          {/* Deskripsi dengan Bolding Khusus */}
          <p className="text-[30px] md:text-[20px] text-[#545454] leading-[1.7] font-normal">
            <span className="font-bold text-black">Program Entrepreneurship Showcase</span> didukung oleh Badan Inovasi dan Kewirausahaan (BIK) serta Teaching Factory (TEFA) Fakultas Vokasi Universitas Brawijaya sebagai bagian dari pengembangan ekosistem kewirausahaan mahasiswa berbasis praktik dan industri.
          </p>
        </div>

      </div>
    </section>
  );
}