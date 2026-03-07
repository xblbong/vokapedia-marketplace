import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="w-full bg-white border-b border-gray-200 mt-44">
      <div className="layout-container py-[59px] flex flex-col lg:flex-row items-center justify-between gap-[40px] relative overflow-visible h-auto lg:h-[366px]">
        
        {/* Sisi Kiri: Gambar Sketsa Gedung */}
        <div className="w-full lg:w-1/2 flex justify-start items-center">
          <div className="relative w-full h-[510px] lg:h-[610px] lg:-mt-44"> 
            <Image
              src="/images/png/gedung.png"
              alt="Gedung Vokasi UB"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        {/* Sisi Kanan */}
        <div className="w-full lg:max-w-[666px] flex flex-col gap-[17px]">
          <h2 className="text-[30px] font-bold text-[#1E1E1E] [text-shadow:2px_2px_2px_#00000040]">
            Tentang Program
          </h2>
          
          <p className="text-[20px] text-[#545454] leading-[1.6]">
            <span className="font-bold text-[#1E1E1E]">Entrepreneurship Showcase</span> adalah program Fakultas Vokasi Universitas Brawijaya yang menampilkan startup mahasiswa terkurasi dari berbagai bidang sebagai bagian dari penguatan ekosistem kewirausahaan vokasi.
          </p>

          <div className="flex flex-col sm:flex-row gap-[10px] w-full mt-[10px]">
            {/* Button 1: Website Vokasi UB */}
            <Link 
              href="https://vokasi.ub.ac.id" 
              target="_blank"
              className="flex-1 text-lg h-[52px] bg-[#0062FF] hover:bg-[#0052D6] transition-colors rounded-[10px] flex items-center justify-center gap-[10px] text-white font-bold"
            >
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                 </svg>
              </div>
              Website Vokasi UB
            </Link>

            {/* Button 2: Badan Inovasi & Kewirausahaan */}
            <Link 
              href="#" 
              className="flex-1 h-[52px] bg-[#05A7B9] hover:bg-[#048D9C] transition-colors rounded-[10px] flex items-center justify-center gap-[10px] text-white font-bold"
            >
              <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                 </svg>
              </div>
              Badan Inovasi & Kewirausahaan
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}