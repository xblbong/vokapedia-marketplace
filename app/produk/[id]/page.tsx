import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductView from "@/src/components/ProductCard/ProductView";
import StartupSummary from "@/src/components/StartupSummary/StartupSummary";


const startupData = {
    id: "startup-123",
    name: "Pop Ame",
    logoUrl: "/images/svg/pp-akun.svg",
    productCount: 5,
    category: "Aksesoris",
    studyProgram: "Desain Grafis",
    hasEcommerce: false,
    hasWhatsapp: true
};

export default async function ProductDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    // DUMMY DATA (Nanti ganti: await prisma.product.findUnique...)
    const productData = {
        id: id,
        title: "Keychain Recycle | Pop Ame",
        description: "Keychain handmade dari bahan daur ulang seperti mainan bekas dan clay, dirancang dengan detail rapi dan desain playful. Setiap produk memiliki karakter unik dan dapat digunakan sebagai gantungan kunci, tas, atau aksesoris harian yang ramah lingkungan.",
        price: 17000,
        images: [
            "/images/svg/product1.svg",
            "/images/png/product2.png",
            "/images/svg/product1.svg",
            "/images/png/product3.png"
        ],
        ecommerceUrl: "https://tokopedia.com",
        whatsappUrl: "https://wa.me/62812345678"
    };

    return (
        <main className="min-h-screen bg-[#F6F6F6]">
            <div className="layout-container pt-10">
                <div className="flex items-center gap-2 text-[14px] text-[#8F8F8F]">
                    <Link href="/" className="hover:text-black">Beranda</Link>
                    <ChevronRight size={14} />
                    <Link href="/produk" className="hover:text-black">Produk</Link>
                    <ChevronRight size={14} />
                    <span className="text-black text-[30px] font-medium">{productData.title}</span>
                </div>
            </div>

            <ProductView product={productData} />

            {/* Akun Brand */}
            <StartupSummary startup={startupData} />
        </main>
    );
}