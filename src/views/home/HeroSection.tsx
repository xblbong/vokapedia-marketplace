import HeroSlider from '@/src/components/HeroSlider/HeroSlider'

interface HeroSectionProps {
  slides: {
    id: string;
    tagline: string;
    title: string;
    description: string;
    image: string;
    link: string;
  }[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  return (
   <main className="layout-container">
       <HeroSlider slides={slides} />
    </main>
  )
}
