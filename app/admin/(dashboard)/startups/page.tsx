import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import { Building2 } from "lucide-react";
import StartupManager from "@/src/components/admin/StartupManager";

export default async function AdminStartupsPage() {
    await requireAuth();

    const startups = await prisma.startup.findMany({
        include: {
            category: { select: { name: true } },
            programStudi: { select: { name: true } },
            teamMembers: {
                include: { programStudi: { select: { name: true } } }
            },
            _count: { select: { teamMembers: true, products: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    const programStudis = await prisma.programStudi.findMany({ select: { id: true, name: true } });
    const categories = await prisma.category.findMany({ select: { id: true, name: true } });

    return (
        <div>
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[rgba(245,158,11,0.08)] flex items-center justify-center">
                    <Building2 size={20} color="#F59E0B" strokeWidth={2} />
                </div>
                <h1 className="text-[28px] font-bold text-[var(--color-main-text)]">Kelola Startup</h1>
            </div>
            <StartupManager
                startups={startups.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    bannerImage: s.bannerImage,
                    profileImage: s.profileImage,
                    categoryId: s.categoryId || 0,
                    categoryName: s.category?.name || "Tanpa Kategori",
                    programStudiId: s.programStudiId || 0,
                    programStudiName: s.programStudi?.name || "Tanpa Prodi",
                    membersCount: s._count.teamMembers,
                    productsCount: s._count.products,
                    teamMembers: s.teamMembers.map(m => ({
                        id: m.id,
                        name: m.name,
                        role: m.role,
                        photo: m.photo,
                        instagramUrl: m.instagramUrl || "",
                        programStudiId: m.programStudiId || 0,
                        programStudiName: m.programStudi?.name || "Tanpa Prodi",
                    })),
                }))}
                programStudis={programStudis.map(p => ({ value: String(p.id), label: p.name }))}
                categories={categories.map(c => ({ value: String(c.id), label: c.name }))}
            />
        </div>
    );
}
