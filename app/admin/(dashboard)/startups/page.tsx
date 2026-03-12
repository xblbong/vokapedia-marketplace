import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";

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
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>🏢 Kelola Startup</h1>
            <AdminCrudTable
                type="startup"
                data={startups.map(s => ({
                    id: s.id,
                    name: s.name,
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
