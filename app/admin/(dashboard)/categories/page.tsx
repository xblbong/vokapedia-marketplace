import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";

export default async function AdminCategoriesPage() {
    await requireAuth();
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>🏷️ Kelola Kategori</h1>
            <AdminCrudTable
                type="category"
                data={categories.map(c => ({ id: c.id, name: c.name, products: c._count.products }))}
                columns={["name", "products"]}
                columnLabels={["Nama Kategori", "Jumlah Produk"]}
                formFields={[
                    { name: "name", label: "Nama Kategori", type: "text", required: true },
                ]}
            />
        </div>
    );
}
