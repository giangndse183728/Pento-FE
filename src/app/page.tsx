import HeroSection from "@/features/landingpage/sections/HeroSection";
import ProSolSection from "@/features/landingpage/sections/ProSolSection";
import SmoothSectionScroll from "@/components/animation/SmoothSectionScroll";


export default function Home() {
  return (
    <div className="scroll-smooth">    
      <SmoothSectionScroll />
      <HeroSection />
      <ProSolSection/>
    </div>
  );
}
