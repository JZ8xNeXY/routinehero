"use client";

import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import FlagCircleIcon from "@mui/icons-material/FlagCircle";
import { useTranslations } from "next-intl";

interface NextMissionCardProps {
  remainingCount: number;
  nextMissionLabel: string | null;
}

export default function NextMissionCard({
  remainingCount,
  nextMissionLabel,
}: NextMissionCardProps) {
  const t = useTranslations("dashboard");

  return (
    <Card
      sx={{
        mb: 3,
        color: "common.white",
        background:
          "linear-gradient(135deg, rgba(99,102,241,1) 0%, rgba(37,99,235,1) 100%)",
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
          <div>
            <Typography variant="overline" sx={{ opacity: 0.9 }}>
              {t("nextMission")}
            </Typography>
            <Typography variant="h6" fontWeight="700">
              {nextMissionLabel || t("allComplete")}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {remainingCount === 0
                ? t("greatWork")
                : t("missionsRemaining", { count: remainingCount, plural: remainingCount === 1 ? "" : "s" })}
            </Typography>
          </div>
          <Chip
            icon={<FlagCircleIcon />}
            label={t("leftCount", { count: remainingCount })}
            color={remainingCount === 0 ? "success" : "secondary"}
            sx={{
              color: "common.white",
              bgcolor: remainingCount === 0 ? "success.main" : "secondary.main",
            }}
          />
        </Stack>
      </CardContent>
    </Card>
  );
}
