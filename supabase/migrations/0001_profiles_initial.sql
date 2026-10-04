-- © Janus — yashxsanjay
-- Migration: 0001_profiles_initial
-- Creates the profiles table with RLS enabled and default-deny policies.

create table if not exists public.profiles (
  id           uuid         primary key default gen_random_uuid(),
  user_id      uuid         not null references auth.users(id) on delete cascade,
  type         text         not null check (type in ('builder', 'company')),
  handle       text         not null unique,
  display_name text         not null,
  bio          text,
  links        jsonb        not null default '[]'::jsonb,
  avatar_url   text,
  created_at   timestamptz  not null default now(),
  updated_at   timestamptz  not null default now()
);

-- One profile per user
create unique index if not exists profiles_user_id_unique on public.profiles(user_id);

-- Fast lookup by handle
create index if not exists profiles_handle_idx on public.profiles(handle);

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS: enable + default deny
alter table public.profiles enable row level security;

-- Policy: anyone can read any profile (public feed)
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

-- Policy: authenticated users can insert their own profile
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Policy: users can update only their own profile
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy: users can delete their own profile (account deletion)
create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = user_id);
