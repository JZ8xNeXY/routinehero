-- ストリーク値を再計算して修正するSQL
-- Supabase SQL Editorで実行してください

DO $$
DECLARE
  member_record RECORD;
  log_dates TEXT[];
  current_streak_count INT;
  longest_streak_count INT;
  temp_streak INT;
  today_date TEXT;
  expected_date DATE;
  i INT;
BEGIN
  -- 各メンバーのストリークを再計算
  FOR member_record IN
    SELECT id, name, family_id
    FROM members
  LOOP
    RAISE NOTICE 'Processing member: %', member_record.name;

    -- 家族のタイムゾーンを取得（デフォルトはUTC）
    SELECT COALESCE(timezone, 'UTC') INTO today_date
    FROM families
    WHERE id = member_record.family_id;

    -- 今日の日付を取得（タイムゾーン考慮）
    today_date := TO_CHAR(NOW() AT TIME ZONE today_date, 'YYYY-MM-DD');

    -- メンバーが習慣を完了した全ての日付を取得（重複なし、降順）
    SELECT ARRAY_AGG(DISTINCT date ORDER BY date DESC)
    INTO log_dates
    FROM habit_logs
    WHERE member_id = member_record.id;

    -- ログがない場合はストリークを0にリセット
    IF log_dates IS NULL OR array_length(log_dates, 1) = 0 THEN
      UPDATE members
      SET current_streak = 0, longest_streak = 0
      WHERE id = member_record.id;

      RAISE NOTICE 'No logs found, streak reset to 0';
      CONTINUE;
    END IF;

    -- 現在のストリークを計算
    current_streak_count := 0;
    longest_streak_count := 0;
    temp_streak := 0;
    expected_date := today_date::DATE;

    -- 日付配列をループして連続日数をカウント
    FOR i IN 1..array_length(log_dates, 1) LOOP
      IF log_dates[i]::DATE = expected_date THEN
        -- この日付は連続している
        temp_streak := temp_streak + 1;

        -- 初回ループなら現在のストリークとして記録
        IF i = 1 THEN
          current_streak_count := temp_streak;
        END IF;

        -- 次に期待する日付は1日前
        expected_date := expected_date - INTERVAL '1 day';
      ELSE
        -- 連続が途切れた
        IF temp_streak > longest_streak_count THEN
          longest_streak_count := temp_streak;
        END IF;

        -- 新しいストリークを開始
        temp_streak := 1;
        expected_date := log_dates[i]::DATE - INTERVAL '1 day';

        -- まだ現在のストリークを見つけていない場合は0
        IF current_streak_count = 0 AND i > 1 THEN
          current_streak_count := 0;
        END IF;
      END IF;
    END LOOP;

    -- 最後のtemp_streakもチェック
    IF temp_streak > longest_streak_count THEN
      longest_streak_count := temp_streak;
    END IF;

    -- longestは少なくともcurrentと同じかそれ以上
    IF current_streak_count > longest_streak_count THEN
      longest_streak_count := current_streak_count;
    END IF;

    -- メンバーのストリークを更新
    UPDATE members
    SET
      current_streak = current_streak_count,
      longest_streak = longest_streak_count
    WHERE id = member_record.id;

    RAISE NOTICE 'Updated: current_streak=%, longest_streak=%',
      current_streak_count, longest_streak_count;
  END LOOP;

  RAISE NOTICE 'All member streaks have been recalculated!';
END $$;

-- 結果を確認
SELECT
  m.name,
  m.current_streak,
  m.longest_streak,
  COUNT(DISTINCT hl.date) as total_days_with_habits
FROM members m
LEFT JOIN habit_logs hl ON hl.member_id = m.id
GROUP BY m.id, m.name, m.current_streak, m.longest_streak
ORDER BY m.name;
