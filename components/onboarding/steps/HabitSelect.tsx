import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Checkbox,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import { createClient } from "@/lib/supabase/client";

interface HabitSelectProps {
  data: {
    familyName: string;
    timezone: string;
    locale: string;
    members: Array<{
      name: string;
      age: number;
      role: "parent" | "child";
      characterId?: string;
    }>;
  };
  onBack: () => void;
}

const habitTemplates = [
  { id: "brush-teeth", title: "Brush Teeth", icon: "🪥", xp: 10 },
  { id: "make-bed", title: "Make Bed", icon: "🛏️", xp: 10 },
  { id: "homework", title: "Do Homework", icon: "📚", xp: 20 },
  { id: "read", title: "Read a Book", icon: "📖", xp: 15 },
  { id: "exercise", title: "Exercise", icon: "💪", xp: 20 },
  { id: "practice", title: "Practice Instrument", icon: "🎵", xp: 20 },
  { id: "tidy-room", title: "Tidy Room", icon: "🧹", xp: 15 },
  { id: "vegetables", title: "Eat Vegetables", icon: "🥗", xp: 10 },
];

export default function HabitSelect({ data, onBack }: HabitSelectProps) {
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [selectedMembersByHabit, setSelectedMembersByHabit] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleHabit = (habitId: string) => {
    setSelectedHabits((prev) => {
      if (prev.includes(habitId)) {
        // Deselecting habit - remove member assignments
        const { [habitId]: _, ...rest } = selectedMembersByHabit;
        setSelectedMembersByHabit(rest);
        return prev.filter((id) => id !== habitId);
      } else {
        // Selecting habit - assign to all members by default
        setSelectedMembersByHabit((prevMembers) => ({
          ...prevMembers,
          [habitId]: Array.from({ length: data.members.length }, (_, i) => i),
        }));
        return [...prev, habitId];
      }
    });
  };

  const toggleMemberForHabit = (habitId: string, memberIndex: number) => {
    setSelectedMembersByHabit((prev) => {
      const currentMembers = prev[habitId] || [];
      const isAssigned = currentMembers.includes(memberIndex);

      return {
        ...prev,
        [habitId]: isAssigned
          ? currentMembers.filter((i) => i !== memberIndex)
          : [...currentMembers, memberIndex],
      };
    });
  };

  const handleFinish = async () => {
    if (selectedHabits.length === 0) return;

    // Validate that each habit has at least one member assigned
    const unassignedHabits = selectedHabits.filter(
      (habitId) => !selectedMembersByHabit[habitId] || selectedMembersByHabit[habitId].length === 0
    );

    if (unassignedHabits.length > 0) {
      const habitNames = unassignedHabits
        .map((id) => habitTemplates.find((h) => h.id === id)?.title)
        .join(", ");
      alert(`Please assign at least one member to: ${habitNames}`);
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient() as any;
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("Your session has expired. Please sign in again.");
        router.replace("/login");
        return;
      }

      const { data: existingFamily, error: existingFamilyError } = await supabase
        .from("families")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existingFamilyError) throw existingFamilyError;

      if (existingFamily) {
        window.location.href = "/app";
        return;
      }

      // Create family
      const { data: family, error: familyError } = await supabase
        .from("families")
        .insert({
          user_id: user.id,
          family_name: data.familyName,
          timezone: data.timezone,
          locale: data.locale,
        })
        .select()
        .single();

      if (familyError) throw familyError;
      if (!family) throw new Error("Failed to create family");

      // Create members
      const membersToInsert = data.members.map((member, index) => ({
        family_id: family.id,
        name: member.name,
        role: member.role,
        age: member.age,
        character_id: member.characterId,
        display_order: index,
      }));

      const { data: createdMembers, error: membersError } = await supabase
        .from("members")
        .insert(membersToInsert)
        .select("id");

      if (membersError) throw membersError;
      if (!createdMembers || createdMembers.length === 0) {
        throw new Error("Failed to create members");
      }

      // Create habits with member-specific assignments
      const habitsToInsert = selectedHabits.map((habitId, index) => {
        const template = habitTemplates.find((h) => h.id === habitId)!;
        const memberIndices = selectedMembersByHabit[habitId] || [];

        // Map member indices to actual member IDs
        const assignedMemberIds = memberIndices.map(
          (idx) => (createdMembers as Array<{ id: string }>)[idx].id
        );

        return {
          family_id: family.id,
          title: template.title,
          icon: template.icon,
          xp_reward: template.xp,
          frequency: "daily",
          member_ids: assignedMemberIds,
          display_order: index,
        };
      });

      const { error: habitsError } = await supabase
        .from("habits")
        .insert(habitsToInsert);

      if (habitsError) throw habitsError;

      // Redirect to app (force full reload to ensure middleware picks up session)
      window.location.href = "/app";
    } catch (err: any) {
      console.error("Onboarding error:", err);
      alert(err.message || "Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" mb={1}>
        Choose Habits to Track
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Select daily habits for your family (you can add more later)
      </Typography>

      <Grid container spacing={2} mb={4}>
        {habitTemplates.map((habit) => {
          const isSelected = selectedHabits.includes(habit.id);
          const assignedMembers = selectedMembersByHabit[habit.id] || [];

          return (
            <Grid item xs={12} sm={6} key={habit.id}>
              <Card
                sx={{
                  position: "relative",
                  border: isSelected ? 2 : 0,
                  borderColor: "primary.main",
                }}
              >
                <CardActionArea onClick={() => toggleHabit(habit.id)}>
                  <CardContent sx={{ textAlign: "center", py: 3 }}>
                    <Checkbox
                      checked={isSelected}
                      sx={{ position: "absolute", top: 4, right: 4 }}
                    />
                    <Typography variant="h2" mb={1}>
                      {habit.icon}
                    </Typography>
                    <Typography variant="subtitle2" fontWeight="600">
                      {habit.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {habit.xp} XP
                    </Typography>
                  </CardContent>
                </CardActionArea>

                {isSelected && (
                  <Box sx={{ px: 2, pb: 2 }}>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Assign to:
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {data.members.map((member, idx) => {
                        const isAssigned = assignedMembers.includes(idx);
                        return (
                          <Chip
                            key={idx}
                            label={member.name}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleMemberForHabit(habit.id, idx);
                            }}
                            color={isAssigned ? "primary" : "default"}
                            variant={isAssigned ? "filled" : "outlined"}
                          />
                        );
                      })}
                    </Stack>
                  </Box>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button onClick={onBack} size="large" disabled={loading}>
          Back
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleFinish}
          fullWidth
          disabled={selectedHabits.length === 0 || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Setting up..." : "Finish Setup"}
        </Button>
      </Box>
    </Box>
  );
}
