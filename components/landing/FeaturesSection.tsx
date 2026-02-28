"use client";

import { Box, Container, Typography, Grid, Paper, Stack } from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InsightsIcon from "@mui/icons-material/Insights";
import { useTranslations } from "next-intl";

export default function FeaturesSection() {
  const t = useTranslations("landing.features");

  const features = [
    {
      icon: <StarsIcon sx={{ fontSize: 48 }} />,
      title: t("xpSystem.title"),
      description: t("xpSystem.description"),
      color: "#fbbf24",
    },
    {
      icon: <LocalFireDepartmentIcon sx={{ fontSize: 48 }} />,
      title: t("streak.title"),
      description: t("streak.description"),
      color: "#f97316",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
      title: t("leaderboard.title"),
      description: t("leaderboard.description"),
      color: "#8b5cf6",
    },
    {
      icon: <GroupsIcon sx={{ fontSize: 48 }} />,
      title: t("members.title"),
      description: t("members.description"),
      color: "#3b82f6",
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 48 }} />,
      title: t("reminders.title"),
      description: t("reminders.description"),
      color: "#ec4899",
    },
    {
      icon: <InsightsIcon sx={{ fontSize: 48 }} />,
      title: t("insights.title"),
      description: t("insights.description"),
      color: "#10b981",
    },
  ];

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: "#f9fafb",
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
            {t("subtitle")}<br />
            {t("subtitleLine2")}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: "100%",
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "0 12px 24px rgba(0,0,0,0.1)",
                    borderColor: feature.color,
                  },
                }}
              >
                <Stack spacing={2}>
                  <Box
                    sx={{
                      width: 72,
                      height: 72,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${feature.color}20`,
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                    {feature.description}
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
