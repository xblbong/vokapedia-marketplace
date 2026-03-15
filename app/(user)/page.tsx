import AboutSection from "@/src/views/home/AboutSection";
import BikTefaSection from "@/src/views/home/BikTefaSection";
import HeroSection from "@/src/views/home/HeroSection";
import ProductSection from "@/src/views/home/ProductSection";
import ProgramStudi from "@/src/views/home/ProgramStudi";
import { prisma } from "@/src/lib/prisma";

export default async function HomePage() {
  const rawProducts = await prisma.product.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      startup: {
        include: {
          programStudi: true,
        },
      },
    },
  });

  const products = rawProducts.map((p) => ({
    id: p.id.toString(),
    title: p.title,
    category: p.startup?.programStudi?.name || "Lainnya",
    kategori: p.category?.name || "Lainnya",
    description: p.description,
    price: Number(p.price) || 0,
    image: p.image ? p.image.split(",")[0] : "/images/svg/product1.svg",
  }));

  const rawProgramStudis = await prisma.programStudi.findMany();
  const programStudis = rawProgramStudis.map((p) => ({
    title: p.name,
    desc: p.description,
    icon: p.icon || "/images/svg/icons/ti.svg",
  }));

  const rawKategoris = await prisma.category.findMany();
  const kategoriList = rawKategoris.map((c) => c.name);
  const prodiList = rawProgramStudis.map((p) => p.name);

  return (
    <div className="space-y-20">
      <HeroSection />
      <ProductSection products={products} prodiList={prodiList} kategoriList={kategoriList} />
      <AboutSection />
      <ProgramStudi programStudis={programStudis} />
      <BikTefaSection />
    </div>
  );
}