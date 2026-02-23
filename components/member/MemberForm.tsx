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
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { createMember } from "@/app/(app)/app/members/actions";

interface MemberFormProps {
  familyId: string;
}

const characters = [
  { id: "ninja", name: "Ninja", emoji: "🥷", description: "Stealthy and quick" },
  { id: "wizard", name: "Wizard", emoji: "🧙", description: "Magical and wise" },
  { id: "knight", name: "Knight", emoji: "🛡️", description: "Brave and strong" },
  { id: "pirate", name: "Pirate", emoji: "🏴‍☠️", description: "Adventurous and bold" },
  { id: "astronaut", name: "Astronaut", emoji: "🚀", description: "Explorer of space" },
  { id: "superhero", name: "Superhero", emoji: "🦸", description: "Saves the day" },
];

export default function MemberForm({ familyId }: MemberFormProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState<"parent" | "child">("parent");
  const [age, setAge] = useState("");
  const [characterId, setCharacterId] = useState("");
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

      if (!characterId) {
        setError("Please select a character for the child");
        return;
      }
    }

    setLoading(true);

    const result = await createMember({
      familyId,
      name: name.trim(),
      role,
      age: role === "child" ? parseInt(age) : 0,
      characterId: role === "child" ? characterId : null,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      // Reset form
      setName("");
      setRole("parent");
      setAge("");
      setCharacterId("");
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Add New Member
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
          placeholder="e.g., John, Jane, Alice"
        />

        <FormControl fullWidth>
          <InputLabel>Role</InputLabel>
          <Select
            value={role}
            label="Role"
            onChange={(e) => {
              setRole(e.target.value as "parent" | "child");
              setCharacterId(""); // Reset character when role changes
              setAge(""); // Reset age when role changes
            }}
          >
            <MenuItem value="parent">Parent</MenuItem>
            <MenuItem value="child">Child</MenuItem>
          </Select>
        </FormControl>

        {role === "child" && (
          <>
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              fullWidth
              inputProps={{ min: 4, max: 100 }}
            />

            <Box>
              <Typography variant="subtitle2" mb={2}>
                Select Character
              </Typography>
              <Grid container spacing={2}>
                {characters.map((character) => (
                  <Grid item xs={6} sm={4} key={character.id}>
                    <Card
                      sx={{
                        position: "relative",
                        border: characterId === character.id ? 2 : 0,
                        borderColor: "primary.main",
                      }}
                    >
                      <CardActionArea onClick={() => setCharacterId(character.id)}>
                        {characterId === character.id && (
                          <CheckCircleIcon
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              color: "primary.main",
                            }}
                          />
                        )}
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Typography variant="h2" mb={1}>
                            {character.emoji}
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {character.name}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Member"}
      </Button>
    </Box>
  );
}
