import { notFound } from "next/navigation";
import { prisma } from "@/src/lib/prisma";
import DetailProduk from "@/src/views/product/DetailProduk";

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
        notFound();
    }

    const rawProduct = await prisma.product.findUnique({
        where: { id: productId },
        include: {
            category: true,
            startup: {
                include: {
                    programStudi: true,
                    _count: {
                        select: { products: true }
                    }
                }
            }
        }
    });

    if (!rawProduct) {
        notFound();
    }

    const rawOtherProducts = await prisma.product.findMany({
        where: {
            startupId: rawProduct.startupId,
            id: { not: productId }
        },
        include: {
            category: true,
            startup: {
                include: {
                    programStudi: true
                }
            }
        },
        take: 10
    });

    // Transform data
    const productData = {
        id: rawProduct.id.toString(),
        title: rawProduct.title,
        description: rawProduct.description,
        price: Number(rawProduct.price) || 0,
        images: [rawProduct.image || "/images/svg/product1.svg"],
        ecommerceUrl: rawProduct.ecommerceUrl || "#",
        whatsappUrl: "#" // Default if not in DB
    };

    const startupData = {
        id: rawProduct.startup.id.toString(),
        name: rawProduct.startup.name,
        logoUrl: rawProduct.startup.profileImage || "/images/svg/pp-akun.svg",
        productCount: rawProduct.startup._count.products,
        category: rawProduct.category?.name || "Lainnya",
        studyProgram: rawProduct.startup.programStudi.name,
        hasEcommerce: rawProduct.ecommerceUrl !== "",
        hasWhatsapp: false
    };

    const otherProducts = rawOtherProducts.map(p => ({
        id: p.id.toString(),
        title: p.title,
        category: p.category?.name || p.startup?.programStudi?.name || "Lainnya",
        description: p.description,
        price: Number(p.price) || 0,
        image: p.image || "/images/svg/product1.svg",
    }));

    return (
        <DetailProduk 
            productData={productData} 
            startupData={startupData} 
            otherProducts={otherProducts} 
        />
    );
}