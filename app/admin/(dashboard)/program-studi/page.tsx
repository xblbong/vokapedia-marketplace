import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";

export default async function AdminProgramStudiPage() {
    await requireAuth();
    const programStudis = await prisma.programStudi.findMany({
        include: { _count: { select: { startups: true } } },
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>🎓 Kelola Program Studi</h1>
            <AdminCrudTable
                type="program-studi"
                data={programStudis.map(p => ({ id: p.id, name: p.name, description: p.description, startups: p._count.startups }))}
                columns={["name", "description", "startups"]}
                columnLabels={["Nama Prodi", "Deskripsi", "Jumlah Startup"]}
                formFields={[
                    { name: "name", label: "Nama Program Studi", type: "text", required: true },
                    { name: "description", label: "Deskripsi", type: "textarea" },
                    { name: "icon", label: "URL Icon SVG", type: "text" },
                ]}
            />
        </div>
    );
}
