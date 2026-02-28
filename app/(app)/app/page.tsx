import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Container, Stack, Typography } from "@mui/material";
import type { Database } from "@/types/supabase";
import DashboardContent from "@/components/dashboard/DashboardContent";
import CelebrationEffects from "@/components/celebration/CelebrationEffects";
import DashboardNav from "@/components/dashboard/DashboardNav";
import { filterHabitsByDate } from "@/lib/utils/habitFilters";
import { getTodayInTimezone } from "@/lib/utils/timezone";

export const dynamic = "force-dynamic";

type FamilyRow = Database["public"]["Tables"]["families"]["Row"];
type MemberRow = Database["public"]["Tables"]["members"]["Row"];
type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
type HabitLogRow = Database["public"]["Tables"]["habit_logs"]["Row"];

export default async function DashboardPage() {
  const supabase = (await createClient()) as any;

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

  // Check if user has completed onboarding
  const { data: familyData, error: familyError } = await supabase
    .from("families")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (familyError) {
    redirect("/login");
  }

  const family = familyData as FamilyRow | null;

  if (!family) {
    redirect("/onboarding");
  }

  // Get family members and habits in parallel
  const [
    { data: memberData, error: membersError },
    { data: habitData, error: habitsError }
  ] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .eq("family_id", family.id)
      .order("display_order"),
    supabase
      .from("habits")
      .select("*")
      .eq("family_id", family.id)
      .eq("is_active", true)
      .order("display_order")
  ]);

  const members = (membersError ? [] : memberData || []) as MemberRow[];
  let habits = (habitsError ? [] : habitData || []) as HabitRow[];

  // Use family's timezone to get correct "today" date
  const today = getTodayInTimezone(family.timezone || 'UTC');

  // Filter habits based on today's day of week and frequency
  habits = filterHabitsByDate(habits, today);

  // Sort habits by time_of_day (habits with time first, then alphabetically)
  habits = habits.sort((a, b) => {
    // If both have time, sort by time
    if (a.time_of_day && b.time_of_day) {
      return a.time_of_day.localeCompare(b.time_of_day);
    }
    // Habits with time come first
    if (a.time_of_day && !b.time_of_day) return -1;
    if (!a.time_of_day && b.time_of_day) return 1;
    // If neither has time, maintain original order (display_order)
    return 0;
  });

  let logs: HabitLogRow[] = [];
  if (members.length > 0 && habits.length > 0) {
    const { data: logData, error: logsError } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("date", today)
      .in(
        "member_id",
        members.map((member) => member.id)
      )
      .in(
        "habit_id",
        habits.map((habit) => habit.id)
      );

    logs = (logsError ? [] : logData || []) as HabitLogRow[];
  }

  // Build a map of completed habits by habit_id (serializable for client component)
  const completedByHabit: Record<string, string[]> = {};
  for (const log of logs) {
    if (!completedByHabit[log.habit_id]) {
      completedByHabit[log.habit_id] = [];
    }
    completedByHabit[log.habit_id].push(log.member_id);
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <CelebrationEffects />

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {family.family_name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {today}
            </Typography>
          </Box>
          <DashboardNav />
        </Stack>

        <DashboardContent
          family={family}
          members={members}
          habits={habits}
          completedByHabit={completedByHabit}
          today={today}
        />
      </Box>
    </Container>
  );
}
