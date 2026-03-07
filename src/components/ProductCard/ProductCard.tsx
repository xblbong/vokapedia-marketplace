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
        <div className="w-full max-w-[397px] bg-white rounded-[20px] p-3 md:p-[14px] flex flex-col gap-4 md:gap-[16px] nav-shadow hover:translate-y-[-5px] transition-transform duration-300">

            <div className="w-full h-[160px] md:h-[179px] relative rounded-[12px] md:rounded-[15px] overflow-hidden">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Text Content Section */}
            <div className="flex-1 px-1 md:px-[10px] flex flex-col">
                {/* Title & Category Row */}
                <div className="flex justify-between items-start w-full mb-2 md:mb-3 gap-2">
                    <h3 className="text-[14px] sm:text-[16px] md:text-[22px] font-bold text-[#1E1E1E] leading-tight line-clamp-1">
                        {product.title}
                    </h3>
                    <span className="text-[10px] md:text-[11px] font-normal text-[#8F8F8F] text-right shrink-0 mt-1 md:mt-2">
                        {product.category}
                    </span>
                </div>

                <p className="text-[11px] md:text-[11px] text-[#8F8F8F] leading-snug md:leading-5 line-clamp-2 mb-4 md:mb-6">
                    {product.description}
                </p>

                {/* Price & Button Row */}
                <div className="mt-auto pb-1 flex justify-between items-end gap-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-[11px] text-[#8F8F8F]">Mulai dari</span>
                        <span className="text-[16px] md:text-[20px] font-bold text-[#1E1E1E] whitespace-nowrap">
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    <Link
                        href={`/produk/${product.id}`}
                        className="bg-[#1E1E1E] text-white px-3 py-2 md:px-[10px] md:py-[8px] rounded-[8px] md:rounded-[10px] text-[10px] md:text-[11px] font-normal hover:bg-black transition-colors shrink-0"
                    >
                        Lihat Produk
                    </Link>
                </div>
            </div>
        </div>
    );
}