import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedInSection } from "@/components/sections/FeaturedInSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { MissionSection } from "@/components/sections/MissionSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FAQSection } from "@/components/sections/FAQSection";
import { CTASection } from "@/components/sections/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedInSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TestimonialsSection />
      <MissionSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
