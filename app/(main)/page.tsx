import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ScrollSection from "@/components/home/ScrollSection";
import SponsorsSection from "@/components/home/SponsorsSection";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main className="bg-black">
      <HeroSection />
      <SponsorsSection />
      <ScrollSection />
      <FeaturesSection />
      <CTASection />
    </main>
  );
}
