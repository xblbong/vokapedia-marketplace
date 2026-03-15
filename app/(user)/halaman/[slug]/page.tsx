import { prisma } from "@/src/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";

export default async function HalamanStatisPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const halaman = await prisma.halaman.findUnique({
        where: { slug },
    });

    if (!halaman) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            {/* Breadcrumb Header */}
            <div className="layout-container py-10 mt-16 md:mt-20">
                {/* <Link href="/" className="inline-flex items-center gap-2 text-[#0062FF] font-medium hover:underline mb-4">
                    <ArrowLeft size={16} /> Kembali ke Beranda
                </Link> */}
                <div className="flex items-center gap-2 text-[13px] md:text-[14px] text-[#8F8F8F] flex-wrap">
                    <Link href="/" className="hover:text-[#1E1E1E]">Beranda</Link>
                    <ChevronRight size={14} />
                    <span className="text-[#1E1E1E] font-medium">{halaman.title}</span>
                </div>
            </div>

            {/* Content Body */}
            <article className="layout-container pb-10 md:pb-16">
                <h1 className="text-[28px] md:text-[36px] lg:text-[42px] font-bold text-[#1E1E1E] leading-tight mb-4 border-b border-gray-300 pb-2">
                    {halaman.title}
                </h1>
                <div
                    className="prose prose-lg max-w-none text-[#4B5563] leading-[1.8] md:leading-[2] text-[16px] md:text-[18px] whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: halaman.content }}
                />
            </article>
        </main>
    );
}
