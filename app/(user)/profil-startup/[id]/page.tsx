import { notFound } from "next/navigation";
import DetailProfilStartup from '@/src/views/profil-startup/DetailProfil';
import { prisma } from "@/src/lib/prisma";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const startupId = Number(resolvedParams.id);
  
  if (isNaN(startupId)) return notFound();

  const startup = await prisma.startup.findUnique({
    where: { id: startupId },
    include: {
      teamMembers: true,
      products: {
        include: {
          category: true,
        }
      },
      programStudi: true,
    }
  });

  if (!startup) return notFound();

  const formattedStartup = {
    id: startup.id.toString(),
    name: startup.name,
    category: startup.programStudi.name,
    bannerImage: startup.bannerImage || "/images/png/bg-toko.png",
    profileImage: startup.profileImage || "/images/svg/pp-akun.svg",
    description: startup.description,
    team: startup.teamMembers.map(m => ({
        id: m.id.toString(),
        name: m.name,
        role: m.role,
        photo: m.photo || "/images/svg/pp-akun.svg"
    }))
  };

  const formattedProducts = startup.products.map(p => ({
    id: p.id.toString(),
    title: p.title,
    category: p.category?.name || formattedStartup.category,
    description: p.description,
    price: Number(p.price) || 0,
    image: p.image ? p.image.split(",")[0] : "/images/svg/product1.svg",
  }));
  
  return (
    <DetailProfilStartup startup={formattedStartup} products={formattedProducts} />
  );
}