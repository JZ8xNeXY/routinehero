"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { createMember } from "@/app/(app)/app/members/actions";
import { useTranslations } from "next-intl";

interface MemberFormProps {
  familyId: string;
}

export default function MemberForm({ familyId }: MemberFormProps) {
  const t = useTranslations("members");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"parent" | "child">("parent");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (name.length > 50) {
      setError("Name must be 50 characters or less");
      return;
    }

    if (role === "child") {
      const ageNum = parseInt(age);
      if (!age || ageNum < 4 || ageNum > 100) {
        setError("Age must be between 4 and 100 for children");
        return;
      }
    }

    setLoading(true);

    const result = await createMember({
      familyId,
      name: name.trim(),
      role,
      age: role === "child" ? parseInt(age) : 0,
      characterId: null,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Reset form
      setName("");
      setRole("parent");
      setAge("");
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {t("addMember")}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label={t("memberName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          placeholder="e.g., John, Jane, Alice"
        />

        <FormControl fullWidth>
          <InputLabel>{t("role")}</InputLabel>
          <Select
            value={role}
            label={t("role")}
            onChange={(e) => {
              setRole(e.target.value as "parent" | "child");
              setAge(""); // Reset age when role changes
            }}
          >
            <MenuItem value="parent">{t("parent")}</MenuItem>
            <MenuItem value="child">{t("child")}</MenuItem>
          </Select>
        </FormControl>

        {role === "child" && (
          <TextField
            label="Age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            fullWidth
            inputProps={{ min: 4, max: 100 }}
          />
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        disabled={loading}
      >
        {loading ? t("adding") : t("addMember")}
      </Button>
    </Box>
  );
}
