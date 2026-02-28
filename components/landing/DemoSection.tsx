"use client";

import { Box, Container, Typography, Paper, Stack, Button } from "@mui/material";
import { useTranslations } from "next-intl";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import Link from "next/link";

export default function DemoSection() {
  const t = useTranslations("landing.demo");

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "white",
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h3"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            {t("title")}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            {t("subtitle")}
          </Typography>
        </Box>

        <Paper
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            position: "relative",
            bgcolor: "#f3f4f6",
          }}
        >
          {/* Demo screenshot */}
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              p: 4,
            }}
          >
            <Box
              component="img"
              src="/dashboard-screenshot.png"
              alt="RoutineHero Dashboard"
              sx={{
                width: "100%",
                height: "auto",
                maxWidth: 900,
                borderRadius: 2,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              }}
              onError={(e: any) => {
                // Fallback to placeholder if image doesn't exist
                e.target.style.display = "none";
                e.target.parentElement.innerHTML = `
                  <div style="
                    width: 100%;
                    padding-top: 56.25%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 1.5rem;
                    text-align: center;
                  ">
                    <p style="position: absolute; top: 50%; transform: translateY(-50%);">
                      📊 ダッシュボード画面
                    </p>
                  </div>
                `;
              }}
            />
          </Box>
        </Paper>

        {/* Feature highlights below video */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          sx={{
            mt: 6,
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <Box>
            <Typography variant="h4" mb={1}>
              ⚡
            </Typography>
            <Typography variant="h6" fontWeight="bold" mb={0.5}>
              {t("feature1.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("feature1.description")}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" mb={1}>
              🎮
            </Typography>
            <Typography variant="h6" fontWeight="bold" mb={0.5}>
              {t("feature2.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("feature2.description")}
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" mb={1}>
              📱
            </Typography>
            <Typography variant="h6" fontWeight="bold" mb={0.5}>
              {t("feature3.title")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("feature3.description")}
            </Typography>
          </Box>
        </Stack>

        {/* CTA Button */}
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <Button
            component={Link}
            href="/signup"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#667eea",
              color: "white",
              fontSize: "1.1rem",
              py: 1.5,
              px: 5,
              "&:hover": {
                bgcolor: "#5568d3",
              },
            }}
          >
            {t("tryNow")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
