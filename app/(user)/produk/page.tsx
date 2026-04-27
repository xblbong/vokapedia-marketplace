import { Suspense } from "react";
import ProductSection from "@/src/views/product/ProductSection";
import { prisma } from "@/src/lib/prisma";

export default async function ProdukPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const params = await searchParams;
    const q = params.q || "";
    const page = parseInt(params.page || "1", 10);
    const prodi = params.prodi && params.prodi !== "Semua" ? params.prodi : undefined;
    const kategori = params.kategori && params.kategori !== "Semua" ? params.kategori : undefined;

    const limit = 9;
    const skip = (page - 1) * limit;

    // 1. Build Where Clause
    const whereClause: any = {};
    
    if (q) {
        whereClause.OR = [
            { title: { contains: q } },
            { description: { contains: q } },
            { startup: { name: { contains: q } } },
        ];
    }
    if (prodi) {
        whereClause.startup = {
            ...whereClause.startup,
            programStudi: { name: prodi }
        };
    }
    if (kategori) {
        whereClause.category = { name: kategori };
    }

    // 2. Fetch Paginated Products & Total Count
    const [rawProducts, totalCount] = await Promise.all([
        prisma.product.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                category: true,
                startup: { include: { programStudi: true } }
            }
        }),
        prisma.product.count({ where: whereClause })
    ]);

    // 3. Fetch Filter Aggregations (Counts)
    // To get the exact counts for sidebar, we group by or fetch all and aggregate.
    // For simplicity and speed, we can do independent counts.
    // However, the cleanest way is asking Prisma to group, but Prisma group supports limit fields.
    const [allProducts, allProdisDb, allKategorisDb] = await Promise.all([
        prisma.product.findMany({
            where: q ? {
                OR: [
                    { title: { contains: q } },
                    { description: { contains: q } },
                    { startup: { name: { contains: q } } },
                ]
            } : {},
            include: {
                category: true,
                startup: { include: { programStudi: true } }
            }
        }),
        prisma.programStudi.findMany(),
        prisma.category.findMany()
    ]);

    const prodiCounts: Record<string, number> = {};
    const kategoriCounts: Record<string, number> = {};

    allProdisDb.forEach(p => prodiCounts[p.name] = 0);
    allKategorisDb.forEach(c => kategoriCounts[c.name] = 0);

    allProducts.forEach(p => {
        const prodName = p.startup?.programStudi?.name;
        const katName = p.category?.name;
        
        if (prodName && prodiCounts[prodName] !== undefined) prodiCounts[prodName]++;
        if (katName && kategoriCounts[katName] !== undefined) kategoriCounts[katName]++;
    });

    const prodiList = [{ name: "Semua", count: allProducts.length }, ...Object.entries(prodiCounts).map(([name, count]) => ({ name, count }))];
    const kategoriList = [{ name: "Semua", count: allProducts.length },...Object.entries(kategoriCounts).map(([name, count]) => ({ name, count }))];

    const products = rawProducts.map((p) => ({
        id: p.id.toString(),
        title: p.title,
        category: p.startup?.programStudi?.name || p.category?.name || "Lainnya",
        description: p.description,
        price: Number(p.price) || 0,
        image: p.image ? p.image.split(",")[0] : "/images/svg/product1.svg",
    }));

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return (
        <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center">Memuat produk...</div>}>
            <ProductSection 
                products={products} 
                totalPages={totalPages}
                currentPage={page}
                totalItems={totalCount}
                filters={{
                    prodiList,
                    kategoriList,
                    activeProdi: prodi || "Semua",
                    activeKategori: kategori || "Semua"
                }}
            />
        </Suspense>
    );
}