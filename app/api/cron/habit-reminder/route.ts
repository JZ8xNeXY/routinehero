import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendHabitReminderBefore30Min } from '@/lib/line/client';

/**
 * 習慣リマインダー送信（30分前通知）
 *
 * vercel.json に以下を追加：
 * {
 *   "crons": [{
 *     "path": "/api/cron/habit-reminder",
 *     "schedule": "every 15 minutes"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  // Vercel Cron からのリクエストか検証
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    // Calculate target time (current time + 30 minutes)
    const now = new Date();
    const targetTime = new Date(now.getTime() + 30 * 60 * 1000);
    const targetTimeStr = `${targetTime.getHours().toString().padStart(2, '0')}:${targetTime.getMinutes().toString().padStart(2, '0')}`;

    // Get current day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const currentDay = now.getDay();

    console.log(`Habit reminder check - Target time: ${targetTimeStr}, Day: ${currentDay}`);

    // Get all active habits with matching time_of_day
    const { data: habits, error: habitsError } = await supabase
      .from('habits')
      .select(`
        id,
        title,
        time_of_day,
        days_of_week,
        member_ids,
        family_id,
        families!inner(
          id,
          line_settings(
            line_user_id,
            notifications_enabled
          )
        ),
        members!inner(
          id,
          name
        )
      `)
      .eq('is_active', true)
      .eq('time_of_day', targetTimeStr);

    if (habitsError) {
      console.error('Error fetching habits:', habitsError);
      return NextResponse.json({ error: habitsError.message }, { status: 500 });
    }

    if (!habits || habits.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No habits found for target time' });
    }

    let sentCount = 0;

    // Process each habit
    for (const habit of habits) {
      const habitData = habit as any;

      // Check if today is in days_of_week
      if (habitData.days_of_week && !habitData.days_of_week.includes(currentDay)) {
        continue; // Skip this habit, not scheduled for today
      }

      // Get LINE settings for this family
      const lineSettings = habitData.families?.line_settings?.[0];

      if (!lineSettings?.line_user_id || !lineSettings?.notifications_enabled) {
        continue; // No LINE linked or notifications disabled
      }

      // Get member names for this habit
      const allMembers = habitData.members || [];
      const assignedMembers = allMembers.filter((m: any) =>
        habitData.member_ids?.includes(m.id)
      );

      if (assignedMembers.length === 0) {
        continue; // No members assigned
      }

      // Send notification for each assigned member
      for (const member of assignedMembers) {
        const success = await sendHabitReminderBefore30Min(
          lineSettings.line_user_id,
          member.name,
          habitData.title,
          habitData.time_of_day || targetTimeStr
        );

        if (success) {
          sentCount++;
        }
      }
    }

    console.log(`Habit reminders sent: ${sentCount}`);

    return NextResponse.json({
      sent: sentCount,
      targetTime: targetTimeStr,
      habitsChecked: habits.length,
    });
  } catch (error) {
    console.error('Habit reminder error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
