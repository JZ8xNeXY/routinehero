import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Button, Container, Paper, Stack, Typography, Divider } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import type { Database } from "@/types/supabase";
import HabitForm from "@/components/habit/HabitForm";
import HabitList from "@/components/habit/HabitList";

export const dynamic = "force-dynamic";

type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
type MemberRow = Database["public"]["Tables"]["members"]["Row"];

export default async function HabitsPage() {
  const supabase = (await createClient()) as any;

  // Auth check
  let user: { id: string } | null = null;
  try {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    user = currentUser;
  } catch {
    redirect("/login");
  }

  if (!user) {
    redirect("/login");
  }

  // Get family
  const { data: familyData, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (familyError || !familyData) {
    redirect("/login");
  }

  // Get members (needed for assignment UI)
  const { data: memberData, error: membersError } = await supabase
    .from("members")
    .select("*")
    .eq("family_id", familyData.id)
    .order("display_order");

  const members = (membersError ? [] : memberData || []) as MemberRow[];

  // Get habits (all, regardless of is_active)
  const { data: habitData, error: habitsError } = await supabase
    .from("habits")
    .select("*")
    .eq("family_id", familyData.id)
    .order("display_order");

  const habits = (habitsError ? [] : habitData || []) as HabitRow[];

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} mb={4}>
          <Button
            component={Link}
            href="/app"
            startIcon={<ArrowBackIcon />}
            variant="outlined"
          >
            Back to Dashboard
          </Button>
        </Stack>

        <Typography variant="h4" fontWeight="bold" mb={1}>
          Manage Habits
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>
          Add, edit, or archive habits. Active habits appear on the dashboard.
        </Typography>

        <Stack spacing={4}>
          {/* Add Habit Form */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <HabitForm familyId={familyData.id} members={members} />
          </Paper>

          <Divider />

          {/* Habit List */}
          <Paper elevation={2} sx={{ p: 3 }}>
            <HabitList habits={habits} members={members} familyId={familyData.id} />
          </Paper>
        </Stack>
      </Box>
    </Container>
  );
}
