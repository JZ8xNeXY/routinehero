"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Paper,
  Stack,
  LinearProgress,
  Button,
  Fab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarsIcon from "@mui/icons-material/Stars";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import HabitCard from "@/components/habit/HabitCard";
import QuickHabitModal from "@/components/habit/QuickHabitModal";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];
type HabitRow = Database["public"]["Tables"]["habits"]["Row"];

interface MemberPageContentProps {
  member: MemberRow;
  habits: HabitRow[];
  completedByHabit: Record<string, string[]>;
  familyId: string;
  completedToday: number;
  totalHabitsToday: number;
  completionPercentage: number;
  xpForNextLevel: number;
  xpProgress: number;
}

export default function MemberPageContent({
  member,
  habits,
  completedByHabit,
  familyId,
  completedToday,
  totalHabitsToday,
  xpForNextLevel,
  xpProgress,
}: MemberPageContentProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      {/* Back button */}
      <Link href="/app" style={{ textDecoration: "none" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3 }}
          color="inherit"
        >
          Back to Dashboard
        </Button>
      </Link>

      {/* Member header */}
      <Paper sx={{ p: 3, mb: 3, border: 1, borderColor: "divider" }}>
        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Avatar
            src={member.avatar_url || undefined}
            sx={{ width: 80, height: 80, fontSize: "2rem" }}
          >
            {member.name[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
              <Typography variant="h4" fontWeight="bold">
                {member.name}
              </Typography>
              <Chip
                label={`Level ${member.level}`}
                color="primary"
                size="small"
              />
              {member.role === "parent" && (
                <Chip
                  label="Parent"
                  color="secondary"
                  size="small"
                  variant="outlined"
                />
              )}
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {member.total_xp} / {xpForNextLevel} XP to Level {member.level + 1}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(xpProgress, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                bgcolor: "grey.200",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 4,
                },
              }}
            />
          </Box>
        </Stack>

        {/* Stats grid */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          useFlexGap
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <StarsIcon color="secondary" />
            <div>
              <Typography variant="caption" color="text.secondary">
                Total XP
              </Typography>
              <Typography variant="subtitle1" fontWeight="700">
                {member.total_xp}
              </Typography>
            </div>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <LocalFireDepartmentIcon sx={{ color: "#f97316" }} />
            <div>
              <Typography variant="caption" color="text.secondary">
                Current Streak
              </Typography>
              <Typography variant="subtitle1" fontWeight="700">
                {member.current_streak} days
              </Typography>
            </div>
          </Stack>

          <Stack direction="row" spacing={1.5} alignItems="center">
            <CheckCircleIcon sx={{ color: "#22c55e" }} />
            <div>
              <Typography variant="caption" color="text.secondary">
                Habits Today
              </Typography>
              <Typography variant="subtitle1" fontWeight="700">
                {completedToday} / {totalHabitsToday} completed
              </Typography>
            </div>
          </Stack>
        </Stack>
      </Paper>

      {/* Habits section */}
      <Typography variant="h6" mb={2}>
        Today&apos;s Habits ({habits.length})
      </Typography>

      {habits.length === 0 ? (
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
            border: 1,
            borderColor: "divider",
            borderStyle: "dashed",
          }}
        >
          <Typography variant="body2" color="text.secondary" mb={2}>
            No habits assigned yet. Click the + button below to create a habit for {member.name}.
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              members={[member]}
              completedMemberIds={completedByHabit[habit.id] || []}
            />
          ))}
        </Box>
      )}

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="add habit"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
        }}
        onClick={() => setModalOpen(true)}
      >
        <AddIcon />
      </Fab>

      {/* Habit creation modal */}
      <QuickHabitModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        familyId={familyId}
        memberId={member.id}
        memberName={member.name}
      />
    </>
  );
}
