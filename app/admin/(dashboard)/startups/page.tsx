import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { Building2 } from "lucide-react";

export default async function AdminStartupsPage() {
    await requireAuth();

    const startups = await prisma.startup.findMany({
        include: {
            programStudi: { select: { name: true } },
            _count: { select: { teamMembers: true, products: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    const programStudis = await prisma.programStudi.findMany({ select: { id: true, name: true } });

    return (
        <div>
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[rgba(245,158,11,0.08)] flex items-center justify-center">
                    <Building2 size={20} color="#F59E0B" strokeWidth={2} />
                </div>
                <h1 className="text-[28px] font-bold text-[var(--color-main-text)]">Kelola Startup</h1>
            </div>
            <AdminCrudTable
                type="startup"
                data={startups.map(s => ({
                    id: s.id,
                    name: s.name,
                    description: s.description,
                    bannerImage: s.bannerImage,
                    profileImage: s.profileImage,
                    programStudiId: String(s.programStudiId),
                    programStudi: s.programStudi.name,
                    members: s._count.teamMembers,
                    products: s._count.products,
                }))}
                columns={["name", "programStudi", "members", "products"]}
                columnLabels={["Nama Startup", "Program Studi", "Anggota", "Produk"]}
                formFields={[
                    { name: "name", label: "Nama Startup", type: "text", required: true },
                    { name: "description", label: "Deskripsi", type: "textarea" },
                    { name: "bannerImage", label: "URL Banner Image", type: "text" },
                    { name: "profileImage", label: "URL Profile Image", type: "text" },
                    { name: "programStudiId", label: "Program Studi", type: "select", options: programStudis.map(p => ({ value: String(p.id), label: p.name })), required: true },
                ]}
            />
        </div>
    );
}
