"use client";

import { useRouter } from "next/navigation";
import { SearchX, ArrowLeft, Home, Info } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  suggestion?: string;
}

export default function ErrorState({
  title = "Halaman Tidak Ditemukan",
  message = "Maaf, profil startup atau halaman yang Anda cari tidak tersedia. Hal ini mungkin karena link yang salah atau startup tersebut sudah tidak aktif.",
  suggestion = "Periksa kembali URL Anda atau gunakan fitur pencarian untuk menemukan startup lainnya.",
}: ErrorStateProps) {
  const router = useRouter();

  return (
    <div className="layout-container min-h-[80vh] flex items-center justify-center bg-white px-6 mt-20">
      <div className="max-w-4xl w-full flex flex-col items-center">
        
        {/* Kontainer Icon yang Profesional */}
        <div className="relative mb-8">
          <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <SearchX size={56} strokeWidth={1.2} className="text-red-600" />
          </div>
          {/* Aksen dekoratif minimalis */}
          <div className="absolute -z-10 inset-0 bg-blue-50 blur-2xl opacity-60 rounded-full scale-150" />
        </div>

        {/* Judul Besar & Pesan */}
        <div className="text-center space-y-4 mb-10">
          <h1 className="text-4xl md:text-6xl font-bold text-[#1E1E1E] tracking-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            {message}
          </p>
        </div>

        {/* Saran Box - Tanpa Emoji, Menggunakan Icon Info */}
        <div className="w-full max-w-xl bg-[#F8FAFC] p-5 rounded-2xl flex items-start gap-4 mb-12">
          <Info className="text-[#0062FF] shrink-0 mt-0.5" size={20} />
          <div className="space-y-1">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest block">
              Saran Perbaikan
            </span>
            <p className="text-sm md:text-base text-gray-600 font-medium">
              {suggestion}
            </p>
          </div>
        </div>

        {/* Action Buttons - Menyesuaikan Style Tombol Vokapedia */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            onClick={() => router.push("/")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#1E1E1E] text-white rounded-xl font-bold text-[16px] hover:bg-[#0062FF] transition-all duration-300 shadow-md active:scale-95"
          >
            <Home size={18} />
            Kembali ke Beranda
          </button>

          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-white text-[#1E1E1E] rounded-xl font-bold text-[16px] hover:bg-gray-50 hover:border-black transition-all duration-300 active:scale-95"
          >
            <ArrowLeft size={18} />
            Halaman Sebelumnya
          </button>
        </div>

        {/* Footer Kecil Branding */}
        <div className="mt-20 pt-8 border-t border-gray-100 w-full flex flex-col items-center">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">
            Vokapedia Marketplace &bull; Universitas Brawijaya
          </p>
        </div>
      </div>
    </div>
  );
}