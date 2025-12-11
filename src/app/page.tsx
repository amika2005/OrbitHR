import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesGrid } from "@/components/landing/ServicesGrid";
import { TechStackSlider } from "@/components/landing/TechStackSlider";
import { StickyFooter } from "@/components/landing/StickyFooter";
import { TrustedBy } from "@/components/landing/TrustedBy";
import { FeatureShowcase } from "@/components/landing/FeatureShowcase";
import { Header } from "@/components/landing/Header";
import { CTASection } from "@/components/landing/CTASection";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-zinc-900 overflow-x-hidden">
      {/* Main content wrapper with margin for sticky footer reveal on desktop */}
      <div className="relative z-10 bg-white shadow-2xl rounded-b-3xl mb-0 lg:mb-[500px]">
        
        <Header />

        <HeroSection />
        <TrustedBy />
        <ServicesGrid />
        <FeatureShowcase />
        <TechStackSlider />
        
        <CTASection />
      </div>

      <StickyFooter />
    </div>
  );
}
