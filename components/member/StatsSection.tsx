"use client";

import { Box, Paper, Typography, Grid, Stack, Chip } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import type { Database } from "@/types/supabase";

type HabitLogRow = Database["public"]["Tables"]["habit_logs"]["Row"];

interface StatsSectionProps {
  logs: HabitLogRow[];
  totalHabits: number;
  currentStreak: number;
}

export default function StatsSection({
  logs,
  totalHabits,
  currentStreak,
}: StatsSectionProps) {
  // Calculate completion rate for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().slice(0, 10);
  }).reverse();

  const completionByDay = last7Days.map((day) => {
    const dayLogs = logs.filter((log) => log.date === day);
    return {
      date: day,
      completed: dayLogs.length,
      rate: totalHabits > 0 ? (dayLogs.length / totalHabits) * 100 : 0,
    };
  });

  const avgCompletionRate =
    completionByDay.reduce((sum, day) => sum + day.rate, 0) / 7;

  // Total habits completed (all time)
  const totalCompleted = logs.length;

  // Total XP earned
  const totalXP = logs.reduce((sum, log) => sum + (log.xp_earned || 0), 0);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        📊 統計情報
      </Typography>

      <Grid container spacing={2}>
        {/* Completion Rate */}
        <Grid item xs={6} sm={4}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              border: 1,
              borderColor: "divider",
            }}
          >
            <TrendingUpIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="primary.main">
              {avgCompletionRate.toFixed(0)}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              7日間達成率
            </Typography>
          </Paper>
        </Grid>

        {/* Total Completed */}
        <Grid item xs={6} sm={4}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              border: 1,
              borderColor: "divider",
            }}
          >
            <CalendarTodayIcon sx={{ fontSize: 32, mb: 1, color: "#10b981" }} />
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#10b981" }}>
              {totalCompleted}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              累計完了数
            </Typography>
          </Paper>
        </Grid>

        {/* Current Streak */}
        <Grid item xs={6} sm={4}>
          <Paper
            sx={{
              p: 2,
              textAlign: "center",
              border: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="h4" sx={{ mb: 1 }}>
              🔥
            </Typography>
            <Typography variant="h5" fontWeight="bold" sx={{ color: "#f97316" }}>
              {currentStreak}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              連続日数
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* 7-day trend chart */}
      <Paper sx={{ p: 3, mt: 2, border: 1, borderColor: "divider" }}>
        <Typography variant="subtitle2" fontWeight="bold" mb={2}>
          📈 直近7日間の達成状況
        </Typography>
        <Stack spacing={1}>
          {completionByDay.map((day) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString("ja-JP", { weekday: "short" });
            const dateStr = date.toLocaleDateString("ja-JP", {
              month: "numeric",
              day: "numeric",
            });

            return (
              <Box key={day.date}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={1}
                  mb={0.5}
                >
                  <Typography variant="caption" sx={{ minWidth: 60 }}>
                    {dateStr} ({dayName})
                  </Typography>
                  <Chip
                    size="small"
                    label={`${day.completed}/${totalHabits}`}
                    sx={{ minWidth: 60 }}
                  />
                </Stack>
                <Box
                  sx={{
                    width: "100%",
                    height: 8,
                    bgcolor: "grey.200",
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      width: `${day.rate}%`,
                      height: "100%",
                      bgcolor:
                        day.rate === 100
                          ? "#10b981"
                          : day.rate >= 50
                          ? "#fbbf24"
                          : "#94a3b8",
                      transition: "width 0.3s ease",
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
}
