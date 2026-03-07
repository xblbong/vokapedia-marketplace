// components/home/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";

interface ProductProps {
    id: string;
    title: string;
    category: string;
    description: string;
    price: number;
    image: string;
}

export default function ProductCard({ product }: { product: ProductProps }) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(price).replace("Rp", "Rp ");
    };

    return (
        /* Kita gunakan w-full max-w-[397px] agar responsive di mobile */
        <div className="w-full max-w-[397px] h-auto min-h-[398px] bg-white rounded-[21.75px] p-[14px] flex flex-col gap-[16px] nav-shadow hover:scale-[1.02] transition-transform duration-300">

            {/* Image Card Section */}
            <div className="w-full h-[179px] relative rounded-[15px] overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Text Content Section */}
            <div className="flex-1 px-[10px] sm:px-[21.75px] flex flex-col">
                {/* Title & Category Row */}
                <div className="flex justify-between items-center w-full mb-3">
                    <h3 className="text-3xl sm:text-3xl font-bold text-[#1E1E1E] leading-tight">
                        {product.title}
                    </h3>
                    <span className="text-[12px] sm:text-sm font-normal text-[#8F8F8F] text-right shrink-0">
                        {product.category}
                    </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#8F8F8F] leading-5 line-clamp-2 mb-6">
                    {product.description}
                </p>

                {/* Price & Button Row */}
                <div className="mt-auto pb-3 flex justify-between items-end">
                    <div className="flex flex-col">
                        <span className="text-[12px] text-[#8F8F8F]">Mulai dari</span>
                        <span className="text-[18px] sm:text-[20px] font-bold text-[#1E1E1E]">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    <Link
                        href={`/produk/${product.id}`}
                        className="bg-[#1E1E1E] text-white px-[16px] sm:px-[20px] py-[10px] rounded-[10px] text-[14px] font-bold hover:bg-black transition-colors"
                    >
                        Lihat Produk
                    </Link>
                </div>
            </div>
        </div>
    );
}