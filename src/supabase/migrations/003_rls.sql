-- ============================================================
-- List@ — Row Level Security policies
-- ============================================================

alter table public.profiles         enable row level security;
alter table public.categories       enable row level security;
alter table public.families         enable row level security;
alter table public.family_members   enable row level security;
alter table public.family_invites   enable row level security;
alter table public.lists            enable row level security;
alter table public.list_items       enable row level security;
alter table public.shopping_sessions enable row level security;
alter table public.session_entries  enable row level security;

-- Helper: is the current user a member of a given family?
create function public.is_family_member(fid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.family_members
    where family_id = fid and user_id = auth.uid()
  );
$$;

-- ---- profiles -----------------------------------------------
create policy "Users can read any profile"
  on public.profiles for select using (true);

create policy "Users can update their own profile"
  on public.profiles for update using (auth.uid() = id);

-- ---- categories (read-only for everyone) --------------------
create policy "Anyone can read categories"
  on public.categories for select using (true);

-- ---- families -----------------------------------------------
create policy "Members can see their families"
  on public.families for select
  using (public.is_family_member(id));

create policy "Authenticated users can create families"
  on public.families for insert
  with check (auth.uid() = created_by);

create policy "Owner can update family"
  on public.families for update
  using (exists (
    select 1 from public.family_members
    where family_id = id and user_id = auth.uid() and role = 'owner'
  ));

-- ---- family_members -----------------------------------------
create policy "Members can see members of their families"
  on public.family_members for select
  using (public.is_family_member(family_id));

create policy "Owner can manage members"
  on public.family_members for all
  using (exists (
    select 1 from public.family_members fm
    where fm.family_id = family_id and fm.user_id = auth.uid() and fm.role = 'owner'
  ));

create policy "Users can leave a family (delete own row)"
  on public.family_members for delete
  using (user_id = auth.uid());

-- ---- family_invites -----------------------------------------
create policy "Family owners can manage invites"
  on public.family_invites for all
  using (exists (
    select 1 from public.family_members
    where family_id = family_invites.family_id
      and user_id = auth.uid()
      and role = 'owner'
  ));

create policy "Invited user can read their own invite by token"
  on public.family_invites for select
  using (
    invited_email = (select email from auth.users where id = auth.uid())
  );

-- ---- lists --------------------------------------------------
create policy "Owner can manage their own lists"
  on public.lists for all
  using (auth.uid() = owner_id);

create policy "Family members can read family lists"
  on public.lists for select
  using (
    visibility = 'family'
    and family_id is not null
    and public.is_family_member(family_id)
  );

create policy "Family members can update family lists"
  on public.lists for update
  using (
    visibility = 'family'
    and family_id is not null
    and public.is_family_member(family_id)
  );

-- ---- list_items ---------------------------------------------
create policy "Can manage items of accessible lists"
  on public.list_items for all
  using (exists (
    select 1 from public.lists l
    where l.id = list_id
      and (
        l.owner_id = auth.uid()
        or (l.visibility = 'family' and l.family_id is not null and public.is_family_member(l.family_id))
      )
  ));

-- ---- shopping_sessions --------------------------------------
create policy "Can manage sessions of accessible lists"
  on public.shopping_sessions for all
  using (exists (
    select 1 from public.lists l
    where l.id = list_id
      and (
        l.owner_id = auth.uid()
        or (l.visibility = 'family' and l.family_id is not null and public.is_family_member(l.family_id))
      )
  ));

-- ---- session_entries ----------------------------------------
create policy "Can manage entries of accessible sessions"
  on public.session_entries for all
  using (exists (
    select 1 from public.shopping_sessions ss
    join public.lists l on l.id = ss.list_id
    where ss.id = session_id
      and (
        l.owner_id = auth.uid()
        or (l.visibility = 'family' and l.family_id is not null and public.is_family_member(l.family_id))
      )
  ));
