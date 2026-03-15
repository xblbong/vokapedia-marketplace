import { prisma } from "@/src/lib/prisma";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { requireAdmin } from "@/src/lib/auth";

export const metadata = { title: "Menu Overlay | Vokapedia Admin" };

export default async function MenuOverlayPage() {
    await requireAdmin();

    const menuDataRaw = await prisma.menuOverlayItem.findMany({
        orderBy: [
            { sectionName: 'asc' },
            { order: 'asc' }
        ],
    });

    const menuData = menuDataRaw.map(m => ({
        id: m.id,
        "Nama Grup Menu": m.sectionName,
        "Label Item": m.label,
        "URL Tujuan": m.url,
        "Urutan (Kecil ke Besar)": m.order.toString(),
    }));

    // Example groups
    const sectionOptions = [
        { value: "Berita Terbaru", label: "Berita Terbaru" },
        { value: "Program", label: "Program" },
        { value: "Fasilitas", label: "Fasilitas" },
        { value: "Lainnya", label: "Lainnya" }
    ];

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Menu Overlay</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola item menu yang muncul di popup saat menekan ikon hamburger. Anda bebas mengatur menu dan mengarahkan ke link statis atau URL eksternal.
                    </p>
                </div>
            </div>

            <AdminCrudTable
                type="menu-overlay"
                data={menuData}
                columns={["Nama Grup Menu", "Label Item", "URL Tujuan", "Urutan (Kecil ke Besar)"]}
                columnLabels={["Nama Grup Menu", "Label Item", "URL Tujuan", "Order (Paling atas = 0)"]}
                formFields={[
                    { name: "sectionName", label: "Nama Grup (Contoh: Berita Terbaru atau Program)", type: "select", options: sectionOptions, required: true },
                    { name: "label", label: "Teks Link / Label", type: "text", required: true },
                    { name: "url", label: "URL Tujuan (Gunakan huruf kecil. Contoh: /halaman/tujuan-program)", type: "text", required: true },
                    { name: "order", label: "Urutan Tampil (Angka)", type: "number", required: true },
                ]}
            />
        </div>
    );
}
