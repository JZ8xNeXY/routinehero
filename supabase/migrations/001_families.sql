-- families table
create table public.families (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Auth user ID (parent account)
  user_id uuid not null references auth.users(id) on delete cascade,

  -- Family info
  family_name text not null,
  plan text not null default 'free', -- free, premium
  timezone text not null default 'UTC',
  locale text not null default 'en',

  unique(user_id)
);

-- Enable RLS
alter table public.families enable row level security;

-- RLS Policies
create policy "Users can view their own family"
  on public.families for select
  using (auth.uid() = user_id);

create policy "Users can insert their own family"
  on public.families for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own family"
  on public.families for update
  using (auth.uid() = user_id);

-- Indexes
create index families_user_id_idx on public.families(user_id);

-- Updated at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger families_updated_at
  before update on public.families
  for each row
  execute function public.handle_updated_at();
