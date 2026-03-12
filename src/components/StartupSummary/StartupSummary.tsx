import Image from "next/image";
import Link from "next/link";

interface StartupSummaryProps {
  startup: {
    id: string;
    name: string;
    logoUrl: string;
    productCount: number;
    category: string;
    studyProgram: string;
    hasEcommerce: boolean;
    hasWhatsapp: boolean;
  };
}

export default function StartupSummary({ startup }: StartupSummaryProps) {
  // Helper untuk styling status tersedia/tidak
  const StatusLabel = ({ isAvailable }: { isAvailable: boolean }) => (
    <span className={`font-normal ${isAvailable ? "text-[#0062FF]" : "text-[#1E1E1E]"}`}>
      {isAvailable ? "Tersedia" : "Tidak Tersedia"}
    </span>
  );

  return (
    <div className="layout-container py-10">
      {/* Container Utama dengan Border Halus Atas Bawah */}
      <div className="w-full border-y border-gray-200 py-8 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-36">

        {/* BAGIAN 1: PROFIL & NAMA (Kiri) */}
        <div className="flex items-center gap-8 min-w-[300px]">
          <div className="relative w-[124px] h-[124px] rounded-full overflow-hidden border border-gray-100 shadow-sm">
            <Image
              src={startup.logoUrl}
              alt={startup.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-7">
            <h3 className="text-[30px] font-bold text-[#1E1E1E] leading-none">
              {startup.name}
            </h3>
            <Link
              href={`/profil-startup/${startup.id}`}
              className="px-3 py-2 border border-[#0062FF] bg-[#EBF4FF] text-[#0062FF] rounded-[12px] text-[20px] font-normal hover:bg-[#0062FF] hover:text-white transition-all text-center"
            >
              Lihat Profil Startup
            </Link>
          </div>
        </div>

        {/* BAGIAN 2: STATISTIK & INFO (Tengah & Kanan) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-6 w-full lg:w-auto">

          {/* Kelompok Info 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between md:justify-start md:gap-7 items-center">
              <span className="text-[#8F8F8F] text-[16px] w-32">Produk</span>
              <span className="text-[#1E1E1E] text-[16px] font-normal">{startup.productCount}</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-7 items-center">
              <span className="text-[#8F8F8F] text-[16px] w-32">Kategori</span>
              <span className="text-[#1E1E1E] text-[16px] font-normal">{startup.category}</span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-7 items-center">
              <span className="text-[#8F8F8F] text-[16px] w-32">Program Studi</span>
              <span className="text-[#1E1E1E] text-[16px] font-normal">{startup.studyProgram}</span>
            </div>
          </div>

          {/* Kelompok Info 2: Status Ketersediaan */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between md:justify-start md:gap-7 items-center">
              <span className="text-[#8F8F8F] text-[16px] w-32">E-Commerce</span>
              <span className="text-[16px]">
                <StatusLabel isAvailable={startup.hasEcommerce} />
              </span>
            </div>
            <div className="flex justify-between md:justify-start md:gap-7 items-center">
              <span className="text-[#8F8F8F] text-[16px] w-32">WhatsApp</span>
              <span className="text-[16px]">
                <StatusLabel isAvailable={startup.hasWhatsapp} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}