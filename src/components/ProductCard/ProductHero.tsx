import Image from "next/image";

export default function ProductHero() {
  return (
    <section className="py-10 mt-20">
      <div className="relative w-full h-[30rem] overflow-hidden group">
        {/* Collage Images */}
        <Image src="/images/svg/bg-produk.svg" alt="1" fill className="object-cover" />

        {/* Gelap Overlay agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Text Content */}
        <div className="layout-container absolute bottom-12 left-12 text-white">
          <h1 className="text-[36px] font-bold mb-2">Temukan Produk Kreatif Mahasiswa</h1>
          <p className="text-[18px] opacity-90">Koleksi terkurasi dari startup Vokasi UB</p>
        </div>
      </div>
    </section>
  );
}