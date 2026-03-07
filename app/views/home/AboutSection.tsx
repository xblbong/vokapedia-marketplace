"use client";
import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="w-full bg-white border-b border-gray-200 mt-20 md:mt-32 lg:mt-44">
      <div className="layout-container py-10 md:py-14 lg:py-[59px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-[40px] relative overflow-visible min-h-auto lg:min-h-[366px]">
        
        {/* Sisi Kiri: Gambar */}
        <div className="w-full lg:w-1/2 flex justify-start items-center">
          <div className="relative w-full h-[300px] sm:h-[450px] lg:h-[610px] lg:-mt-44 transition-all"> 
            <Image
              src="/images/png/gedung.png"
              alt="Gedung Vokasi UB"
              fill
              className="object-contain object-center lg:object-left"
              priority
            />
          </div>
        </div>

        {/* Sisi Kanan: Text Content */}
        <div className="w-full lg:max-w-[666px] flex flex-col gap-4 md:gap-[17px]">
          <h2 className="text-[24px] md:text-[30px] font-bold text-[#1E1E1E] [text-shadow:2px_2px_2px_#00000040]">
            Tentang Program
          </h2>
          
          <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#545454] leading-relaxed md:leading-[1.6]">
            <span className="font-bold text-[#1E1E1E]">Entrepreneurship Showcase</span> adalah program Fakultas Vokasi Universitas Brawijaya yang menampilkan startup mahasiswa terkurasi dari berbagai bidang sebagai bagian dari penguatan ekosistem kewirausahaan vokasi.
          </p>

          {/* Wrapper Button: Stack di mobile, Row di Desktop */}
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-[10px] w-full mt-4 md:mt-[10px]">
            
            {/* Button 1 */}
            <Link 
              href="https://vokasi.ub.ac.id" 
              target="_blank"
              className="
                w-full lg:w-full 
                h-[52px] 
                p-[10px] gap-[10px] rounded-[12px]
                bg-[#0062FF] hover:bg-[#0052D6] 
                transition-all active:scale-[0.98]
                flex items-center justify-center text-white font-bold
              "
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                 <svg className="text-[#0062FF]"  width="50" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                 </svg>
              </div>
              <span className="text-[15px] lg:text-[16px] whitespace-nowrap">Website Vokasi UB</span>
            </Link>

            {/* Button 2 */}
            <Link 
              href="#" 
              className="
                w-full lg:w-full 
                h-[52px] 
                p-[10px] gap-[10px] rounded-[12px]
                bg-[#05A7B9] hover:bg-[#048D9C] 
                transition-all active:scale-[0.98]
                flex items-center justify-center text-white font-bold
              "
            >
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center shrink-0">
                 <svg className="text-[#05A7B9]" width="50" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                 </svg>
              </div>
              <span className="text-[15px] lg:text-[16px] whitespace-nowrap">BIK Vokasi UB</span>
            </Link>

          </div>
        </div>
      </div>
    </section>
  );
}