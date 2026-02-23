import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

interface ParentSetupProps {
  data: {
    familyName: string;
    timezone: string;
    locale: string;
  };
  onNext: () => void;
  onUpdate: (data: any) => void;
}

const timezones = [
  "Asia/Tokyo",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "UTC",
];

export default function ParentSetup({ data, onNext, onUpdate }: ParentSetupProps) {
  const [familyName, setFamilyName] = useState(data.familyName);
  const [timezone, setTimezone] = useState(data.timezone);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ familyName, timezone });
    onNext();
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Family Information
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Tell us about your family
      </Typography>

      <TextField
        fullWidth
        label="Family Name"
        value={familyName}
        onChange={(e) => setFamilyName(e.target.value)}
        required
        margin="normal"
        placeholder="The Smith Family"
        helperText="This will be displayed on your dashboard"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Timezone</InputLabel>
        <Select
          value={timezone}
          label="Timezone"
          onChange={(e) => setTimezone(e.target.value)}
        >
          {timezones.map((tz) => (
            <MenuItem key={tz} value={tz}>
              {tz}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
