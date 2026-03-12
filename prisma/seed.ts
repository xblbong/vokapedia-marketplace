import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // 1. Create default admin
    const hashedPassword = await bcrypt.hash("admin123", 12);
    const admin = await prisma.user.upsert({
        where: { email: "admin@vokapedia.com" },
        update: {},
        create: {
            name: "Administrator",
            email: "admin@vokapedia.com",
            password: hashedPassword,
            role: "ADMINISTRATOR",
        },
    });
    console.log(`✅ Admin created: ${admin.email}`);

    // 2. Create Program Studi
    const prodiData = [
        { name: "Teknologi Informasi", description: "Berfokus pada pengembangan teknologi digital, sistem informasi, dan solusi IT berbasis industri.", icon: "/images/svg/icons/ti.svg" },
        { name: "Administrasi Bisnis", description: "Berfokus pada pengelolaan organisasi, manajemen operasional, dan strategi bisnis modern.", icon: "/images/svg/icons/adbis.svg" },
        { name: "Keuangan & Perbankan", description: "Berfokus pada pengelolaan keuangan, analisis investasi, dan sistem perbankan.", icon: "/images/svg/icons/keubank.svg" },
        { name: "Manajemen Perhotelan", description: "Berfokus pada layanan hospitality, pengelolaan usaha kuliner, pariwisata, dan pengalaman pelanggan berbasis standar industri.", icon: "/images/svg/icons/mp.svg" },
        { name: "Desain Grafis", description: "Berfokus pada kreativitas visual, branding, dan desain komunikasi berbasis digital.", icon: "/images/svg/icons/dg.svg" },
    ];

    for (const prodi of prodiData) {
        await prisma.programStudi.upsert({
            where: { name: prodi.name },
            update: {},
            create: prodi,
        });
    }
    console.log(`✅ ${prodiData.length} Program Studi created`);

    // 3. Create Categories
    const categoryData = ["Fashion", "Aksesori", "Kuliner", "Interior & Dekor", "Jasa Kreatif"];
    for (const name of categoryData) {
        await prisma.category.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }
    console.log(`✅ ${categoryData.length} Categories created`);

    // 4. Create sample Startup
    const desainGrafis = await prisma.programStudi.findUnique({ where: { name: "Desain Grafis" } });
    if (desainGrafis) {
        const startup = await prisma.startup.upsert({
            where: { slug: "pop-ame" },
            update: {},
            create: {
                name: "Pop Ame",
                slug: "pop-ame",
                description: "Merupakan brand aksesori handmade asal Malang yang memproduksi keychain, pin, phone strap, dan aksesori kustom dari bahan daur ulang seperti mainan bekas, clay, dan shrink paper.",
                bannerImage: "/images/png/bg-toko.png",
                profileImage: "/images/svg/pp-akun.svg",
                programStudiId: desainGrafis.id,
            },
        });
        console.log(`✅ Startup created: ${startup.name}`);

        // Team members
        const teamData = [
            { name: "Raufa Insani Lutfi", role: "Desain Grafis", photo: "/images/png/a.png" },
            { name: "Desviawan Rangga P", role: "Desain Grafis", photo: "/images/png/b.png" },
            { name: "Azzahra Julia Rachma", role: "Desain Grafis", photo: "/images/png/c.png" },
            { name: "Karinda Najla Shahira", role: "Desain Grafis", photo: "/images/png/d.png" },
        ];

        for (const member of teamData) {
            await prisma.teamMember.create({
                data: { ...member, startupId: startup.id },
            });
        }
        console.log(`✅ ${teamData.length} Team Members created`);

        // Products
        const aksesori = await prisma.category.findUnique({ where: { name: "Aksesori" } });
        if (aksesori) {
            const productData = [
                { title: "Keychain", description: "Aksesori handmade dari bahan daur ulang.", price: 17000, image: "/images/png/product3.png" },
                { title: "PIN", description: "Aksesori handmade dari bahan daur ulang.", price: 17000, image: "/images/png/product3.png" },
            ];
            for (const product of productData) {
                await prisma.product.create({
                    data: { ...product, startupId: startup.id, categoryId: aksesori.id },
                });
            }
            console.log(`✅ ${productData.length} Products created`);
        }
    }

    console.log("\n🎉 Seeding selesai!");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
