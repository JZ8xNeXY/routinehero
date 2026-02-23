import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface CharacterSelectProps {
  data: {
    members: Array<{
      name: string;
      age: number;
      role: "parent" | "child";
      characterId?: string;
    }>;
  };
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: any) => void;
}

const characters = [
  { id: "ninja", name: "Ninja", emoji: "🥷", description: "Stealthy and quick" },
  { id: "wizard", name: "Wizard", emoji: "🧙", description: "Magical and wise" },
  { id: "knight", name: "Knight", emoji: "🛡️", description: "Brave and strong" },
  { id: "pirate", name: "Pirate", emoji: "🏴‍☠️", description: "Adventurous and bold" },
  { id: "astronaut", name: "Astronaut", emoji: "🚀", description: "Explorer of space" },
  { id: "superhero", name: "Superhero", emoji: "🦸", description: "Saves the day" },
];

export default function CharacterSelect({
  data,
  onNext,
  onBack,
  onUpdate,
}: CharacterSelectProps) {
  // Filter only children (parents don't need characters)
  const childMembers = data.members.filter(m => m.role === "child");
  const [currentMemberIndex, setCurrentMemberIndex] = useState(0);
  const [members, setMembers] = useState(data.members);

  // If no children, skip this step
  if (childMembers.length === 0) {
    onNext();
    return null;
  }

  const currentMember = childMembers[currentMemberIndex];
  const isLastMember = currentMemberIndex === childMembers.length - 1;

  const handleSelectCharacter = (characterId: string) => {
    // Update only the current child member
    const updated = members.map((m) =>
      m.name === currentMember.name && m.role === "child"
        ? { ...m, characterId }
        : m
    );
    setMembers(updated);
    onUpdate({ members: updated });

    if (isLastMember) {
      // All children have selected characters
      setTimeout(() => onNext(), 300);
    } else {
      // Move to next child
      setCurrentMemberIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentMemberIndex > 0) {
      setCurrentMemberIndex((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Choose a Character
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        {currentMember.name}, pick your hero!
      </Typography>

      <Grid container spacing={2} mb={4}>
        {characters.map((character) => (
          <Grid item xs={6} sm={4} key={character.id}>
            <Card
              sx={{
                position: "relative",
                border: currentMember.characterId === character.id ? 2 : 0,
                borderColor: "primary.main",
              }}
            >
              <CardActionArea onClick={() => handleSelectCharacter(character.id)}>
                <CardContent sx={{ textAlign: "center", py: 3 }}>
                  {currentMember.characterId === character.id && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "primary.main",
                      }}
                    />
                  )}
                  <Typography variant="h2" mb={1}>
                    {character.emoji}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="600">
                    {character.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {character.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={handleBack} size="large">
          Back
        </Button>
        <Typography variant="body2" color="text.secondary" sx={{ flex: 1, alignSelf: "center" }}>
          {currentMemberIndex + 1} of {childMembers.length} children
        </Typography>
      </Box>
    </Box>
  );
}
