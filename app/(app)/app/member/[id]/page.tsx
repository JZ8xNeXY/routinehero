import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Box, Container } from "@mui/material";
import type { Database } from "@/types/supabase";
import CelebrationEffects from "@/components/celebration/CelebrationEffects";
import MemberPageContent from "@/components/member/MemberPageContent";
import { filterHabitsByDate } from "@/lib/utils/habitFilters";

export const dynamic = "force-dynamic";

type MemberRow = Database["public"]["Tables"]["members"]["Row"];
type HabitRow = Database["public"]["Tables"]["habits"]["Row"];
type HabitLogRow = Database["public"]["Tables"]["habit_logs"]["Row"];

interface MemberPageProps {
  params: Promise<{ id: string }>;
}

export default async function MemberPage({ params }: MemberPageProps) {
  const { id: memberId } = await params;
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
    redirect("/app");
  }

  const family = familyData;

  // Get all data in parallel
  const [
    { data: allMembersData },
    { data: memberData, error: memberError },
    { data: habitData, error: habitsError }
  ] = await Promise.all([
    supabase
      .from("members")
      .select("*")
      .eq("family_id", family.id)
      .order("display_order"),
    supabase
      .from("members")
      .select("*")
      .eq("id", memberId)
      .maybeSingle(),
    supabase
      .from("habits")
      .select("*")
      .eq("family_id", family.id)
      .eq("is_active", true)
      .order("display_order")
  ]);

  const allMembers = (allMembersData || []) as MemberRow[];
  const member = memberData as MemberRow | null;

  if (memberError || !member || member.family_id !== family.id) {
    redirect("/app");
  }

  let habits = (habitsError ? [] : habitData || []) as HabitRow[];

  // Get today's date (used for filtering and logs)
  const today = new Date().toISOString().slice(0, 10);

  // Filter habits that include this member
  habits = habits.filter((habit) => habit.member_ids.includes(member.id));

  // Filter habits based on today's day of week and frequency
  habits = filterHabitsByDate(habits, today);

  // Sort habits by time_of_day
  habits = habits.sort((a, b) => {
    if (a.time_of_day && b.time_of_day) {
      return a.time_of_day.localeCompare(b.time_of_day);
    }
    if (a.time_of_day && !b.time_of_day) return -1;
    if (!a.time_of_day && b.time_of_day) return 1;
    return 0;
  });

  // Get today's habit logs for this member
  const { data: logData, error: logsError } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("date", today)
    .eq("member_id", member.id);

  const logs = (logsError ? [] : logData || []) as HabitLogRow[];

  // Get all habit logs for stats and calendar (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const ninetyDaysAgoStr = ninetyDaysAgo.toISOString().slice(0, 10);

  const { data: allLogsData } = await supabase
    .from("habit_logs")
    .select("*")
    .eq("member_id", member.id)
    .gte("date", ninetyDaysAgoStr)
    .order("date", { ascending: false });

  const allLogs = (allLogsData || []) as HabitLogRow[];

  // Build completed habit IDs array
  const completedHabitIds = logs.map((log) => log.habit_id);

  // Calculate today's completion stats
  const completedToday = logs.length;
  const totalHabitsToday = habits.length;
  const completionPercentage =
    totalHabitsToday > 0 ? (completedToday / totalHabitsToday) * 100 : 0;

  // Calculate XP progress to next level
  const xpForNextLevel = member.level * 100;
  const xpProgress = xpForNextLevel > 0 ? (member.total_xp / xpForNextLevel) * 100 : 0;

  // Build completedByHabit map for HabitCard
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
        <MemberPageContent
          member={member}
          habits={habits}
          completedByHabit={completedByHabit}
          familyId={family.id}
          completedToday={completedToday}
          totalHabitsToday={totalHabitsToday}
          completionPercentage={completionPercentage}
          xpForNextLevel={xpForNextLevel}
          xpProgress={xpProgress}
          allMembers={allMembers}
          allLogs={allLogs}
        />
      </Box>
    </Container>
  );
}
