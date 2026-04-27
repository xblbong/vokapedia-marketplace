import { prisma } from "@/src/lib/prisma";
import { requireAuth } from "@/src/lib/auth";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { Package } from "lucide-react";

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
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-9 h-9 rounded-[10px] bg-[rgba(16,185,129,0.08)] flex items-center justify-center">
                    <Package size={20} color="#10B981" strokeWidth={2} />
                </div>
                <h1 className="text-[28px] font-bold text-[var(--color-main-text)]">Kelola Produk</h1>
            </div>
            <AdminCrudTable
                type="product"
                data={products.map(p => ({
                    id: p.id,
                    title: p.title,
                    description: p.description,
                    price: Number(p.price),
                    stock: p.stock,
                    image: p.image,
                    imageAlt: p.imageAlt,
                    ecommerceUrl: p.ecommerceUrl,
                    startupId: String(p.startupId),
                    categoryId: String(p.categoryId),
                    startup: p.startup.name,
                    category: p.category.name,
                }))}
                columns={["title", "price", "stock", "image", "startup", "category", "ecommerceUrl"]}
                columnLabels={["Nama Produk", "Harga", "Stok", "Gambar", "Startup", "Kategori", "Link E-commerce"]}
                imageColumns={["image"]}
                formFields={[
                    { name: "title", label: "Nama Produk", type: "text", required: true },
                    { name: "description", label: "Deskripsi", type: "textarea", required: true, minWords: 10 },
                    { name: "price", label: "Harga", type: "rupiah", required: true },
                    { name: "stock", label: "Stok", type: "number", required: true, min: 1 },
                    { name: "startupId", label: "Startup", type: "select", options: startups.map(s => ({ value: String(s.id), label: s.name })), required: true },
                    { name: "categoryId", label: "Kategori", type: "select", options: categories.map(c => ({ value: String(c.id), label: c.name })), required: true },
                    { name: "ecommerceUrl", label: "Link E-commerce", type: "url", required: true },
                    { name: "image", label: "Gambar Produk", type: "file", multiple: false, showAltField: true },
                ]}
            />
        </div>
    );
}
