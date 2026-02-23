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

interface AddParentsProps {
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

export default function AddParents({ data, onNext, onBack, onUpdate }: AddParentsProps) {
  // Filter existing parents from data
  const existingParents = data.members.filter(m => m.role === "parent");
  const [parents, setParents] = useState(existingParents);
  const [name, setName] = useState("");

  const handleAdd = () => {
    if (name) {
      const newParent = {
        name,
        age: 0, // Age not required for parents
        role: "parent" as const,
      };
      const updatedParents = [...parents, newParent];
      setParents(updatedParents);

      // Merge parents with existing children
      const children = data.members.filter(m => m.role === "child");
      onUpdate({ members: [...updatedParents, ...children] });
      setName("");
    }
  };

  const handleRemove = (index: number) => {
    const updatedParents = parents.filter((_, i) => i !== index);
    setParents(updatedParents);

    // Merge remaining parents with existing children
    const children = data.members.filter(m => m.role === "child");
    onUpdate({ members: [...updatedParents, ...children] });
  };

  const handleContinue = () => {
    onNext();
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Add Parents
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Add yourself and your partner (at least one parent required)
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="Parent Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleAdd()}
          sx={{ flex: 1 }}
          placeholder="e.g., John, Jane"
        />
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          disabled={!name}
        >
          Add
        </Button>
      </Box>

      {parents.length > 0 && (
        <List sx={{ mb: 3 }}>
          {parents.map((parent, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={parent.name}
                secondary="Parent"
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

      {parents.length === 0 && (
        <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
          No parents added yet
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
          disabled={parents.length === 0}
        >
          Continue
        </Button>
      </Box>
    </Box>
  );
}
