"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { updateFamilySettings } from "@/app/(app)/app/settings/actions";
import type { Database } from "@/types/supabase";

type FamilyRow = Database["public"]["Tables"]["families"]["Row"];

interface SettingsFormProps {
  family: FamilyRow;
}

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "ja", label: "日本語 (Japanese)" },
];

const COMMON_TIMEZONES = [
  { value: "Asia/Tokyo", label: "Asia/Tokyo (Japan)" },
  { value: "America/New_York", label: "America/New_York (EST)" },
  { value: "America/Los_Angeles", label: "America/Los_Angeles (PST)" },
  { value: "Europe/London", label: "Europe/London (UK)" },
  { value: "UTC", label: "UTC" },
];

export default function SettingsForm({ family }: SettingsFormProps) {
  const [familyName, setFamilyName] = useState(family.family_name);
  const [locale, setLocale] = useState(family.locale);
  const [timezone, setTimezone] = useState(family.timezone);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const result = await updateFamilySettings({
      familyId: family.id,
      familyName,
      locale,
      timezone,
    });

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }

    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Settings updated successfully!
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label="Family Name"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          required
          fullWidth
          helperText="The name displayed on your dashboard"
        />

        <FormControl fullWidth>
          <InputLabel>Language</InputLabel>
          <Select
            value={locale}
            label="Language"
            onChange={(e) => setLocale(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <MenuItem key={lang.value} value={lang.value}>
                {lang.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Timezone</InputLabel>
          <Select
            value={timezone}
            label="Timezone"
            onChange={(e) => setTimezone(e.target.value)}
          >
            {COMMON_TIMEZONES.map((tz) => (
              <MenuItem key={tz.value} value={tz.value}>
                {tz.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Button
        type="submit"
        variant="contained"
        startIcon={<SaveIcon />}
        fullWidth
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </Box>
  );
}
