"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTodayInTimezone, getYesterdayInTimezone } from "@/lib/utils/timezone";

type CompleteHabitInput = {
  habitId: string;
  memberId: string;
  memberName: string;
};

// Calculate level from XP
function calculateLevel(xp: number): number {
  if (xp < 100) return 1;
  if (xp < 250) return 2;
  if (xp < 500) return 3;
  if (xp < 1000) return 4;
  if (xp < 2000) return 5;
  if (xp < 4000) return 6;
  if (xp < 8000) return 7;
  if (xp < 16000) return 8;
  return 9;
}

export async function completeHabitForMember(input: CompleteHabitInput) {
  const supabase = (await createClient()) as any;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: family } = await supabase
    .from("families")
    .select("id, timezone")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!family) {
    redirect("/onboarding");
  }

  const timezone = family.timezone || 'UTC';

  const { data: member } = await supabase
    .from("members")
    .select("id, family_id, total_xp, level, current_streak, longest_streak")
    .eq("id", input.memberId)
    .maybeSingle();

  const { data: habit } = await supabase
    .from("habits")
    .select("id, family_id, title, xp_reward")
    .eq("id", input.habitId)
    .maybeSingle();

  if (!member || !habit || member.family_id !== family.id || habit.family_id !== family.id) {
    redirect("/app?error=invalid-target");
  }

  // Use family's timezone for accurate date
  const today = getTodayInTimezone(timezone);

  const { error } = await supabase.from("habit_logs").insert({
    habit_id: habit.id,
    member_id: member.id,
    xp_earned: habit.xp_reward,
    date: today,
  });

  let xpEarned = habit.xp_reward as number;

  if (error) {
    if ((error as { code?: string }).code === "23505") {
      xpEarned = 0;
    } else {
      redirect("/app?error=save-failed");
    }
  }

  // Update member's XP, level, and streak if habit was completed
  let leveledUp = false;
  let newLevel = member.level || 1;

  if (xpEarned > 0) {
    const oldLevel = member.level || 1;
    const newTotalXp = (member.total_xp || 0) + xpEarned;
    newLevel = calculateLevel(newTotalXp);
    leveledUp = newLevel > oldLevel;

    // Calculate streak using family's timezone
    const yesterdayStr = getYesterdayInTimezone(timezone);

    // Count total habits completed today (including the one we just logged)
    const { count: todayCompletedCount } = await supabase
      .from("habit_logs")
      .select("id", { count: "exact", head: true })
      .eq("member_id", member.id)
      .eq("date", today);

    let newCurrentStreak = member.current_streak || 0;
    let newLongestStreak = member.longest_streak || 0;

    // Only update streak on the first habit completion of the day
    if (todayCompletedCount === 1) {
      // This is the first habit completed today
      // Check if member completed any habit yesterday
      const { data: yesterdayLogs } = await supabase
        .from("habit_logs")
        .select("id")
        .eq("member_id", member.id)
        .eq("date", yesterdayStr)
        .limit(1);

      if (yesterdayLogs && yesterdayLogs.length > 0) {
        // Continue streak
        newCurrentStreak += 1;
      } else if (newCurrentStreak === 0) {
        // Start new streak
        newCurrentStreak = 1;
      } else {
        // Streak broken, but this is the first habit today
        newCurrentStreak = 1;
      }

      // Update longest streak if current is higher
      if (newCurrentStreak > newLongestStreak) {
        newLongestStreak = newCurrentStreak;
      }
    }
    // If todayCompletedCount > 1, don't update streak (already updated today)

    // Update member stats
    await supabase
      .from("members")
      .update({
        total_xp: newTotalXp,
        level: newLevel,
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
      })
      .eq("id", member.id);
  }

  revalidatePath("/app");
  revalidatePath("/app/leaderboard");

  const params = new URLSearchParams({
    xp: String(xpEarned),
    member: input.memberName,
    habit: habit.title as string,
  });

  // Add level up information if applicable
  if (leveledUp) {
    params.set("levelUp", "true");
    params.set("newLevel", String(newLevel));
  }

  redirect(`/app?${params.toString()}`);
}
