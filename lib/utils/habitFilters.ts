import type { Database } from "@/types/supabase";

type HabitRow = Database["public"]["Tables"]["habits"]["Row"];

/**
 * Filters habits based on today's date and the habit's frequency settings
 *
 * Rules:
 * - Daily habits: Always shown
 * - Weekly habits: Only shown on the specified days of week
 * - Monthly habits: Always shown (no specific day-of-month filtering)
 *
 * @param habits - Array of habits to filter
 * @param today - ISO date string (YYYY-MM-DD) or Date object
 * @returns Filtered array of habits that should be shown today
 */
export function filterHabitsByDate(habits: HabitRow[], today: string | Date = new Date()): HabitRow[] {
  const date = typeof today === 'string' ? new Date(today) : today;
  const todayDayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  return habits.filter((habit) => {
    // Daily habits are always shown
    if (habit.frequency === "daily") {
      return true;
    }

    // Weekly habits are only shown on specified days
    if (habit.frequency === "weekly") {
      // If days_of_week is not set or empty, don't show the habit
      if (!habit.days_of_week || habit.days_of_week.length === 0) {
        return false;
      }
      // Check if today's day of week is in the habit's days_of_week array
      return habit.days_of_week.includes(todayDayOfWeek);
    }

    // Monthly habits are always shown (no specific day-of-month filtering implemented)
    if (habit.frequency === "monthly") {
      return true;
    }

    // Default: show the habit (fallback for unknown frequency types)
    return true;
  });
}

/**
 * Get the current day of week as a number
 * @returns Day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export function getCurrentDayOfWeek(): number {
  return new Date().getDay();
}

/**
 * Get day of week name in English
 * @param dayNumber Day of week (0-6)
 * @returns Day name (e.g., "Monday", "Tuesday")
 */
export function getDayName(dayNumber: number): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayNumber] || "Unknown";
}

/**
 * Check if a specific habit should be shown today
 * @param habit - The habit to check
 * @param today - ISO date string (YYYY-MM-DD) or Date object
 * @returns true if the habit should be shown today
 */
export function shouldShowHabitToday(habit: HabitRow, today: string | Date = new Date()): boolean {
  return filterHabitsByDate([habit], today).length > 0;
}
