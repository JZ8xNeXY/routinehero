-- members table (family members: parent + kids)
create table public.members (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Relations
  family_id uuid not null references public.families(id) on delete cascade,

  -- Member info
  name text not null,
  role text not null check (role in ('parent', 'child')),
  age int,
  avatar_url text,
  character_id text, -- Selected character for gamification

  -- Gamification
  total_xp int not null default 0,
  level int not null default 1,
  current_streak int not null default 0,
  longest_streak int not null default 0,

  -- Display order
  display_order int not null default 0
);

-- Enable RLS
alter table public.members enable row level security;

-- RLS Policies
create policy "Users can view members of their family"
  on public.members for select
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can insert members to their family"
  on public.members for insert
  with check (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can update members of their family"
  on public.members for update
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

create policy "Users can delete members of their family"
  on public.members for delete
  using (
    family_id in (
      select id from public.families where user_id = auth.uid()
    )
  );

-- Indexes
create index members_family_id_idx on public.members(family_id);
create index members_display_order_idx on public.members(family_id, display_order);

-- Updated at trigger
create trigger members_updated_at
  before update on public.members
  for each row
  execute function public.handle_updated_at();
