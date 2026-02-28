"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Chip,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createHabit } from "@/app/(app)/app/habits/actions";
import type { Database } from "@/types/supabase";
import { useTranslations } from "next-intl";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

interface HabitFormProps {
  familyId: string;
  members: MemberRow[];
}

const DAYS_OF_WEEK = [
  { value: 1, key: "monday" },
  { value: 2, key: "tuesday" },
  { value: 3, key: "wednesday" },
  { value: 4, key: "thursday" },
  { value: 5, key: "friday" },
  { value: 6, key: "saturday" },
  { value: 0, key: "sunday" },
] as const;

export default function HabitForm({ familyId, members }: HabitFormProps) {
  const t = useTranslations("habits");
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("✅");
  const [xpReward, setXpReward] = useState("10");
  const [frequency, setFrequency] = useState("daily");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.length > 50) {
      setError("Title must be 50 characters or less");
      return;
    }

    const xp = parseInt(xpReward);
    if (!xpReward || xp < 1 || xp > 100) {
      setError("XP reward must be between 1 and 100");
      return;
    }

    if (selectedMemberIds.length === 0) {
      setError("Please assign at least one member to this habit");
      return;
    }

    if (frequency === "weekly" && daysOfWeek.length === 0) {
      setError("Please select at least one day of the week");
      return;
    }

    setLoading(true);

    const result = await createHabit({
      familyId,
      title: title.trim(),
      icon: icon || "✅",
      xpReward: xp,
      frequency,
      timeOfDay: timeOfDay || null,
      daysOfWeek: frequency === "weekly" ? daysOfWeek : null,
      memberIds: selectedMemberIds,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Reset form
      setTitle("");
      setIcon("✅");
      setXpReward("10");
      setFrequency("daily");
      setTimeOfDay("");
      setDaysOfWeek([]);
      setSelectedMemberIds([]);
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {t("addHabit")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label={t("habitTitle")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          fullWidth
          placeholder={t("habitPlaceholder")}
        />

        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            label={t("icon")}
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            sx={{ width: 100 }}
            placeholder="✅"
          />

          <TextField
            label={t("xpReward")}
            type="number"
            value={xpReward}
            onChange={(e) => setXpReward(e.target.value)}
            inputProps={{ min: 1, max: 100 }}
            sx={{ width: 100 }}
          />

          <FormControl sx={{ flex: 1 }}>
            <InputLabel>{t("frequency")}</InputLabel>
            <Select
              value={frequency}
              label={t("frequency")}
              onChange={(e) => {
                setFrequency(e.target.value);
                if (e.target.value !== "weekly") {
                  setDaysOfWeek([]);
                }
              }}
            >
              <MenuItem value="daily">{t("daily")}</MenuItem>
              <MenuItem value="weekly">{t("weekly")}</MenuItem>
              <MenuItem value="monthly">{t("monthly")}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {frequency === "weekly" && (
          <Box>
            <Typography variant="subtitle2" mb={1}>
              {t("selectDaysOfWeek")}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = daysOfWeek.includes(day.value);
                return (
                  <Chip
                    key={day.value}
                    label={t(day.key)}
                    size="small"
                    onClick={() => toggleDay(day.value)}
                    color={isSelected ? "primary" : "default"}
                    variant={isSelected ? "filled" : "outlined"}
                  />
                );
              })}
            </Stack>
          </Box>
        )}

        <TextField
          label={`${t("timeOfDay")} (${t("optional")})`}
          type="time"
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value)}
          fullWidth
          helperText={t("timeExample")}
          InputLabelProps={{
            shrink: true,
          }}
        />

        <Box>
          <Typography variant="subtitle2" mb={1}>
            {t("assignedTo")}:
          </Typography>
          {members.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t("noHabits")}
            </Typography>
          ) : (
            <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
              {members.map((member) => {
                const isAssigned = selectedMemberIds.includes(member.id);
                return (
                  <Chip
                    key={member.id}
                    label={member.name}
                    size="small"
                    onClick={() => toggleMember(member.id)}
                    color={isAssigned ? "primary" : "default"}
                    variant={isAssigned ? "filled" : "outlined"}
                  />
                );
              })}
            </Stack>
          )}
        </Box>
      </Box>

      <Button
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        disabled={loading || members.length === 0}
      >
        {loading ? t("creating") : t("createHabit")}
      </Button>
    </Box>
  );
}
