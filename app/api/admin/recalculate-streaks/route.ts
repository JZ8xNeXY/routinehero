import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getDateInfoInTimezone } from '@/lib/utils/timezone';

/**
 * Admin endpoint to recalculate all member streaks
 *
 * Usage:
 * curl http://localhost:3000/api/admin/recalculate-streaks?secret=YOUR_SECRET
 */
export async function GET(request: NextRequest) {
  // Simple auth check
  const secret = request.nextUrl.searchParams.get('secret');
  if (secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
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

    // Get all families with their timezone
    const { data: families } = await supabase
      .from('families')
      .select('id, timezone');

    if (!families) {
      return NextResponse.json({ error: 'No families found' });
    }

    const results = [];

    for (const family of families) {
      const timezone = family.timezone || 'UTC';
      const { today } = getDateInfoInTimezone(timezone);

      // Get all members for this family
      const { data: members } = await supabase
        .from('members')
        .select('id, name')
        .eq('family_id', family.id);

      if (!members) continue;

      for (const member of members) {
        // Get all unique dates where member completed at least one habit
        const { data: logs } = await supabase
          .from('habit_logs')
          .select('date')
          .eq('member_id', member.id)
          .order('date', { ascending: false });

        if (!logs || logs.length === 0) {
          // No logs, set streak to 0
          await supabase
            .from('members')
            .update({
              current_streak: 0,
              longest_streak: 0,
            })
            .eq('id', member.id);

          results.push({
            member: member.name,
            currentStreak: 0,
            longestStreak: 0,
          });
          continue;
        }

        // Get unique dates
        const uniqueDates = [...new Set(logs.map(log => log.date))].sort().reverse();

        // Calculate current streak
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        let expectedDate = new Date(today);

        for (let i = 0; i < uniqueDates.length; i++) {
          const logDate = uniqueDates[i];
          const logDateObj = new Date(logDate + 'T00:00:00Z');
          const expectedDateStr = expectedDate.toISOString().slice(0, 10);

          if (logDate === expectedDateStr) {
            // This date is part of the streak
            tempStreak++;
            if (i === 0) {
              // Still counting current streak
              currentStreak = tempStreak;
            }
            // Move expected date back one day
            expectedDate = new Date(expectedDate.getTime() - 24 * 60 * 60 * 1000);
          } else {
            // Gap in streak
            if (tempStreak > longestStreak) {
              longestStreak = tempStreak;
            }
            // Reset and start counting from this date
            tempStreak = 1;
            expectedDate = new Date(logDateObj.getTime() - 24 * 60 * 60 * 1000);

            // If we haven't found current streak yet (gap from today)
            if (currentStreak === 0) {
              currentStreak = 0; // Streak is broken
            }
          }
        }

        // Check final temp streak
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }

        // Update member
        await supabase
          .from('members')
          .update({
            current_streak: currentStreak,
            longest_streak: Math.max(longestStreak, currentStreak),
          })
          .eq('id', member.id);

        results.push({
          member: member.name,
          currentStreak,
          longestStreak: Math.max(longestStreak, currentStreak),
          totalDays: uniqueDates.length,
        });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      message: 'Streaks recalculated successfully',
    });
  } catch (error: any) {
    console.error('Recalculate streaks error:', error);
    return NextResponse.json({
      error: 'Internal error',
      message: error.message,
    }, { status: 500 });
  }
}
