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
          {/* Video/Demo placeholder */}
          <Box
            sx={{
              position: "relative",
              paddingTop: "56.25%", // 16:9 aspect ratio
              bgcolor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Stack
              spacing={3}
              alignItems="center"
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    bgcolor: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                <PlayCircleOutlineIcon
                  sx={{
                    fontSize: 80,
                    color: "white",
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                color="white"
                sx={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                {t("watchDemo")}
              </Typography>
              <Typography
                variant="body1"
                color="white"
                sx={{
                  opacity: 0.9,
                  maxWidth: 400,
                }}
              >
                {t("demoDescription")}
              </Typography>
            </Stack>

            {/* Gradient overlay */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                opacity: 0.95,
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
