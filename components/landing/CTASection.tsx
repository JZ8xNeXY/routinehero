"use client";

import { Box, Container, Typography, Button, Stack } from "@mui/material";
import Link from "next/link";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useTranslations } from "next-intl";

export default function CTASection() {
  const t = useTranslations("landing.cta");

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#f9fafb",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: "center",
            p: { xs: 4, md: 6 },
            borderRadius: 4,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
          }}
        >
          <Typography
            variant="h3"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            {t("title")}<br />
            {t("titleLine2")}
          </Typography>
          <Typography
            variant="h6"
            mb={4}
            sx={{ opacity: 0.95, lineHeight: 1.6 }}
          >
            {t("subtitle")}<br />
            {t("subtitleLine2")}
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
          >
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
                fontWeight: "bold",
                "&:hover": {
                  bgcolor: "#f3f4f6",
                },
              }}
            >
              {t("startFree")}
            </Button>
            <Button
              component={Link}
              href="/login"
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
              {t("login")}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
