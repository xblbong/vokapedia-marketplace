import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Calendar, Tag, ArrowLeft } from "lucide-react";

export default async function BeritaDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const berita = await prisma.berita.findUnique({
        where: { slug },
        include: { kategori: true },
    });

    if (!berita || berita.status !== "PUBLISHED") {
        notFound();
    }

    const primaryImage = berita.gambar ? berita.gambar.split(",")[0] : "/images/svg/background.svg";
    const tags = berita.tags ? berita.tags.split(",").map(t => t.trim()).filter(Boolean) : [];

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* Breadcrumb Header */}
            <div className="bg-white border-b border-gray-200 mt-20 md:mt-24 lg:mt-32 pt-6 pb-4">
                <div className="layout-container">
                    <Link href="/" className="inline-flex items-center gap-2 text-[#0062FF] font-medium hover:underline mb-4">
                        <ArrowLeft size={16} /> Kembali ke Beranda
                    </Link>
                    <div className="flex items-center gap-2 text-[13px] md:text-[14px] text-[#8F8F8F] flex-wrap">
                        <Link href="/" className="hover:text-[#1E1E1E]">Beranda</Link>
                        <ChevronRight size={14} />
                        <span className="hover:text-[#1E1E1E]">Berita</span>
                        <ChevronRight size={14} />
                        <span className="text-[#1E1E1E] font-medium max-w-[200px] md:max-w-[400px] truncate">
                            {berita.judul}
                        </span>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <article className="layout-container py-10 md:py-16">
                <div className="max-w-[800px] mx-auto bg-white rounded-2xl md:rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* Header Article */}
                    <div className="p-6 md:p-10 border-b border-gray-100">
                        <div className="flex items-center gap-3 mb-6 flex-wrap">
                            <span className="bg-[#0062FF] text-white px-3 py-1 rounded-md text-[13px] font-bold tracking-wide capitalize">
                                {berita.kategori.name}
                            </span>
                            <div className="flex items-center gap-2 text-gray-500 text-[14px]">
                                <Calendar size={16} />
                                <span>{berita.createdAt.toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>

                        <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-[#1E1E1E] leading-tight mb-6">
                            {berita.judul}
                        </h1>

                        {tags.length > 0 && (
                            <div className="flex items-center gap-3 flex-wrap">
                                <Tag size={16} className="text-gray-400" />
                                {tags.map(tag => (
                                    <span key={tag} className="text-[13px] text-gray-600 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
                                        {tag.startsWith('#') ? tag : `#${tag}`}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image Banner */}
                    <div className="relative w-full aspect-[16/9] bg-gray-100">
                        <Image
                            src={primaryImage}
                            alt={berita.judul}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 800px) 100vw, 800px"
                        />
                    </div>

                    {/* Article Content */}
                    <div className="p-6 md:p-10">
                        <div 
                            className="prose prose-lg max-w-none text-[#4B5563] leading-[1.8] md:leading-[2] text-[16px] md:text-[18px] whitespace-pre-line"
                            dangerouslySetInnerHTML={{ __html: berita.isi_berita }}
                        />
                    </div>
                </div>
            </article>
        </main>
    );
}
