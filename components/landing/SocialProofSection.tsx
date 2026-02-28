"use client";

import { Box, Container, Typography, Grid, Paper, Stack, Rating } from "@mui/material";
import { useTranslations } from "next-intl";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

export default function SocialProofSection() {
  const t = useTranslations("landing.socialProof");

  const stats = [
    {
      icon: <CheckCircleIcon sx={{ fontSize: 40, color: "#10b981" }} />,
      value: t("stats.families"),
      label: t("stats.familiesLabel"),
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: "#3b82f6" }} />,
      value: t("stats.habits"),
      label: t("stats.habitsLabel"),
    },
    {
      icon: <LocalFireDepartmentIcon sx={{ fontSize: 40, color: "#f97316" }} />,
      value: t("stats.streak"),
      label: t("stats.streakLabel"),
    },
  ];

  const testimonials = [
    {
      quote: t("testimonial1.quote"),
      author: t("testimonial1.author"),
      rating: 5,
    },
    {
      quote: t("testimonial2.quote"),
      author: t("testimonial2.author"),
      rating: 5,
    },
    {
      quote: t("testimonial3.quote"),
      author: t("testimonial3.author"),
      rating: 5,
    },
  ];

  const trustBadges = [
    {
      icon: t("trust.secure"),
      text: t("trust.secureText"),
    },
    {
      icon: t("trust.privacy"),
      text: t("trust.privacyText"),
    },
    {
      icon: t("trust.madeInJapan"),
      text: t("trust.madeInJapanText"),
    },
  ];

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "white",
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
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
            {t("subtitle")}
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={4} mb={8}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: "center",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                <Typography variant="h3" fontWeight="bold" mb={1}>
                  {stat.value}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Testimonials */}
        <Grid container spacing={4} mb={8}>
          {testimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  bgcolor: "#f9fafb",
                }}
              >
                <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                <Typography variant="body1" mb={3} lineHeight={1.7}>
                  &ldquo;{testimonial.quote}&rdquo;
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight="600">
                  — {testimonial.author}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Trust Badges */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={4}
          justifyContent="center"
          alignItems="center"
        >
          {trustBadges.map((badge, index) => (
            <Stack key={index} direction="row" spacing={1.5} alignItems="center">
              <Typography variant="h6">{badge.icon}</Typography>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {badge.text}
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
