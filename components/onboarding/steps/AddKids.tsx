import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

interface AddKidsProps {
  data: {
    members: Array<{
      name: string;
      age: number;
      role: "parent" | "child";
    }>;
  };
  onNext: () => void;
  onBack: () => void;
  onUpdate: (data: any) => void;
}

export default function AddKids({ data, onNext, onBack, onUpdate }: AddKidsProps) {
  // Filter existing children from data
  const existingChildren = data.members.filter(m => m.role === "child");
  const [members, setMembers] = useState(existingChildren);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleAdd = () => {
    if (name && age) {
      const newMember = {
        name,
        age: parseInt(age),
        role: "child" as const,
      };
      const updated = [...members, newMember];
      setMembers(updated);

      // Merge children with existing parents
      const parents = data.members.filter(m => m.role === "parent");
      onUpdate({ members: [...parents, ...updated] });
      setName("");
      setAge("");
    }
  };

  const handleRemove = (index: number) => {
    const updated = members.filter((_, i) => i !== index);
    setMembers(updated);

    // Merge remaining children with existing parents
    const parents = data.members.filter(m => m.role === "parent");
    onUpdate({ members: [...parents, ...updated] });
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Add Children
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Add your children who will track their habits (optional - you can skip if it&apos;s just parents)
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Child's Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          sx={{ width: 100 }}
        />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={!name || !age}
        >
          Add
        </Button>
      </Box>

      {members.length > 0 && (
        <List sx={{ mb: 3 }}>
          {members.map((member, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={member.name}
                secondary={`Age ${member.age}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" onClick={() => handleRemove(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      {members.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No children added yet
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
        <Button onClick={onBack} size="large">
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          fullWidth
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
