import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 2MB untuk gambar produk/berita, 300KB untuk banner/profil (divalidasi di client)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB global max
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/webp"];
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".svg", ".webp"];

export async function POST(request: NextRequest) {
    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json(
            { error: "Format request tidak valid. Pastikan mengirim file sebagai multipart/form-data." },
            { status: 400 }
        );
    }

    try {
        const files = formData.getAll("file") as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: "Tidak ada file yang di-upload" },
                { status: 400 }
            );
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const uploadedPaths: string[] = [];

        for (const file of files) {
            // Validate file size
            if (file.size > MAX_FILE_SIZE) {
                const mb = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
                return NextResponse.json(
                    { error: `Ukuran gambar "${file.name}" terlalu besar. Maksimal ${mb}MB.` },
                    { status: 400 }
                );
            }

            // Validate file type
            const ext = path.extname(file.name).toLowerCase();
            if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXTENSIONS.includes(ext)) {
                return NextResponse.json(
                    { error: `Format file "${file.name}" tidak didukung. Gunakan PNG, JPG, JPEG, WebP, atau SVG.` },
                    { status: 400 }
                );
            }

            // Generate unique filename
            const uniqueName = `${uuidv4()}${ext}`;
            const filePath = path.join(uploadDir, uniqueName);

            // Write file
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            await writeFile(filePath, buffer);

            uploadedPaths.push(`/uploads/${uniqueName}`);
        }

        return NextResponse.json({ paths: uploadedPaths });
    } catch {
        return NextResponse.json(
            { error: "Terjadi kesalahan saat memproses upload. Silakan coba lagi." },
            { status: 500 }
        );
    }
}
