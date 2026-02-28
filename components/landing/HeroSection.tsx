"use client";

import { Box, Typography, Button, Container, Stack, Paper } from "@mui/material";
import Link from "next/link";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { keyframes } from "@mui/system";
import { useTranslations } from "next-intl";

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`;

export default function HeroSection() {
  const t = useTranslations("landing.hero");

  return (
    <Box
      sx={{
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative elements */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          filter: "blur(60px)",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.08)",
          filter: "blur(80px)",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 6,
            alignItems: "center",
          }}
        >
          {/* Left: Text content */}
          <Box>
            <Typography
              variant="h2"
              fontWeight="bold"
              mb={2}
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                textShadow: "0 4px 12px rgba(0,0,0,0.2)",
              }}
            >
              {t("title")}<br />
              {t("titleLine2")}
            </Typography>
            <Typography
              variant="h5"
              mb={4}
              sx={{
                opacity: 0.95,
                fontWeight: 400,
                lineHeight: 1.6,
              }}
            >
              {t("subtitle")}<br />
              {t("subtitleLine2")}<br />
              {t("subtitleLine3")}
            </Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={4}>
              <Button
                component={Link}
                href="/signup"
                variant="contained"
                size="large"
                startIcon={<RocketLaunchIcon />}
                sx={{
                  bgcolor: "white",
                  color: "#667eea",
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 4,
                  "&:hover": {
                    bgcolor: "#f3f4f6",
                  },
                }}
              >
                {t("startFree")}
              </Button>
              <Button
                component={Link}
                href="#features"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontSize: "1.1rem",
                  py: 1.5,
                  px: 4,
                  "&:hover": {
                    borderColor: "white",
                    bgcolor: "rgba(255,255,255,0.1)",
                  },
                }}
              >
                {t("viewFeatures")}
              </Button>
            </Stack>

            <Stack direction="row" spacing={3} flexWrap="wrap">
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  ✨
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t("achievement")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  🏆
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t("levelUp")}
                </Typography>
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  📊
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t("ranking")}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Right: Screenshot placeholder */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              animation: `${float} 6s ease-in-out infinite`,
            }}
          >
            <Paper
              elevation={24}
              sx={{
                p: 2,
                borderRadius: 4,
                bgcolor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Box
                component="img"
                src="/images/dashboard-hero.png"
                alt={t("screenshotAlt")}
                sx={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                  display: "block",
                }}
              />
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
