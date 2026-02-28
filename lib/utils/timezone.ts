/**
 * Get current date in a specific timezone
 * @param timezone IANA timezone string (e.g., "Asia/Tokyo", "America/New_York")
 * @returns Date string in YYYY-MM-DD format for the given timezone
 */
export function getTodayInTimezone(timezone: string): string {
  const now = new Date();

  // Format date in the specified timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // en-CA locale returns YYYY-MM-DD format
  return formatter.format(now);
}

/**
 * Get yesterday's date in a specific timezone
 * @param timezone IANA timezone string
 * @returns Date string in YYYY-MM-DD format
 */
export function getYesterdayInTimezone(timezone: string): string {
  const now = new Date();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(yesterday);
}

/**
 * Get day of week (0-6) for a date in a specific timezone
 * @param date Date object or date string
 * @param timezone IANA timezone string
 * @returns Day of week (0=Sunday, 1=Monday, ..., 6=Saturday)
 */
export function getDayOfWeekInTimezone(date: Date | string, timezone: string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'short',
  });

  const dayName = formatter.format(dateObj);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days.indexOf(dayName);
}

/**
 * Get current date and time info for a timezone
 * @param timezone IANA timezone string
 * @returns Object with date, yesterday, dayOfWeek, yesterdayDayOfWeek
 */
export function getDateInfoInTimezone(timezone: string) {
  const today = getTodayInTimezone(timezone);
  const yesterday = getYesterdayInTimezone(timezone);

  const now = new Date();
  const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const todayDayOfWeek = getDayOfWeekInTimezone(now, timezone);
  const yesterdayDayOfWeek = getDayOfWeekInTimezone(yesterdayDate, timezone);

  return {
    today,
    yesterday,
    todayDayOfWeek,
    yesterdayDayOfWeek,
  };
}
