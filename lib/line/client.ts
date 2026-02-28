/**
 * LINE Messaging API Client
 *
 * ドキュメント: https://developers.line.biz/ja/reference/messaging-api/
 */

interface LineMessage {
  type: 'text';
  text: string;
}

interface LinePushMessageRequest {
  to: string; // LINE User ID
  messages: LineMessage[];
}

/**
 * LINE にテキストメッセージを送信
 */
export async function sendLineMessage(
  userId: string,
  text: string
): Promise<boolean> {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

  if (!channelAccessToken) {
    console.error('LINE_CHANNEL_ACCESS_TOKEN is not set');
    return false;
  }

  const body: LinePushMessageRequest = {
    to: userId,
    messages: [
      {
        type: 'text',
        text,
      },
    ],
  };

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('LINE API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send LINE message:', error);
    return false;
  }
}

/**
 * リッチメニュー付きメッセージ（今日の習慣リマインド）
 */
export async function sendHabitReminder(
  userId: string,
  memberName: string,
  habitCount: number
): Promise<boolean> {
  const message = `おはよう、${memberName}さん！\n今日の習慣は${habitCount}個あるよ。\n頑張ろう！🌟`;

  return sendLineMessage(userId, message);
}

/**
 * 習慣完了通知
 */
export async function sendHabitCompletedNotification(
  userId: string,
  memberName: string,
  habitTitle: string,
  xpGained: number
): Promise<boolean> {
  const message = `✅ ${memberName}さんが「${habitTitle}」を完了しました！\n+${xpGained} XP 獲得！⭐`;

  return sendLineMessage(userId, message);
}

/**
 * レベルアップ通知
 */
export async function sendLevelUpNotification(
  userId: string,
  memberName: string,
  newLevel: number
): Promise<boolean> {
  const message = `🎉 おめでとうございます！\n${memberName}さんがレベル${newLevel}にアップしました！\nすごい！🏆`;

  return sendLineMessage(userId, message);
}

/**
 * 習慣リマインダー（30分前通知）
 */
export async function sendHabitReminderBefore30Min(
  userId: string,
  memberName: string,
  habitTitle: string,
  habitTime: string
): Promise<boolean> {
  const message = `⏰ リマインダー\n\n${memberName}くん、30分後に「${habitTitle}」の時間です！(${habitTime})\n\n頑張ろう！🌟`;

  return sendLineMessage(userId, message);
}
