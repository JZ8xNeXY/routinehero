"use client";

import { useState } from "react";
import { Box, Paper, Typography, IconButton, Stack, Tooltip } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Database } from "@/types/supabase";

type HabitLogRow = Database["public"]["Tables"]["habit_logs"]["Row"];

interface CalendarViewProps {
  logs: HabitLogRow[];
  memberName: string;
}

export default function CalendarView({ logs, memberName }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

  // Group logs by date
  const logsByDate: Record<string, number> = {};
  logs.forEach((log) => {
    const logDate = log.date;
    if (logDate.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`)) {
      logsByDate[logDate] = (logsByDate[logDate] || 0) + 1;
    }
  });

  // Generate calendar days
  const calendarDays: Array<{ date: number | null; logs: number }> = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarDays.push({ date: null, logs: 0 });
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    calendarDays.push({
      date: day,
      logs: logsByDate[dateStr] || 0,
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthName = currentDate.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
  });

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <Box sx={{ mb: 4 }}>
      <Paper sx={{ p: 3, border: 1, borderColor: "divider" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Typography variant="h6" fontWeight="bold">
            📅 {memberName}のカレンダー
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton onClick={handlePrevMonth} size="small">
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="subtitle1" fontWeight="600" sx={{ minWidth: 120, textAlign: "center" }}>
              {monthName}
            </Typography>
            <IconButton onClick={handleNextMonth} size="small">
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Day names */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
            mb: 1,
          }}
        >
          {dayNames.map((dayName) => (
            <Box
              key={dayName}
              sx={{
                textAlign: "center",
                py: 1,
                fontWeight: "bold",
                color: "text.secondary",
                fontSize: "0.875rem",
              }}
            >
              {dayName}
            </Box>
          ))}
        </Box>

        {/* Calendar grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: 1,
          }}
        >
          {calendarDays.map((day, index) => {
            if (day.date === null) {
              return <Box key={`empty-${index}`} />;
            }

            const today = new Date();
            const isToday =
              day.date === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();

            const isFuture =
              new Date(year, month, day.date) > today;

            const bgColor = isFuture
              ? "grey.100"
              : day.logs >= 3
              ? "#10b981"
              : day.logs >= 2
              ? "#fbbf24"
              : day.logs >= 1
              ? "#60a5fa"
              : "grey.50";

            const textColor = day.logs > 0 && !isFuture ? "white" : "text.primary";

            return (
              <Tooltip
                key={`day-${day.date}`}
                title={
                  isFuture
                    ? "未来の日付"
                    : day.logs > 0
                    ? `${day.logs}個の習慣を完了`
                    : "習慣なし"
                }
                arrow
              >
                <Box
                  sx={{
                    aspectRatio: "1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    bgcolor: bgColor,
                    color: textColor,
                    border: isToday ? 2 : 1,
                    borderColor: isToday ? "primary.main" : "divider",
                    fontWeight: isToday ? "bold" : "normal",
                    cursor: "default",
                    transition: "all 0.2s",
                    "&:hover": {
                      transform: isFuture ? "none" : "scale(1.1)",
                      zIndex: 1,
                    },
                  }}
                >
                  {day.date}
                </Box>
              </Tooltip>
            );
          })}
        </Box>

        {/* Legend */}
        <Stack direction="row" spacing={2} mt={3} justifyContent="center" flexWrap="wrap">
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 16, height: 16, bgcolor: "grey.50", borderRadius: 0.5 }} />
            <Typography variant="caption">なし</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 16, height: 16, bgcolor: "#60a5fa", borderRadius: 0.5 }} />
            <Typography variant="caption">1個</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 16, height: 16, bgcolor: "#fbbf24", borderRadius: 0.5 }} />
            <Typography variant="caption">2個</Typography>
          </Stack>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <Box sx={{ width: 16, height: 16, bgcolor: "#10b981", borderRadius: 0.5 }} />
            <Typography variant="caption">3個以上</Typography>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
