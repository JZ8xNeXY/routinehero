-- habits table
create table public.habits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Relations
  family_id uuid not null references public.families(id) on delete cascade,

  -- Habit info
  title text not null,
  description text,
  icon text, -- emoji or icon name
  color text not null default '#6366f1',

  -- Assignment
  member_ids uuid[] not null default '{}', -- Which members should do this habit

  -- Schedule
  frequency text not null check (frequency in ('daily', 'weekly', 'custom')),
  days_of_week int[], -- 0=Sunday, 1=Monday, etc. (for weekly/custom)
  time_of_day text, -- e.g., "morning", "evening", or "HH:MM"

  -- Gamification
  xp_reward int not null default 10,

  -- Status
  is_active boolean not null default true,
  display_order int not null default 0
);

-- Enable RLS
alter table public.habits enable row level security;

-- RLS Policies
create policy "Users can view habits of their family"
  on public.habits for select
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can insert habits to their family"
  on public.habits for insert
  with check (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can update habits of their family"
  on public.habits for update
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can delete habits of their family"
  on public.habits for delete
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

-- Indexes
create index habits_family_id_idx on public.habits(family_id);
create index habits_is_active_idx on public.habits(family_id, is_active);

-- Updated at trigger
create trigger habits_updated_at
  before update on public.habits
  for each row
  execute function public.handle_updated_at();
