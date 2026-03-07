import HeroSlider from '@/app/components/HeroSlider/HeroSlider'

export default function HeroSection() {
  return (
   <main className="layout-container">
       <HeroSlider />
       
       {/* Section lainnya (Produk, dll) di bawah sini */}
       <section className="mt-20">
          <h2 className="text-[32px] font-bold">Produk Kami</h2>
          {/* ... */}
       </section>
    </main>
  )
}
