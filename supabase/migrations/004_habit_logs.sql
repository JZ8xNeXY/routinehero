-- habit_logs table (completion records)
create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  -- Relations
  habit_id uuid not null references public.habits(id) on delete cascade,
  member_id uuid not null references public.members(id) on delete cascade,

  -- Log data
  completed_at timestamptz not null default now(),
  date date not null default current_date, -- For easy querying by date

  -- Gamification
  xp_earned int not null default 0,

  -- Optional
  note text,
  photo_url text,

  -- Prevent duplicates
  unique(habit_id, member_id, date)
);

-- Enable RLS
alter table public.habit_logs enable row level security;

-- RLS Policies
create policy "Users can view habit logs of their family members"
  on public.habit_logs for select
  using (
    member_id in (
      select m.id from public.members m
      join public.families f on m.family_id = f.id
      where f.user_id = auth.uid()
    )
  );

create policy "Users can insert habit logs for their family members"
  on public.habit_logs for insert
  with check (
    member_id in (
      select m.id from public.members m
      join public.families f on m.family_id = f.id
      where f.user_id = auth.uid()
    )
  );

create policy "Users can delete habit logs of their family members"
  on public.habit_logs for delete
  using (
    member_id in (
      select m.id from public.members m
      join public.families f on m.family_id = f.id
      where f.user_id = auth.uid()
    )
  );

-- Indexes
create index habit_logs_habit_id_idx on public.habit_logs(habit_id);
create index habit_logs_member_id_idx on public.habit_logs(member_id);
create index habit_logs_date_idx on public.habit_logs(date desc);
create index habit_logs_member_date_idx on public.habit_logs(member_id, date desc);

-- Function to update member XP and streak on habit completion
create or replace function public.update_member_stats_on_habit_log()
returns trigger as $$
declare
  v_yesterday date;
  v_has_yesterday_log boolean;
begin
  -- Update total XP
  update public.members
  set total_xp = total_xp + new.xp_earned
  where id = new.member_id;

  -- Update streak
  v_yesterday := new.date - interval '1 day';

  select exists(
    select 1 from public.habit_logs
    where member_id = new.member_id
    and date = v_yesterday
  ) into v_has_yesterday_log;

  if v_has_yesterday_log then
    -- Continue streak
    update public.members
    set
      current_streak = current_streak + 1,
      longest_streak = greatest(longest_streak, current_streak + 1)
    where id = new.member_id;
  else
    -- Start new streak
    update public.members
    set
      current_streak = 1,
      longest_streak = greatest(longest_streak, 1)
    where id = new.member_id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger update_member_stats_on_habit_log
  after insert on public.habit_logs
  for each row
  execute function public.update_member_stats_on_habit_log();
