"use client";

import { Paper, Stack, Typography } from "@mui/material";
import StarsIcon from "@mui/icons-material/Stars";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import GroupsIcon from "@mui/icons-material/Groups";
import { useTranslations } from "next-intl";
import type { Database } from "@/types/supabase";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

interface FamilyStatusBarProps {
  members: MemberRow[];
}

export default function FamilyStatusBar({ members }: FamilyStatusBarProps) {
  const t = useTranslations("dashboard");

  const totalXp = members.reduce((sum, member) => sum + member.total_xp, 0);
  const bestStreak = members.reduce(
    (max, member) => Math.max(max, member.current_streak),
    0
  );
  const averageLevel =
    members.length > 0
      ? (members.reduce((sum, member) => sum + member.level, 0) / members.length).toFixed(1)
      : "0.0";

  return (
    <Paper sx={{ p: 2.5, mb: 3, border: 1, borderColor: "divider" }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        useFlexGap
        justifyContent="space-between"
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <GroupsIcon color="primary" />
          <div>
            <Typography variant="caption" color="text.secondary">
              {t("membersLabel")}
            </Typography>
            <Typography variant="subtitle1" fontWeight="700">
              {members.length}
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <StarsIcon color="secondary" />
          <div>
            <Typography variant="caption" color="text.secondary">
              {t("totalXpLabel")}
            </Typography>
            <Typography variant="subtitle1" fontWeight="700">
              {totalXp}
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <LocalFireDepartmentIcon sx={{ color: "#f97316" }} />
          <div>
            <Typography variant="caption" color="text.secondary">
              {t("bestStreakLabel")}
            </Typography>
            <Typography variant="subtitle1" fontWeight="700">
              {t("daysUnit", { count: bestStreak })}
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <StarsIcon sx={{ color: "#22c55e" }} />
          <div>
            <Typography variant="caption" color="text.secondary">
              {t("avgLevelLabel")}
            </Typography>
            <Typography variant="subtitle1" fontWeight="700">
              {averageLevel}
            </Typography>
          </div>
        </Stack>
      </Stack>
    </Paper>
  );
}
