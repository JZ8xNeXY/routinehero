-- LINE連携用一時トークンテーブル
create table public.line_link_tokens (
  token text primary key,
  family_id uuid not null references public.families(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

-- 期限切れトークンの自動削除用インデックス
create index line_link_tokens_expires_at_idx on public.line_link_tokens(expires_at);

-- RLS無効（サーバーサイドのみで使用）
alter table public.line_link_tokens enable row level security;
