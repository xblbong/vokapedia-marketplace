import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { Tag } from "lucide-react";

export default async function AdminCategoriesPage() {
    await requireAuth();
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    });

    return (
        <div>
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[rgba(0,98,255,0.08)] flex items-center justify-center">
                    <Tag size={20} color="#0062FF" strokeWidth={2} />
                </div>
                <h1 className="text-[28px] font-bold text-[var(--color-main-text)]">Kelola Kategori</h1>
            </div>
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
