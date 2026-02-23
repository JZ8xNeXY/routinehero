"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  Typography,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { createHabit } from "@/app/(app)/app/habits/actions";

interface QuickHabitModalProps {
  open: boolean;
  onClose: () => void;
  familyId: string;
  memberId: string;
  memberName: string;
}

const COMMON_ICONS = [
  "✅", "📚", "🏃", "🎹", "🎨", "🧹", "🍎", "💤",
  "🦷", "🚿", "🎮", "📝", "🏋️", "🧘", "🎯", "⚽"
];

const DAYS_OF_WEEK = [
  { value: 1, label: "Mon", fullLabel: "Monday" },
  { value: 2, label: "Tue", fullLabel: "Tuesday" },
  { value: 3, label: "Wed", fullLabel: "Wednesday" },
  { value: 4, label: "Thu", fullLabel: "Thursday" },
  { value: 5, label: "Fri", fullLabel: "Friday" },
  { value: 6, label: "Sat", fullLabel: "Saturday" },
  { value: 0, label: "Sun", fullLabel: "Sunday" },
];

export default function QuickHabitModal({
  open,
  onClose,
  familyId,
  memberId,
  memberName,
}: QuickHabitModalProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("✅");
  const [xpReward, setXpReward] = useState("10");
  const [frequency, setFrequency] = useState("daily");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleDay = (day: number) => {
    setDaysOfWeek((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleCreate = async () => {
    // Client-side validation
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (title.length > 50) {
      setError("Title must be 50 characters or less");
      return;
    }

    const xp = parseInt(xpReward);
    if (isNaN(xp) || xp < 1 || xp > 100) {
      setError("XP must be between 1 and 100");
      return;
    }

    if (frequency === "weekly" && daysOfWeek.length === 0) {
      setError("Please select at least one day of the week");
      return;
    }

    setLoading(true);
    setError("");

    // Call server action
    const result = await createHabit({
      familyId,
      title: title.trim(),
      icon: icon || "✅",
      xpReward: xp,
      frequency,
      timeOfDay: timeOfDay || null,
      daysOfWeek: frequency === "weekly" ? daysOfWeek : null,
      memberIds: [memberId],
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Success: reset form and close
    setTitle("");
    setIcon("✅");
    setXpReward("10");
    setFrequency("daily");
    setDaysOfWeek([]);
    setTimeOfDay("");
    setError("");
    setLoading(false);
    onClose();

    // Refresh page to show new habit
    router.refresh();
  };

  const handleClose = () => {
    if (!loading) {
      setTitle("");
      setIcon("✅");
      setXpReward("10");
      setFrequency("daily");
      setDaysOfWeek([]);
      setTimeOfDay("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Habit for {memberName}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Error alert */}
          {error && <Alert severity="error">{error}</Alert>}

          {/* Title field */}
          <TextField
            label="Habit Title"
            required
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Practice Piano, Do Homework"
            inputProps={{ maxLength: 50 }}
            helperText={`${title.length}/50 characters`}
            disabled={loading}
          />

          {/* Icon picker */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Icon (optional)
            </Typography>
            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
              {COMMON_ICONS.map((emoji) => (
                <IconButton
                  key={emoji}
                  onClick={() => setIcon(emoji)}
                  disabled={loading}
                  sx={{
                    border: 1,
                    borderColor: icon === emoji ? "primary.main" : "divider",
                    borderWidth: icon === emoji ? 2 : 1,
                    bgcolor: icon === emoji ? "action.selected" : "transparent",
                    fontSize: "1.25rem",
                    width: 40,
                    height: 40,
                  }}
                >
                  {emoji}
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* XP Reward and Frequency */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="XP Reward"
              type="number"
              required
              value={xpReward}
              onChange={(e) => setXpReward(e.target.value)}
              inputProps={{ min: 1, max: 100 }}
              helperText="1-100 XP"
              disabled={loading}
              sx={{ flex: 1 }}
            />

            <FormControl sx={{ flex: 1 }} disabled={loading}>
              <InputLabel>Frequency</InputLabel>
              <Select
                value={frequency}
                label="Frequency"
                onChange={(e) => {
                  setFrequency(e.target.value);
                  if (e.target.value !== "weekly") {
                    setDaysOfWeek([]);
                  }
                }}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Days of Week (shown only for weekly) */}
          {frequency === "weekly" && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Select days of week:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = daysOfWeek.includes(day.value);
                  return (
                    <Chip
                      key={day.value}
                      label={day.label}
                      size="small"
                      onClick={() => toggleDay(day.value)}
                      color={isSelected ? "primary" : "default"}
                      variant={isSelected ? "filled" : "outlined"}
                      disabled={loading}
                    />
                  );
                })}
              </Stack>
            </Box>
          )}

          {/* Time of Day */}
          <TextField
            label="Time of Day (optional)"
            type="time"
            fullWidth
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            helperText="e.g., 07:00 for morning, 20:00 for evening"
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />

          {/* Info showing member assignment */}
          <Alert severity="info">
            This habit will be assigned to <strong>{memberName}</strong>.
          </Alert>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          variant="contained"
          disabled={loading || !title.trim()}
        >
          {loading ? "Creating..." : "Create Habit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
