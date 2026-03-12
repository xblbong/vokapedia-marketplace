import AboutSection from "@/src/views/home/AboutSection";
import BikTefaSection from "@/src/views/home/BikTefaSection";
import HeroSection from "@/src/views/home/HeroSection";
import ProductSection from "@/src/views/home/ProductSection";
import ProgramStudi from "@/src/views/home/ProgramStudi";


export default function HomePage() {
  return (
    <div className="space-y-20">
      <HeroSection />
      <ProductSection />
      <AboutSection />
      <ProgramStudi />
      <BikTefaSection />
    </div>
  );
}