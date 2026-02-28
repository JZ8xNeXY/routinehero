"use client";

import { Box, Container, Typography, Grid, Paper, Stack, Chip } from "@mui/material";
import { useTranslations } from "next-intl";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MessageIcon from "@mui/icons-material/Message";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";

export default function LineIntegrationSection() {
  const t = useTranslations("landing.lineIntegration");

  const features = [
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 48 }} />,
      title: t("dailyReminders.title"),
      description: t("dailyReminders.description"),
      color: "#06c755",
    },
    {
      icon: <MessageIcon sx={{ fontSize: 48 }} />,
      title: t("completionMessages.title"),
      description: t("completionMessages.description"),
      color: "#3b82f6",
    },
    {
      icon: <ScheduleIcon sx={{ fontSize: 48 }} />,
      title: t("customSchedule.title"),
      description: t("customSchedule.description"),
      color: "#8b5cf6",
    },
    {
      icon: <PhoneAndroidIcon sx={{ fontSize: 48 }} />,
      title: t("parentNotifications.title"),
      description: t("parentNotifications.description"),
      color: "#ec4899",
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
          <Chip
            label={t("badge")}
            sx={{
              bgcolor: "#06c755",
              color: "white",
              fontWeight: "bold",
              fontSize: "0.9rem",
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            fontWeight="bold"
            mb={2}
            sx={{ fontSize: { xs: "2rem", md: "2.5rem" } }}
          >
            {t("title")}
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
            {t("subtitle")}<br />
            {t("subtitleLine2")}
          </Typography>
        </Box>

        <Grid container spacing={6} alignItems="center">
          {/* Left: Features list */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {features.map((feature, index) => (
                <Paper
                  key={index}
                  elevation={0}
                  sx={{
                    p: 3,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateX(8px)",
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Stack direction="row" spacing={3} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: `${feature.color}20`,
                        color: feature.color,
                        flexShrink: 0,
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" mb={1}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Grid>

          {/* Right: LINE mockup/visual */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 4,
                bgcolor: "#f9fafb",
                border: 1,
                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 3,
                  p: 3,
                  border: 1,
                  borderColor: "divider",
                }}
              >
                {/* LINE Chat mockup */}
                <Stack spacing={2}>
                  {/* LINE logo */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "#06c755",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1.5rem",
                      }}
                    >
                      L
                    </Box>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        RoutineHero
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {t("officialAccount")}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Example messages */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "#06c755",
                      color: "white",
                      borderRadius: 2,
                      maxWidth: "80%",
                    }}
                  >
                    <Typography variant="body2">
                      {t("exampleMessage1")}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "#06c755",
                      color: "white",
                      borderRadius: 2,
                      maxWidth: "80%",
                    }}
                  >
                    <Typography variant="body2">
                      {t("exampleMessage2")}
                    </Typography>
                  </Paper>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "#06c755",
                      color: "white",
                      borderRadius: 2,
                      maxWidth: "80%",
                    }}
                  >
                    <Typography variant="body2">
                      {t("exampleMessage3")}
                    </Typography>
                  </Paper>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
