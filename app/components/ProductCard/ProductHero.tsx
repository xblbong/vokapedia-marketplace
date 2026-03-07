import Image from "next/image";

export default function ProductHero() {
  return (
    <section className="layout-container py-10">
      <div className="relative w-full h-[400px] rounded-[20px] overflow-hidden group">
        {/* Collage Images */}
        <div className="grid grid-cols-3 h-full">
          <div className="relative h-full border-r border-white/10">
            <Image src="/images/hero-prod-1.jpg" alt="1" fill className="object-cover" />
          </div>
          <div className="relative h-full border-r border-white/10">
            <Image src="/images/hero-prod-2.jpg" alt="2" fill className="object-cover" />
          </div>
          <div className="relative h-full">
            <Image src="/images/hero-prod-3.jpg" alt="3" fill className="object-cover" />
          </div>
        </div>

        {/* Gelap Overlay agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Text Content */}
        <div className="absolute bottom-12 left-12 text-white">
          <h1 className="text-[36px] font-bold mb-2">Temukan Produk Kreatif Mahasiswa</h1>
          <p className="text-[18px] opacity-90">Koleksi terkurasi dari startup Vokasi UB</p>
        </div>
      </div>
    </section>
  );
}