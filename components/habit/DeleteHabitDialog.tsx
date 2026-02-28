"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import { deleteHabit } from "@/app/(app)/app/habits/actions";

interface DeleteHabitDialogProps {
  open: boolean;
  onClose: () => void;
  habitId: string;
  habitTitle: string;
  familyId: string;
}

export default function DeleteHabitDialog({
  open,
  onClose,
  habitId,
  habitTitle,
  familyId,
}: DeleteHabitDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    const result = await deleteHabit({
      habitId,
      familyId,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Success
    setLoading(false);
    onClose();

    // Refresh page to remove deleted habit
    router.refresh();
  };

  const handleClose = () => {
    if (!loading) {
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <WarningIcon color="error" />
        Delete Habit
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography variant="body1" mb={2}>
          Are you sure you want to delete this habit?
        </Typography>
        <Typography
          variant="body2"
          sx={{
            p: 2,
            borderRadius: 1,
            bgcolor: "grey.100",
            fontWeight: 600,
          }}
        >
          {habitTitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          This action will deactivate the habit. Past completion data will be
          preserved, but the habit will no longer appear in your daily list.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleDelete}
          variant="contained"
          color="error"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Habit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
