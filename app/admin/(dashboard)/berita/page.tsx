import AdminCrudTable from "@/src/components/admin/AdminCrudTable";
import { prisma } from "@/src/lib/prisma";

export default async function AdminBeritaPage() {
    const rawBerita = await prisma.berita.findMany({
        include: { kategori: true },
        orderBy: { createdAt: "desc" },
    });
    
    const kategoriBerita = await prisma.kategoriBerita.findMany({
        orderBy: { name: "asc" },
    });

    const data = rawBerita.map((b) => ({
        id: b.id,
        judul: b.judul,
        slug: b.slug,
        isi_berita: b.isi_berita,
        gambar: b.gambar,
        gambarAlt: b.gambarAlt,
        is_slider: b.is_slider ? "true" : "false",
        is_slider_label: b.is_slider ? "Ya" : "Tidak",
        section_type: b.section_type,
        status: b.status,
        tags: b.tags,
        kategoriId: b.kategoriId,
        kategori_name: b.kategori?.name || "-",
        createdAt: b.createdAt.toLocaleDateString("id-ID"),
    }));

    const formFields: any[] = [
        { name: "judul", label: "Judul Berita", type: "text", required: true },
        { 
            name: "kategoriId", 
            label: "Kategori Berita", 
            type: "select", 
            required: true,
            options: kategoriBerita.map(k => ({ value: k.id.toString(), label: k.name }))
        },
        { 
            name: "section_type", 
            label: "Penempatan (Section)", 
            type: "select", 
            required: true,
            options: [
                { value: "TERBARU", label: "Berita Terbaru" },
                { value: "PROGRAM", label: "Program" },
                { value: "TEACHING_FACTORY", label: "Teaching Factory" }
            ]
        },
        { 
            name: "status", 
            label: "Status Publish", 
            type: "select", 
            required: true,
            options: [
                { value: "DRAFT", label: "Draft" },
                { value: "PUBLISHED", label: "Published" }
            ]
        },
        { 
            name: "is_slider", 
            label: "Tampilkan di Hero Slider?", 
            type: "select", 
            required: true,
            options: [
                { value: "false", label: "Tidak" },
                { value: "true", label: "Ya, Tampilkan" }
            ]
        },
        { name: "tags", label: "Tags (Pisahkan dengan koma)", type: "text", required: false },
        { name: "gambar", label: "Gambar Cover / Thumbnail", type: "file", required: false, multiple: false, showAltField: true },
        { name: "isi_berita", label: "Isi Berita Lengkap", type: "textarea", required: true }
    ];

    return (
        <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
            <div style={{ marginBottom: 24 }}>
                <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1E1E1E", margin: "0 0 8px" }}>Manajemen Berita</h1>
                <p style={{ color: "#8F8F8F", margin: 0 }}>Kelola konten berita dan Hero Slider Vokasi UB</p>
            </div>

            <AdminCrudTable
                type="berita"
                data={data}
                columns={["gambar", "judul", "kategori_name", "section_type", "status", "is_slider_label", "createdAt"]}
                columnLabels={["Cover", "Judul", "Kategori", "Section", "Status", "Hero Slider", "Tanggal"]}
                formFields={formFields}
                imageColumns={["gambar"]}
            />
        </div>
    );
}
