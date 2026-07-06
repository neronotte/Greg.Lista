-- ============================================================
-- List@ — initial schema
-- ============================================================

-- User profiles (extends Supabase auth.users)
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url  text,
  created_at  timestamptz not null default now()
);

-- Automatically create a profile when a user signs up
create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Categories (seed data in 002_seed.sql)
-- ============================================================
create table public.categories (
  id          serial primary key,
  name        text not null,
  sort_order  int  not null default 0
);

-- ============================================================
-- Families
-- ============================================================
create table public.families (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_by  uuid not null references public.profiles(id) on delete restrict,
  created_at  timestamptz not null default now()
);

create table public.family_members (
  family_id   uuid not null references public.families(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null default 'member' check (role in ('owner', 'member')),
  joined_at   timestamptz not null default now(),
  primary key (family_id, user_id)
);

create table public.family_invites (
  id            uuid primary key default gen_random_uuid(),
  family_id     uuid not null references public.families(id) on delete cascade,
  invited_email text not null,
  token         text not null unique default encode(gen_random_bytes(24), 'hex'),
  status        text not null default 'pending' check (status in ('pending', 'accepted', 'expired')),
  created_at    timestamptz not null default now()
);

-- ============================================================
-- Lists
-- ============================================================
create table public.lists (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  owner_id    uuid not null references public.profiles(id) on delete cascade,
  family_id   uuid references public.families(id) on delete set null,
  visibility  text not null default 'private' check (visibility in ('private', 'family')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.list_items (
  id          uuid primary key default gen_random_uuid(),
  list_id     uuid not null references public.lists(id) on delete cascade,
  name        text not null,
  category_id int references public.categories(id) on delete set null,
  quantity    text,
  unit        text,
  notes       text,
  sort_order  int not null default 0
);

-- ============================================================
-- Shopping sessions
-- ============================================================
create table public.shopping_sessions (
  id           uuid primary key default gen_random_uuid(),
  list_id      uuid not null references public.lists(id) on delete cascade,
  created_by   uuid not null references public.profiles(id) on delete restrict,
  supermarket  text,
  started_at   timestamptz not null default now(),
  completed_at timestamptz
);

create table public.session_entries (
  id            uuid primary key default gen_random_uuid(),
  session_id    uuid not null references public.shopping_sessions(id) on delete cascade,
  list_item_id  uuid not null references public.list_items(id) on delete cascade,
  checked       boolean not null default false,
  checked_at    timestamptz,
  checked_by    uuid references public.profiles(id) on delete set null
);

-- Keep lists.updated_at current
create function public.touch_list_updated_at()
returns trigger language plpgsql as $$
begin
  update public.lists set updated_at = now() where id = new.list_id;
  return new;
end;
$$;

create trigger list_items_touch_updated_at
  after insert or update or delete on public.list_items
  for each row execute procedure public.touch_list_updated_at();
