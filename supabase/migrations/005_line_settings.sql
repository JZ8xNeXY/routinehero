-- line_settings table (LINE notification integration)
create table public.line_settings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Relations
  family_id uuid not null references public.families(id) on delete cascade,

  -- LINE integration
  line_user_id text unique,
  line_access_token text,

  -- Notification preferences
  notifications_enabled boolean not null default true,
  morning_reminder_time text, -- e.g., "08:00"
  evening_reminder_time text, -- e.g., "20:00"
  weekly_report_enabled boolean not null default true,
  weekly_report_day int default 0, -- 0=Sunday

  unique(family_id)
);

-- Enable RLS
alter table public.line_settings enable row level security;

-- RLS Policies
create policy "Users can view their family's LINE settings"
  on public.line_settings for select
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can insert LINE settings for their family"
  on public.line_settings for insert
  with check (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can update their family's LINE settings"
  on public.line_settings for update
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

-- Indexes
create index line_settings_family_id_idx on public.line_settings(family_id);
create index line_settings_line_user_id_idx on public.line_settings(line_user_id);

-- Updated at trigger
create trigger line_settings_updated_at
  before update on public.line_settings
  for each row
  execute function public.handle_updated_at();
