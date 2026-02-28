"use client";

import { Box, Container, Typography, Grid, Paper, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ChecklistIcon from "@mui/icons-material/Checklist";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

export default function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");

  const steps = [
    {
      icon: <PersonAddIcon sx={{ fontSize: 48 }} />,
      title: t("step1.title"),
      description: t("step1.description"),
      color: "#3b82f6",
      step: "1",
    },
    {
      icon: <GroupAddIcon sx={{ fontSize: 48 }} />,
      title: t("step2.title"),
      description: t("step2.description"),
      color: "#8b5cf6",
      step: "2",
    },
    {
      icon: <ChecklistIcon sx={{ fontSize: 48 }} />,
      title: t("step3.title"),
      description: t("step3.description"),
      color: "#ec4899",
      step: "3",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
      title: t("step4.title"),
      description: t("step4.description"),
      color: "#10b981",
      step: "4",
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

        <Grid container spacing={4}>
          {steps.map((step, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  textAlign: "center",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    borderColor: step.color,
                  },
                }}
              >
                {/* Step number badge */}
                <Box
                  sx={{
                    position: "absolute",
                    top: -16,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    bgcolor: step.color,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {step.step}
                </Box>

                <Stack spacing={2} alignItems="center" mt={2}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${step.color}20`,
                      color: step.color,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {step.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {step.description}
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
