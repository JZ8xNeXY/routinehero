"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Stack,
  Chip,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

const DAYS_OF_WEEK = [
  { value: 1, label: "Mon", fullLabel: "Monday" },
  { value: 2, label: "Tue", fullLabel: "Tuesday" },
  { value: 3, label: "Wed", fullLabel: "Wednesday" },
  { value: 4, label: "Thu", fullLabel: "Thursday" },
  { value: 5, label: "Fri", fullLabel: "Friday" },
  { value: 6, label: "Sat", fullLabel: "Saturday" },
  { value: 0, label: "Sun", fullLabel: "Sunday" },
];
import EditIcon from "@mui/icons-material/Edit";
import ArchiveIcon from "@mui/icons-material/Archive";
import UnarchiveIcon from "@mui/icons-material/Unarchive";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { updateHabit, deleteHabit, reactivateHabit } from "@/app/(app)/app/habits/actions";
import type { Database } from "@/types/supabase";

type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
type MemberRow = Database["public"]["Tables"]["members"]["Row"];

interface HabitListProps {
  habits: HabitRow[];
  members: MemberRow[];
  familyId: string;
}

export default function HabitList({ habits, members, familyId }: HabitListProps) {
  const [activeTab, setActiveTab] = useState<"active" | "archived">("active");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIcon, setEditIcon] = useState("");
  const [editXpReward, setEditXpReward] = useState("");
  const [editTimeOfDay, setEditTimeOfDay] = useState("");
  const [editFrequency, setEditFrequency] = useState("");
  const [editDaysOfWeek, setEditDaysOfWeek] = useState<number[]>([]);
  const [editMemberIds, setEditMemberIds] = useState<string[]>([]);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [habitToArchive, setHabitToArchive] = useState<HabitRow | null>(null);
  const [error, setError] = useState("");

  const activeHabits = habits.filter((h) => h.is_active);
  const archivedHabits = habits.filter((h) => !h.is_active);

  const displayedHabits = activeTab === "active" ? activeHabits : archivedHabits;

  const handleEditClick = (habit: HabitRow) => {
    setEditingId(habit.id);
    setEditTitle(habit.title);
    setEditIcon(habit.icon || "✅");
    setEditXpReward(habit.xp_reward.toString());
    setEditTimeOfDay(habit.time_of_day || "");
    setEditFrequency(habit.frequency);
    setEditDaysOfWeek(habit.days_of_week || []);
    setEditMemberIds(habit.member_ids);
    setError("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditIcon("");
    setEditXpReward("");
    setEditTimeOfDay("");
    setEditFrequency("");
    setEditDaysOfWeek([]);
    setEditMemberIds([]);
    setError("");
  };

  const toggleMember = (memberId: string) => {
    setEditMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const toggleDay = (day: number) => {
    setEditDaysOfWeek((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort()
    );
  };

  const handleSaveEdit = async (habit: HabitRow) => {
    setError("");

    // Validation
    if (!editTitle.trim()) {
      setError("Title is required");
      return;
    }

    if (editTitle.length > 50) {
      setError("Title must be 50 characters or less");
      return;
    }

    const xp = parseInt(editXpReward);
    if (!editXpReward || xp < 1 || xp > 100) {
      setError("XP reward must be between 1 and 100");
      return;
    }

    if (editMemberIds.length === 0) {
      setError("Please assign at least one member");
      return;
    }

    if (editFrequency === "weekly" && editDaysOfWeek.length === 0) {
      setError("Please select at least one day of the week");
      return;
    }

    const result = await updateHabit({
      habitId: habit.id,
      title: editTitle.trim(),
      icon: editIcon || "✅",
      xpReward: xp,
      timeOfDay: editTimeOfDay || null,
      frequency: editFrequency,
      daysOfWeek: editFrequency === "weekly" ? editDaysOfWeek : null,
      memberIds: editMemberIds,
    });

    if (result.error) {
      setError(result.error);
    } else {
      handleCancelEdit();
    }
  };

  const handleArchiveClick = (habit: HabitRow) => {
    setHabitToArchive(habit);
    setArchiveDialogOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (!habitToArchive) return;

    const result = await deleteHabit({
      habitId: habitToArchive.id,
      familyId,
    });

    setArchiveDialogOpen(false);
    setHabitToArchive(null);

    if (result.error) {
      setError(result.error);
    }
  };

  const handleReactivate = async (habit: HabitRow) => {
    const result = await reactivateHabit({
      habitId: habit.id,
      familyId,
    });

    if (result.error) {
      setError(result.error);
    }
  };

  const renderHabitCard = (habit: HabitRow) => {
    const isEditing = editingId === habit.id;
    const assignedMembers = members.filter((m) => habit.member_ids.includes(m.id));

    if (isEditing) {
      return (
        <Card key={habit.id} sx={{ mb: 2 }}>
          <CardContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
              <TextField
                label="Habit Title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                fullWidth
                size="small"
              />

              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Icon"
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  sx={{ width: 100 }}
                  size="small"
                />
                <TextField
                  label="XP Reward"
                  type="number"
                  value={editXpReward}
                  onChange={(e) => setEditXpReward(e.target.value)}
                  inputProps={{ min: 1, max: 100 }}
                  sx={{ width: 120 }}
                  size="small"
                />
                <FormControl sx={{ flex: 1 }} size="small">
                  <InputLabel>Frequency</InputLabel>
                  <Select
                    value={editFrequency}
                    label="Frequency"
                    onChange={(e) => {
                      setEditFrequency(e.target.value);
                      if (e.target.value !== "weekly") {
                        setEditDaysOfWeek([]);
                      }
                    }}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              {editFrequency === "weekly" && (
                <Box>
                  <Typography variant="subtitle2" mb={1}>
                    Days of week:
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                    {DAYS_OF_WEEK.map((day) => {
                      const isSelected = editDaysOfWeek.includes(day.value);
                      return (
                        <Chip
                          key={day.value}
                          label={day.label}
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
                label="Time of Day"
                type="time"
                value={editTimeOfDay}
                onChange={(e) => setEditTimeOfDay(e.target.value)}
                fullWidth
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <Box>
                <Typography variant="subtitle2" mb={1}>
                  Assign to:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {members.map((member) => {
                    const isAssigned = editMemberIds.includes(member.id);
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
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                size="small"
                startIcon={<SaveIcon />}
                onClick={() => handleSaveEdit(habit)}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                size="small"
                startIcon={<CancelIcon />}
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
            </Box>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={habit.id} sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, flexWrap: "wrap" }}>
                <Typography variant="h5">{habit.icon}</Typography>
                <Typography variant="h6" fontWeight="bold">
                  {habit.title}
                </Typography>
                {habit.frequency === "weekly" && habit.days_of_week && habit.days_of_week.length > 0 && (
                  <Chip
                    label={habit.days_of_week.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label).join(", ")}
                    size="small"
                    variant="outlined"
                  />
                )}
                {habit.time_of_day && (
                  <Chip
                    label={`⏰ ${habit.time_of_day}`}
                    size="small"
                    variant="outlined"
                  />
                )}
                <Chip label={`${habit.xp_reward} XP`} size="small" color="primary" />
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                  Assigned to:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {assignedMembers.map((member) => (
                    <Chip
                      key={member.id}
                      label={member.name}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 0.5 }}>
              {activeTab === "active" ? (
                <>
                  <IconButton size="small" onClick={() => handleEditClick(habit)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleArchiveClick(habit)}>
                    <ArchiveIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton size="small" onClick={() => handleReactivate(habit)}>
                  <UnarchiveIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Family Habits
      </Typography>

      {error && !editingId && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label={`Active (${activeHabits.length})`} value="active" />
        <Tab label={`Archived (${archivedHabits.length})`} value="archived" />
      </Tabs>

      {displayedHabits.length === 0 ? (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          {activeTab === "active"
            ? "No active habits yet. Add one above!"
            : "No archived habits"}
        </Typography>
      ) : (
        <Box>{displayedHabits.map(renderHabitCard)}</Box>
      )}

      {/* Archive Confirmation Dialog */}
      <Dialog open={archiveDialogOpen} onClose={() => setArchiveDialogOpen(false)}>
        <DialogTitle>Archive Habit?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to archive <strong>{habitToArchive?.title}</strong>?
            It will be hidden from the dashboard but you can reactivate it later.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setArchiveDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmArchive} color="warning" variant="contained">
            Archive
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
