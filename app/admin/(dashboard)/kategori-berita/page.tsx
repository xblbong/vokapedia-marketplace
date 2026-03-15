import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { prisma } from "@/src/lib/prisma";

export default async function AdminKategoriBeritaPage() {
    const categories = await prisma.kategoriBerita.findMany({
        orderBy: { id: "desc" },
    });

    return (
        <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1E1E1E", margin: "0 0 8px" }}>Kategori Berita</h1>
                <p style={{ color: "#8F8F8F", margin: 0 }}>Kelola kategori berita Vokasi UB</p>
            </div>

            <AdminCrudTable
                type="kategori-berita"
                data={categories}
                columns={["id", "name"]}
                columnLabels={["ID", "Nama Kategori Berita"]}
                formFields={[{ name: "name", label: "Nama Kategori Berita", type: "text", required: true }]}
            />
        </div>
    );
}
