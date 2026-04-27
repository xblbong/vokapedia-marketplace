import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { GraduationCap } from "lucide-react";

export default async function AdminProgramStudiPage() {
    await requireAuth();
    const programStudis = await prisma.programStudi.findMany({
        include: { _count: { select: { startups: true } } },
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[rgba(139,92,246,0.08)] flex items-center justify-center">
                    <GraduationCap size={20} color="#8B5CF6" strokeWidth={2} />
                </div>
                <h1 className="text-[28px] font-bold text-[var(--color-main-text)]">Kelola Program Studi</h1>
            </div>
            <AdminCrudTable
                type="program-studi"
                data={programStudis.map(p => ({ 
                    id: p.id, 
                    name: p.name, 
                    description: p.description, 
                    icon: p.icon, 
                    iconAlt: p.iconAlt,
                    startups: p._count.startups 
                }))}
                columns={["name", "description", "icon", "startups"]}
                columnLabels={["Nama Prodi", "Deskripsi", "Icon", "Jumlah Startup"]}
                imageColumns={["icon"]}
                formFields={[
                    { name: "name", label: "Nama Program Studi", type: "text", required: true },
                    { name: "description", label: "Deskripsi", type: "textarea" },
                    { name: "icon", label: "Icon SVG", type: "file", showAltField: true },
                ]}
            />
        </div>
    );
}
