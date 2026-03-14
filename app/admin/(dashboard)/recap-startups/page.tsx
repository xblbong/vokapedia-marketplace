import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import { ClipboardList } from "lucide-react";
import { StartupList } from "./StartupList";

export default async function RecapStartupsPage() {
    await requireAuth();

    const startups = await prisma.startup.findMany({
        include: {
            programStudi: { select: { name: true } },
            _count: { select: { teamMembers: true, products: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    const startupItems = startups.map((s) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        bannerImage: s.bannerImage,
        profileImage: s.profileImage,
        programStudi: {
            name: s.programStudi?.name ?? "",
        },
        _count: {
            teamMembers: s._count.teamMembers,
            products: s._count.products,
        },
    }));

    return (
        <div>
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[rgba(16,185,129,0.08)] flex items-center justify-center">
                    <ClipboardList size={20} color="#10B981" strokeWidth={2} />
                </div>
                <h1 className="text-[28px] font-bold text-[var(--color-main-text)]">
                    Rekap Startup
                </h1>
            </div>

            <StartupList startups={startupItems} />
        </div>
    );
}
