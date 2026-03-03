"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  Divider,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Link from "next/link";
import { updateMember, deleteMember } from "@/app/(app)/app/members/actions";
import { uploadMemberAvatar } from "@/lib/supabase/storage";
import type { Database } from "@/types/supabase";
import { useTranslations } from "next-intl";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];

interface MemberListProps {
  members: MemberRow[];
  familyId: string;
}

export default function MemberList({ members, familyId }: MemberListProps) {
  const tMembers = useTranslations("members");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAge, setEditAge] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<MemberRow | null>(null);
  const [error, setError] = useState("");

  const parents = members.filter((m) => m.role === "parent");
  const children = members.filter((m) => m.role === "child");

  const handleEditClick = (member: MemberRow) => {
    setEditingId(member.id);
    setEditName(member.name);
    setEditAge(member.age?.toString() || "");
    setEditAvatarUrl(member.avatar_url || "");
    setError("");
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    memberId: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    setUploadingAvatar(true);
    setError("");

    const result = await uploadMemberAvatar(file, memberId);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      setEditAvatarUrl(result.url);
    }

    setUploadingAvatar(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditAge("");
    setEditAvatarUrl("");
    setError("");
  };

  const handleSaveEdit = async (member: MemberRow) => {
    setError("");

    // Validation
    if (!editName.trim()) {
      setError("Name is required");
      return;
    }

    if (editName.length > 50) {
      setError("Name must be 50 characters or less");
      return;
    }

    if (member.role === "child") {
      const ageNum = parseInt(editAge);
      if (!editAge || ageNum < 4 || ageNum > 100) {
        setError("Age must be between 4 and 100 for children");
        return;
      }
    }

    const result = await updateMember({
      memberId: member.id,
      name: editName.trim(),
      age: member.role === "child" ? parseInt(editAge) : 0,
      characterId: null,
      avatarUrl: editAvatarUrl || null,
    });

    if (result.error) {
      setError(result.error);
    } else {
      handleCancelEdit();
    }
  };

  const handleDeleteClick = (member: MemberRow) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    const result = await deleteMember({
      memberId: memberToDelete.id,
      familyId,
    });

    setDeleteDialogOpen(false);
    setMemberToDelete(null);

    if (result.error) {
      setError(result.error);
    }
  };

  const renderMemberItem = (member: MemberRow) => {
    const isEditing = editingId === member.id;

    if (isEditing) {
      return (
        <Box sx={{ p: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
              <Avatar
                src={editAvatarUrl || undefined}
                sx={{ width: 80, height: 80 }}
              >
                {editName[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  size="small"
                  startIcon={<PhotoCameraIcon />}
                  disabled={uploadingAvatar}
                >
                  {uploadingAvatar ? tMembers("uploading") : tMembers("uploadPhoto")}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleAvatarUpload(e, member.id)}
                  />
                </Button>
                <Typography variant="caption" display="block" color="text.secondary" mt={0.5}>
                  Max 5MB, JPG/PNG
                </Typography>
              </Box>
            </Box>

            <TextField
              label="Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
              size="small"
            />

            {member.role === "child" && (
              <TextField
                label="Age"
                type="number"
                value={editAge}
                onChange={(e) => setEditAge(e.target.value)}
                fullWidth
                size="small"
                inputProps={{ min: 4, max: 100 }}
              />
            )}
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<SaveIcon />}
              onClick={() => handleSaveEdit(member)}
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
        </Box>
      );
    }

    return (
      <ListItem>
        <Avatar
          src={member.avatar_url || undefined}
          sx={{ width: 48, height: 48, mr: 2 }}
        >
          {member.name[0]?.toUpperCase()}
        </Avatar>
        <ListItemText
          primary={
            <Typography variant="body1" fontWeight="bold">
              {member.name}
            </Typography>
          }
          secondary={
            member.role === "child" && member.age
              ? `Age ${member.age}`
              : tMembers("parent")
          }
        />
        <ListItemSecondaryAction>
          <IconButton
            component={Link}
            href={`/app/members/${member.id}`}
            edge="end"
            sx={{ mr: 1 }}
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton edge="end" onClick={() => handleEditClick(member)} sx={{ mr: 1 }}>
            <EditIcon />
          </IconButton>
          <IconButton edge="end" onClick={() => handleDeleteClick(member)}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {tMembers("familyMembers")}
      </Typography>

      {error && !editingId && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {parents.length > 0 && (
        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            {tMembers("parents")}
          </Typography>
          <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
            {parents.map((parent, index) => (
              <Box key={parent.id}>
                {renderMemberItem(parent)}
                {index < parents.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Box>
      )}

      {children.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            {tMembers("children")}
          </Typography>
          <List sx={{ bgcolor: "background.paper", borderRadius: 1 }}>
            {children.map((child, index) => (
              <Box key={child.id}>
                {renderMemberItem(child)}
                {index < children.length - 1 && <Divider />}
              </Box>
            ))}
          </List>
        </Box>
      )}

      {members.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No members yet
        </Typography>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Member?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{memberToDelete?.name}</strong>?
            {memberToDelete && " This will also remove them from all habits and delete their habit logs."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
