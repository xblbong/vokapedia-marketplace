import AboutSection from "./views/home/AboutSection";
import BikTefaSection from "./views/home/BikTefaSection";
import HeroSection from "./views/home/HeroSection";
import ProductSection from "./views/home/ProductSection";
import ProgramStudi from "./views/home/ProgramStudi";

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