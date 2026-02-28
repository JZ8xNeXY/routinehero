"use client";

import { Box, Container, Typography, Grid, Paper, Stack } from "@mui/material";
import { useTranslations } from "next-intl";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import TimerIcon from "@mui/icons-material/Timer";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

export default function BenefitsSection() {
  const t = useTranslations("landing.benefits");

  const parentBenefits = [
    {
      icon: <TimerIcon sx={{ fontSize: 48 }} />,
      title: t("parent.saveTime.title"),
      description: t("parent.saveTime.description"),
      color: "#3b82f6",
    },
    {
      icon: <SentimentVerySatisfiedIcon sx={{ fontSize: 48 }} />,
      title: t("parent.reduceStress.title"),
      description: t("parent.reduceStress.description"),
      color: "#10b981",
    },
    {
      icon: <FamilyRestroomIcon sx={{ fontSize: 48 }} />,
      title: t("parent.familyHarmony.title"),
      description: t("parent.familyHarmony.description"),
      color: "#ec4899",
    },
  ];

  const childBenefits = [
    {
      icon: <SchoolIcon sx={{ fontSize: 48 }} />,
      title: t("child.learnResponsibility.title"),
      description: t("child.learnResponsibility.description"),
      color: "#8b5cf6",
    },
    {
      icon: <EmojiEventsIcon sx={{ fontSize: 48 }} />,
      title: t("child.earnRewards.title"),
      description: t("child.earnRewards.description"),
      color: "#f59e0b",
    },
    {
      icon: <SportsEsportsIcon sx={{ fontSize: 48 }} />,
      title: t("child.haveFun.title"),
      description: t("child.haveFun.description"),
      color: "#06b6d4",
    },
  ];

  return (
    <Box
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
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: "auto" }}>
            {t("subtitle")}
          </Typography>
        </Box>

        {/* Parent Benefits */}
        <Box mb={8}>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={4}
            sx={{
              textAlign: "center",
              fontSize: { xs: "1.75rem", md: "2rem" },
              color: "#667eea",
            }}
          >
            {t("parent.title")} 👨‍👩‍👧‍👦
          </Typography>
          <Grid container spacing={4}>
            {parentBenefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                      borderColor: benefit.color,
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
                        bgcolor: `${benefit.color}20`,
                        color: benefit.color,
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {benefit.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Child Benefits */}
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={4}
            sx={{
              textAlign: "center",
              fontSize: { xs: "1.75rem", md: "2rem" },
              color: "#ec4899",
            }}
          >
            {t("child.title")} 🧒
          </Typography>
          <Grid container spacing={4}>
            {childBenefits.map((benefit, index) => (
              <Grid item xs={12} md={4} key={index}>
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
                      borderColor: benefit.color,
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
                        bgcolor: `${benefit.color}20`,
                        color: benefit.color,
                      }}
                    >
                      {benefit.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {benefit.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
                      {benefit.description}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
