import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST() {
    try {
        // 1. Admin
        const hashedPassword = await bcrypt.hash("admin123", 12);
        const admin = await prisma.user.upsert({
            where: { email: "admin@vokapedia.com" },
            update: {},
            create: { name: "Administrator", email: "admin@vokapedia.com", password: hashedPassword, role: "ADMINISTRATOR" },
        });

        // 2. Program Studi
        const prodiData = [
            { name: "Teknologi Informasi", description: "Berfokus pada pengembangan teknologi digital, sistem informasi, dan solusi IT berbasis industri.", icon: "/images/svg/icons/ti.svg" },
            { name: "Administrasi Bisnis", description: "Berfokus pada pengelolaan organisasi, manajemen operasional, dan strategi bisnis modern.", icon: "/images/svg/icons/adbis.svg" },
            { name: "Keuangan & Perbankan", description: "Berfokus pada pengelolaan keuangan, analisis investasi, dan sistem perbankan.", icon: "/images/svg/icons/keubank.svg" },
            { name: "Manajemen Perhotelan", description: "Berfokus pada layanan hospitality, pengelolaan usaha kuliner, pariwisata, dan pengalaman pelanggan.", icon: "/images/svg/icons/mp.svg" },
            { name: "Desain Grafis", description: "Berfokus pada kreativitas visual, branding, dan desain komunikasi berbasis digital.", icon: "/images/svg/icons/dg.svg" },
        ];
        for (const prodi of prodiData) {
            await prisma.programStudi.upsert({ where: { name: prodi.name }, update: {}, create: prodi });
        }

        // 3. Categories
        const categoryData = ["Fashion", "Aksesori", "Kuliner", "Interior & Dekor", "Jasa Kreatif"];
        for (const name of categoryData) {
            await prisma.category.upsert({ where: { name }, update: {}, create: { name } });
        }

        // 4. Sample Startup
        const desainGrafis = await prisma.programStudi.findUnique({ where: { name: "Desain Grafis" } });
        if (desainGrafis) {
            const startup = await prisma.startup.upsert({
                where: { slug: "pop-ame" },
                update: {},
                create: {
                    name: "Pop Ame", slug: "pop-ame",
                    description: "Brand aksesori handmade asal Malang yang memproduksi keychain, pin, phone strap dari bahan daur ulang.",
                    bannerImage: "/images/png/bg-toko.png", profileImage: "/images/svg/pp-akun.svg",
                    programStudiId: desainGrafis.id,
                },
            });

            const existingMembers = await prisma.teamMember.count({ where: { startupId: startup.id } });
            if (existingMembers === 0) {
                await prisma.teamMember.createMany({
                    data: [
                        { name: "Raufa Insani Lutfi", role: "Desain Grafis", photo: "/images/png/a.png", startupId: startup.id },
                        { name: "Desviawan Rangga P", role: "Desain Grafis", photo: "/images/png/b.png", startupId: startup.id },
                        { name: "Azzahra Julia Rachma", role: "Desain Grafis", photo: "/images/png/c.png", startupId: startup.id },
                        { name: "Karinda Najla Shahira", role: "Desain Grafis", photo: "/images/png/d.png", startupId: startup.id },
                    ],
                });
            }

            const aksesori = await prisma.category.findUnique({ where: { name: "Aksesori" } });
            if (aksesori) {
                const existingProducts = await prisma.product.count({ where: { startupId: startup.id } });
                if (existingProducts === 0) {
                    await prisma.product.createMany({
                        data: [
                            { title: "Keychain", description: "Aksesori handmade dari bahan daur ulang.", price: 17000, image: "/images/png/product3.png", startupId: startup.id, categoryId: aksesori.id },
                            { title: "PIN", description: "Aksesori handmade dari bahan daur ulang.", price: 17000, image: "/images/png/product3.png", startupId: startup.id, categoryId: aksesori.id },
                        ],
                    });
                }
            }
        }

        return NextResponse.json({ success: true, message: "Database seeded!", admin: { email: admin.email, password: "admin123" } });
    } catch (error) {
        console.error("Seed error:", error);
        return NextResponse.json({ error: "Failed to seed", details: String(error) }, { status: 500 });
    }
}
