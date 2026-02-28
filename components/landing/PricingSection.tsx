"use client";

import { useState } from "react";
import { Box, Container, Typography, Paper, Button, Stack, Chip, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";

export default function PricingSection() {
  const t = useTranslations("landing.pricing");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const features = [
    t("feature1"),
    t("feature2"),
    t("feature3"),
    t("feature4"),
    t("feature5"),
    t("feature6"),
    t("feature7"),
    t("feature8"),
  ];

  return (
    <Box
      id="pricing"
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            {t("title")}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 600, mx: "auto" }}>
            {t("subtitle")}<br />
            {t("subtitleLine2")}
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 500, mx: "auto" }}>
          <Paper
            elevation={24}
            sx={{
              p: 5,
              borderRadius: 4,
              position: "relative",
              overflow: "visible",
            }}
          >
            <Chip
              label={t("limitedOffer")}
              color="error"
              sx={{
                position: "absolute",
                top: -16,
                left: "50%",
                transform: "translateX(-50%)",
                fontWeight: "bold",
                fontSize: "0.9rem",
                py: 2.5,
              }}
            />

            <Box sx={{ textAlign: "center", mb: 4, mt: 2 }}>
              <Typography variant="h6" color="text.secondary" mb={1}>
                {t("planName")}
              </Typography>
              <Stack
                direction="row"
                alignItems="baseline"
                justifyContent="center"
                spacing={0.5}
                mb={1}
              >
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "3rem", md: "4rem" } }}
                >
                  {t("price")}
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  {t("perMonth")}
                </Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {t("taxIncluded")}
              </Typography>
            </Box>

            <Stack spacing={2} mb={4}>
              {features.map((feature, index) => (
                <Stack
                  key={index}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  <CheckCircleIcon sx={{ color: "#10b981", fontSize: 24 }} />
                  <Typography variant="body1">{feature}</Typography>
                </Stack>
              ))}
            </Stack>

            <Button
              onClick={async () => {
                setLoading(true);

                // Check if user is logged in
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                  // Not logged in - redirect to signup
                  router.push("/signup");
                  return;
                }

                // Logged in - create checkout session
                try {
                  const response = await fetch("/api/stripe/checkout", {
                    method: "POST",
                  });

                  const data = await response.json();

                  if (data.url) {
                    window.location.href = data.url;
                  } else {
                    console.error("No checkout URL returned");
                    setLoading(false);
                  }
                } catch (error) {
                  console.error("Checkout error:", error);
                  setLoading(false);
                }
              }}
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <RocketLaunchIcon />}
              sx={{
                py: 2,
                fontSize: "1.1rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                "&:hover": {
                  background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                },
              }}
            >
              {loading ? t("loading") : t("startNow")}
            </Button>

            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              mt={2}
            >
              {t("cancelAnytime")}
            </Typography>
          </Paper>
        </Box>

        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
            {t("paymentMethods")}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {t("paymentDetails")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
