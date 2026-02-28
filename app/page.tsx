import { Box } from "@mui/material";
import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import DemoSection from "@/components/landing/DemoSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import LineIntegrationSection from "@/components/landing/LineIntegrationSection";
import SocialProofSection from "@/components/landing/SocialProofSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <Box>
      <LandingHeader />
      <HeroSection />
      <DemoSection />
      <HowItWorksSection />
      <BenefitsSection />
      <FeaturesSection />
      <LineIntegrationSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </Box>
  );
}
