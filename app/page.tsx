"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Container } from "@mui/material";
import { createClient } from "@/lib/supabase/client";
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

export default function Home() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // User is already logged in, redirect to app
          router.push("/app");
          return;
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        setChecking(false);
      }
    };

    checkUser();
  }, [router]);

  // Show loading state while checking auth
  if (checking) {
    return (
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

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
