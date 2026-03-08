"use client";
import { useState } from "react";
import Image from "next/image";
import { Share2, Link as LinkIcon, MessageCircle, Images } from "lucide-react"; // Install lucide-react

interface ProductViewProps {
  product: {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    ecommerceUrl: string;
    whatsappUrl: string;
  };
}

export default function ProductView({ product }: ProductViewProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  const formatPrice = (p: number) => new Intl.NumberFormat("id-ID").format(p);

  const handleShare = async () => {
    const shareData = {
      title: product.title,
      text: `Cek produk keren ini di Vokapedia: ${product.title}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Error sharing", err);
      }
    } else {
      // Fallback: Copy Link
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard!");
    }
  };

  return (
    <div className="layout-container py-7 md:py-16">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* KIRI: GALERI GAMBAR */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div 
            className="relative aspect-square w-full rounded-[20px] overflow-hidden cursor-zoom-in shadow-sm border border-gray-100"
            onClick={() => setShowLightbox(true)}
          >
            <Image 
              src={product.images[selectedImage]} 
              alt={product.title} 
              fill 
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-3 md:grid-cols-4 gap-4 ">
            {product.images.map((img, idx) => (
              <div 
                key={idx}
                className={`relative aspect-square rounded-[15px] overflow-hidden cursor-pointer border-2 transition-all ${
                  selectedImage === idx ? "border-[#0062FF]" : "border-transparent opacity-70 hover:opacity-100"
                }`}
                onClick={() => setSelectedImage(idx)}
              >
                <Image src={img} alt="Thumb" fill className="object-cover w-36" />
              </div>
            ))}
          </div>
        </div>

        {/* KANAN: INFO PRODUK */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Header Row */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-[#0062FF] font-normal text-[20px] uppercase tracking-wider">
              Detail Produk
            </span>
            <button 
              onClick={handleShare}
              className="flex items-center gap-2 text-[#1E1E1E] opacity-70 hover:opacity-100 transition-opacity font-medium"
            >
              <Share2 size={18} />
              <span className="text-[14px]">Bagikan</span>
            </button>
          </div>

          {/* Title */}
          <h1 className="text-[20px] md:text-[30px] font-bold text-[#1E1E1E] leading-tight mb-6">
            {product.title}
          </h1>

          {/* Description */}
          <p className="text-[14px] md:text-[20px] text-[#8F8F8F] leading-[1.8] mb-10">
            {product.description}
          </p>

          {/* Price */}
          <div className="mb-10">
            <p className="text-[22px] text-[#8F8F8F] mb-1">Harga Mulai</p>
            <p className="text-[46px] font-bold text-[#1E1E1E] leading-none">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Buttons Group */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={product.ecommerceUrl} 
              target="_blank"
              className="flex-1 h-[60px] bg-[#1E1E1E] text-white rounded-[15px] flex items-center justify-center gap-3 hover:bg-black transition-all font-bold text-[18px]"
            >
              <Image src="/images/svg/icons/tokped.svg" alt="E-Commerce" width={32} height={32} />
              E-Commerce
            </a>
            
            <a 
              href={product.whatsappUrl} 
              target="_blank"
              className="flex-1 h-[60px] bg-[#37D94F] text-white rounded-[15px] flex items-center justify-center gap-3 hover:bg-[#2fb943] transition-all font-bold text-[18px]"
            >
              <Image src="/images/svg/icons/wa.svg" alt="E-Commerce" width={36} height={36} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL (Click to close) */}
      {showLightbox && (
        <div 
          className="fixed inset-0 z-[99] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setShowLightbox(false)}
        >
          <button className="absolute top-10 right-10 text-white text-4xl">&times;</button>
          <div className="relative w-full max-w-5xl aspect-square">
            <Image 
              src={product.images[selectedImage]} 
              alt="Zoomed" 
              fill 
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}