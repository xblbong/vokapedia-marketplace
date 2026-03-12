import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";

export default async function AdminProductsPage() {
    await requireAuth();

    const products = await prisma.product.findMany({
        include: { startup: { select: { name: true } }, category: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
    });
    const startups = await prisma.startup.findMany({ select: { id: true, name: true } });
    const categories = await prisma.category.findMany({ select: { id: true, name: true } });

    return (
        <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>📦 Kelola Produk</h1>
            <AdminCrudTable
                type="product"
                data={products.map(p => ({
                    id: p.id,
                    title: p.title,
                    price: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
                    stock: p.stock,
                    startup: p.startup.name,
                    category: p.category.name,
                }))}
                columns={["title", "price", "stock", "startup", "category"]}
                columnLabels={["Nama Produk", "Harga", "Stok", "Startup", "Kategori"]}
                formFields={[
                    { name: "title", label: "Nama Produk", type: "text", required: true },
                    { name: "description", label: "Deskripsi", type: "textarea" },
                    { name: "price", label: "Harga", type: "number", required: true },
                    { name: "stock", label: "Stok", type: "number" },
                    { name: "image", label: "URL Gambar", type: "text" },
                    { name: "startupId", label: "Startup", type: "select", options: startups.map(s => ({ value: String(s.id), label: s.name })), required: true },
                    { name: "categoryId", label: "Kategori", type: "select", options: categories.map(c => ({ value: String(c.id), label: c.name })), required: true },
                ]}
            />
        </div>
    );
}
