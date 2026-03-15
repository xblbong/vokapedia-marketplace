"use client";
import FilterSidebar from "@/src/components/FilterSidebar/FilterSidebar";
import Pagination from "@/src/components/Pagination/Pagination";
import ProductCard from "@/src/components/ProductCard/ProductCard";
import ProductHero from "@/src/components/ProductCard/ProductHero";
import StartupSummary from "@/src/components/StartupSummary/StartupSummary";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface FilterItem {
    name: string;
    count: number;
}

interface ProductSectionProps {
    products: {
        id: string;
        title: string;
        category: string;
        description: string;
        price: number;
        image: string;
    }[];
    totalPages: number;
    currentPage: number;
    totalItems: number;
    filters: {
        prodiList: FilterItem[];
        kategoriList: FilterItem[];
        activeProdi: string;
        activeKategori: string;
    };
}

export default function ProductSection({
    products,
    totalPages,
    currentPage,
    totalItems,
    filters
}: ProductSectionProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Utility update URL params helper
    const updateUrlParams = (key: string, value: string) => {
        const url = new URL(pathname, window.location.href);
        searchParams.forEach((v, k) => url.searchParams.set(k, v));

        if (value && value !== "Semua") {
            url.searchParams.set(key, value);
        } else {
            url.searchParams.delete(key);
        }

        if (key !== "page") {
            url.searchParams.delete("page");
        }
        router.push(url.pathname + url.search);
    };

    return (
        <main className="min-h-screen bg-[#F6F6F6] pb-20">
            <ProductHero />

            <div className="layout-container flex flex-col lg:flex-row gap-8 xl:gap-12 mt-10 px-4 md:px-10 lg:px-0">

                {/* KIRI: Filter Sidebar (Akan berada di atas di mobile, di kiri di desktop) */}
                <aside className="w-full lg:w-[300px] shrink-0">
                    <FilterSidebar
                        prodiList={filters.prodiList}
                        kategoriList={filters.kategoriList}
                        activeProdi={filters.activeProdi}
                        activeKategori={filters.activeKategori}
                        onProdiChange={(val) => updateUrlParams("prodi", val)}
                        onKategoriChange={(val) => updateUrlParams("kategori", val)}
                    />
                </aside>

                {/* KANAN: Content Area */}
                <div className="flex-1 flex flex-col gap-6 md:gap-8">

                    {/* Title Header */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-[20px] md:text-[24px] font-bold text-[#1E1E1E]">
                            Semua Produk
                        </h2>
                        <p className="text-[12px] md:text-[14px] text-[#8F8F8F]">
                            Menampilkan {products.length} Produk
                        </p>
                    </div>

                    {products.length > 0 ? (
                        <div className="flex flex-wrap justify-center lg:justify-start gap-y-6 gap-x-4 md:gap-x-6">
                            {products.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.33%-16px)] max-w-[400px] lg:max-w-none"
                                >
                                    <ProductCard product={item} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-white rounded-2xl border border-gray-100 text-center px-4 w-full nav-shadow">
                            <div className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] mb-6 relative">
                                <img src="/images/svg/icons/search.svg" alt="Not found" className="object-contain w-full h-full opacity-30 grayscale" />
                            </div>
                            <h3 className="text-[20px] md:text-[24px] font-bold text-[#1E1E1E] mb-3">Produk Tidak Ditemukan</h3>
                            <p className="text-[14px] md:text-[16px] text-[#8F8F8F] max-w-[450px] mb-8">
                                Maaf, kami tidak dapat menemukan produk yang sesuai dengan pencarian atau filter yang kamu pilih.
                            </p>
                            <div className="bg-gray-50 rounded-xl p-5 md:p-6 text-left w-full max-w-[500px] border border-gray-100">
                                <span className="font-bold text-[14px] md:text-[15px] text-[#1E1E1E] block mb-3">Saran Pencarian:</span>
                                <ul className="list-disc pl-5 text-[13px] md:text-[14px] text-[#545454] space-y-2">
                                    <li>Periksa kembali ejaan kata kunci pencarian kamu.</li>
                                    <li>Gunakan kata kunci yang lebih umum.</li>
                                    <li>Hapus atau ubah filter Program Studi / Kategori.</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => updateUrlParams("page", page.toString())}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}