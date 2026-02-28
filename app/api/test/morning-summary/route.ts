import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendFamilySummary } from '@/lib/line/client';

/**
 * テスト用: 朝のサマリーを即座に送信
 *
 * 使い方:
 * curl http://localhost:3000/api/test/morning-summary
 */
export async function GET(request: NextRequest) {
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
        family_id,
        families (
          family_name
        )
      `)
      .eq('notifications_enabled', true)
      .not('line_user_id', 'is', null);

    if (!lineSettings || lineSettings.length === 0) {
      return NextResponse.json({
        error: 'No LINE settings found',
        message: 'LINE連携されている家族が見つかりません'
      });
    }

    const results = [];

    // 各家族に通知送信
    for (const setting of lineSettings) {
      const settingData = setting as any;

      const now = new Date();
      const today = now.toISOString().slice(0, 10);
      const yesterdayDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const yesterday = yesterdayDate.toISOString().slice(0, 10);
      const todayDayOfWeek = now.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
      const yesterdayDayOfWeek = yesterdayDate.getDay();

      console.log('Processing family:', settingData.family_id);

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

      console.log('Today habits:', todayHabitCount, 'Day of week:', todayDayOfWeek);

      // メンバー情報と昨日の達成状況を取得
      const { data: members } = await supabase
        .from('members')
        .select('id, name, current_streak, level')
        .eq('family_id', settingData.family_id)
        .order('display_order');

      console.log('Members:', members?.length);

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

          console.log(`${member.name}: ${completedYesterday}/${totalYesterday} (yesterday was day ${yesterdayDayOfWeek})`);

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

      results.push({
        family: settingData.families?.family_name,
        success,
        memberStats,
        todayHabitCount,
      });
    }

    return NextResponse.json({
      success: true,
      results,
      message: '送信完了'
    });
  } catch (error: any) {
    console.error('Test morning summary error:', error);
    return NextResponse.json({
      error: 'Internal error',
      message: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
