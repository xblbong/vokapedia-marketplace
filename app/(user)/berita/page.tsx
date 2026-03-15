import { prisma } from "@/src/lib/prisma";
import BeritaList from "@/src/views/berita/BeritaList";

export const metadata = { title: "Berita Terbaru | Vokapedia" };

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const limit = 8;
  const skip = (currentPage - 1) * limit;

  const [rawBerita, totalCount] = await Promise.all([
    prisma.berita.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        kategori: true,
      }
    }),
    prisma.berita.count({ where: { status: "PUBLISHED" } })
  ]);

  const totalPages = Math.ceil(totalCount / limit) || 1;

  const berita = rawBerita.map(b => ({
    slug: b.slug,
    judul: b.judul,
    isi_berita: b.isi_berita,
    gambar: b.gambar,
    kategori: b.kategori.name,
    tanggal: b.createdAt.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
  }));

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <BeritaList berita={berita} currentPage={currentPage} totalPages={totalPages} />
    </main>
  );
}
