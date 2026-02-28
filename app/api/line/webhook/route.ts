import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import crypto from 'crypto';

/**
 * LINE Webhook エンドポイント
 *
 * ドキュメント: https://developers.line.biz/ja/reference/messaging-api/#webhook-event-objects
 */

interface LineWebhookEvent {
  type: string;
  timestamp: number;
  source: {
    type: 'user' | 'group' | 'room';
    userId?: string;
  };
  replyToken?: string;
  message?: {
    type: string;
    id: string;
    text?: string;
  };
}

interface LineWebhookRequest {
  destination: string;
  events: LineWebhookEvent[];
}

/**
 * LINE Webhook 署名検証
 */
function verifySignature(body: string, signature: string): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET;
  if (!channelSecret) return false;

  const hash = crypto
    .createHmac('SHA256', channelSecret)
    .update(body)
    .digest('base64');

  return hash === signature;
}

/**
 * POST /api/line/webhook
 *
 * LINEからのWebhookを受信
 */
export async function POST(request: NextRequest) {
  try {
    // 署名検証
    const signature = request.headers.get('x-line-signature');
    const body = await request.text();

    if (!signature || !verifySignature(body, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const webhookRequest: LineWebhookRequest = JSON.parse(body);
    const supabase = await createClient();

    // 各イベントを処理
    for (const event of webhookRequest.events) {
      if (event.type === 'follow') {
        // ユーザーが友だち追加した
        await handleFollow(event, supabase);
      } else if (event.type === 'unfollow') {
        // ユーザーがブロックした
        await handleUnfollow(event, supabase);
      } else if (event.type === 'message' && event.message?.type === 'text') {
        // テキストメッセージを受信（将来的に使用）
        await handleMessage(event, supabase);
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('LINE webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

/**
 * 友だち追加イベント処理
 */
async function handleFollow(event: LineWebhookEvent, supabase: any) {
  const lineUserId = event.source.userId;
  if (!lineUserId) return;

  console.log('New LINE friend:', lineUserId);

  // TODO: ユーザーに認証用のリンクを送信
  // 「RoutineHeroと連携するには、こちらのリンクをタップしてください」
  await sendReplyMessage(event.replyToken!, [
    {
      type: 'text',
      text: 'RoutineHeroへようこそ！\n\nアカウントと連携するには、アプリの設定画面から「LINE連携」を行ってください。',
    },
  ]);
}

/**
 * ブロック（友だち削除）イベント処理
 */
async function handleUnfollow(event: LineWebhookEvent, supabase: any) {
  const lineUserId = event.source.userId;
  if (!lineUserId) return;

  console.log('LINE friend removed:', lineUserId);

  // LINE設定を無効化
  await supabase
    .from('line_settings')
    .update({ notifications_enabled: false })
    .eq('line_user_id', lineUserId);
}

/**
 * メッセージ受信処理（トークン連携）
 */
async function handleMessage(event: LineWebhookEvent, supabase: any) {
  const lineUserId = event.source.userId;
  const messageText = event.message?.text;

  if (!lineUserId || !messageText) return;

  console.log('Message from:', lineUserId, 'text:', messageText);

  // Check if message is a 6-digit token
  const tokenPattern = /^\d{6}$/;
  if (!tokenPattern.test(messageText.trim())) {
    // Not a valid token format, ignore
    return;
  }

  const token = messageText.trim();

  // Look up token in database
  const { data: tokenData, error: tokenError } = await supabase
    .from('line_link_tokens')
    .select('family_id, expires_at')
    .eq('token', token)
    .single();

  if (tokenError || !tokenData) {
    // Invalid token
    await sendReplyMessage(event.replyToken!, [
      {
        type: 'text',
        text: '❌ 無効なコードです。\n\n設定画面から新しいコードを生成してください。',
      },
    ]);
    return;
  }

  // Check if token is expired
  const now = new Date();
  const expiresAt = new Date(tokenData.expires_at);

  if (now > expiresAt) {
    // Token expired
    await supabase.from('line_link_tokens').delete().eq('token', token);

    await sendReplyMessage(event.replyToken!, [
      {
        type: 'text',
        text: '❌ コードの有効期限が切れています。\n\n設定画面から新しいコードを生成してください。',
      },
    ]);
    return;
  }

  // Token is valid - link the account
  const { error: upsertError } = await supabase
    .from('line_settings')
    .upsert(
      {
        family_id: tokenData.family_id,
        line_user_id: lineUserId,
        notifications_enabled: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'family_id' }
    );

  if (upsertError) {
    console.error('Failed to link LINE account:', upsertError);
    await sendReplyMessage(event.replyToken!, [
      {
        type: 'text',
        text: '❌ 連携に失敗しました。もう一度お試しください。',
      },
    ]);
    return;
  }

  // Delete the used token
  await supabase.from('line_link_tokens').delete().eq('token', token);

  // Send success message
  await sendReplyMessage(event.replyToken!, [
    {
      type: 'text',
      text: '✅ RoutineHeroと連携しました！\n\n習慣の30分前にリマインダーが届きます。\n頑張りましょう！🌟',
    },
  ]);

  console.log('LINE account linked:', lineUserId, 'to family:', tokenData.family_id);
}

/**
 * LINE Reply API でメッセージ送信
 */
async function sendReplyMessage(replyToken: string, messages: any[]) {
  const channelAccessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!channelAccessToken) return;

  await fetch('https://api.line.me/v2/bot/message/reply', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });
}
