import AboutSection from "./views/home/AboutSection";
import HeroSection from "./views/home/HeroSection";
import ProductSection from "./views/home/ProductSection";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      <HeroSection />
      <ProductSection />
       <AboutSection />
      <div className="">
        {/* 
       
        <StudyPrograms />
        <BIKSection /> */}
      </div>
    </div>
  );
}