import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendFamilySummary } from '@/lib/line/client';
import { getDateInfoInTimezone } from '@/lib/utils/timezone';

/**
 * 朝のリマインダー送信（Vercel Cron）
 *
 * vercel.json に以下を追加：
 * {
 *   "crons": [{
 *     "path": "/api/cron/morning-reminder",
 *     "schedule": "0 8 * * *"
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
    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // 通知が有効な家族を取得
    const { data: lineSettings } = await supabase
      .from('line_settings')
      .select(`
        line_user_id,
        morning_reminder_time,
        family_id,
        families (
          family_name,
          timezone
        )
      `)
      .eq('notifications_enabled', true)
      .not('line_user_id', 'is', null);

    if (!lineSettings) {
      return NextResponse.json({ sent: 0 });
    }

    let sentCount = 0;

    // 各家族に通知送信
    for (const setting of lineSettings) {
      const settingData = setting as any;

      // Use family's timezone for accurate date and time calculation
      const timezone = settingData.families?.timezone || 'UTC';
      const now = new Date();

      // Get current time in family's timezone
      const timeFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const currentTime = timeFormatter.format(now);

      // 設定時刻と一致する場合のみ送信（または設定がない場合は8:00に送信）
      const reminderTime = settingData.morning_reminder_time || '08:00';
      if (currentTime !== reminderTime) {
        continue;
      }

      const { today, yesterday, todayDayOfWeek, yesterdayDayOfWeek } = getDateInfoInTimezone(timezone);

      // 今日の習慣数を取得（今日の曜日でフィルタ）
      const { data: allHabits } = await supabase
        .from('habits')
        .select('id, days_of_week, frequency')
        .eq('family_id', settingData.family_id)
        .eq('is_active', true);

      // 今日実施すべき習慣のみカウント
      const todayHabits = allHabits?.filter(habit => {
        if (habit.frequency === 'daily') return true;
        if (habit.days_of_week && habit.days_of_week.includes(todayDayOfWeek)) return true;
        return false;
      }) || [];

      const todayHabitCount = todayHabits.length;

      // メンバー情報と昨日の達成状況を取得
      const { data: members } = await supabase
        .from('members')
        .select('id, name, current_streak, level')
        .eq('family_id', settingData.family_id)
        .order('display_order');

      const memberStats = [];

      if (members) {
        for (const member of members) {
          // 昨日の習慣を取得（昨日の曜日でフィルタ）
          const { data: allMemberHabits } = await supabase
            .from('habits')
            .select('id, days_of_week, frequency')
            .eq('family_id', settingData.family_id)
            .eq('is_active', true)
            .contains('member_ids', [member.id]);

          // 昨日実施すべきだった習慣のみフィルタ
          const yesterdayHabits = allMemberHabits?.filter(habit => {
            if (habit.frequency === 'daily') return true;
            if (habit.days_of_week && habit.days_of_week.includes(yesterdayDayOfWeek)) return true;
            return false;
          }) || [];

          const totalYesterday = yesterdayHabits.length;

          // 昨日の完了数を取得
          const { data: completedLogs } = await supabase
            .from('habit_logs')
            .select('id')
            .eq('member_id', member.id)
            .gte('completed_at', yesterday)
            .lt('completed_at', today);

          const completedYesterday = completedLogs?.length || 0;

          memberStats.push({
            name: member.name,
            completedYesterday,
            totalYesterday,
            streak: member.current_streak,
            level: member.level,
          });
        }
      }

      // 家族サマリーを送信
      const success = await sendFamilySummary(
        settingData.line_user_id,
        settingData.families?.family_name || 'ファミリー',
        memberStats,
        todayHabitCount
      );

      if (success) {
        sentCount++;
      }
    }

    return NextResponse.json({ sent: sentCount });
  } catch (error) {
    console.error('Morning reminder error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
