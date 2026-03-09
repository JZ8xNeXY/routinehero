"use client";

import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import type { Database } from "@/types/supabase";

type HabitLogRow = Database["public"]["Tables"]["habit_logs"]["Row"];

interface RecentActivityProps {
  logs: (HabitLogRow & {
    habits: { title: string; icon: string };
  })[];
}

const ITEMS_PER_PAGE = 5;

export default function RecentActivity({ logs }: RecentActivityProps) {
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(logs.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLogs = logs.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(totalPages - 1, prev + 1));
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h6" fontWeight="bold">
          Recent Activity
        </Typography>
        {totalPages > 1 && (
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={handlePrevPage}
              disabled={page === 0}
              size="small"
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="body2" color="text.secondary">
              {page + 1} / {totalPages}
            </Typography>
            <IconButton
              onClick={handleNextPage}
              disabled={page === totalPages - 1}
              size="small"
            >
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        )}
      </Stack>
      <Divider sx={{ mb: 2 }} />

      {logs.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No activity yet. Complete some habits to see them here!
        </Typography>
      ) : (
        <Stack spacing={2}>
          {currentLogs.map((log) => (
            <Box
              key={log.id}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 1,
                bgcolor: "grey.50",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h5">{log.habits.icon}</Typography>
                <Box>
                  <Typography variant="body1" fontWeight="600">
                    {log.habits.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(log.date).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
              <Chip label={`+${log.xp_earned} XP`} color="success" size="small" />
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
