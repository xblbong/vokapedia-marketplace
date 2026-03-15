import { prisma } from "@/src/lib/prisma";
import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { requireAdmin } from "@/src/lib/auth";

export const metadata = { title: "Manajemen Halaman | Vokapedia Admin" };

export default async function HalamanPage() {
    await requireAdmin();

    const halamanDataRaw = await prisma.halaman.findMany({
        orderBy: { updatedAt: "desc" },
    });

    const halamanData = halamanDataRaw.map(h => ({
        id: h.id,
        "Judul Halaman": h.title,
        "Slug (URL)": h.slug,
        "Isi Konten": h.content,
        "Update Terakhir": h.updatedAt.toLocaleDateString("id-ID"),
    }));

    return (
        <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manajemen Halaman Statis</h1>
                    <p className="text-gray-500 mt-1">
                        Kelola halaman artikel atau informasi seperti Program, Badan Inovasi, Teaching Factory, dll. Halaman ini akan otomatis muncul saat user membuka /halaman/[slug].
                    </p>
                </div>
            </div>

            <AdminCrudTable
                type="halaman"
                data={halamanData}
                columns={["Judul Halaman", "Slug (URL)", "Update Terakhir"]}
                columnLabels={["Judul Halaman", "Slug (URL)", "Update Terakhir"]}
                formFields={[
                    { name: "title", label: "Judul Halaman", type: "text", required: true },
                    { name: "content", label: "Isi Konten Halaman (Bisa menggunakan spasi dan enter untuk paragraf baru)", type: "textarea", required: true },
                ]}
            />
        </div>
    );
}
