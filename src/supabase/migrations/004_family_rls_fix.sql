-- ============================================================
-- Fix recursive RLS checks for families/family_members
-- ============================================================

create or replace function public.is_family_owner(fid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.family_members
    where family_id = fid and user_id = auth.uid() and role = 'owner'
  );
$$;

drop policy if exists "Owner can update family" on public.families;
create policy "Owner can update family"
  on public.families for update
  using (public.is_family_owner(id));

drop policy if exists "Owner can manage members" on public.family_members;
create policy "Owner can manage members"
  on public.family_members for all
  using (public.is_family_owner(family_id))
  with check (
    public.is_family_owner(family_id)
    or (
      user_id = auth.uid()
      and role = 'owner'
      and exists (
        select 1 from public.families f
        where f.id = family_id and f.created_by = auth.uid()
      )
    )
  );

drop policy if exists "Family owners can manage invites" on public.family_invites;
create policy "Family owners can manage invites"
  on public.family_invites for all
  using (public.is_family_owner(family_id))
  with check (public.is_family_owner(family_id));
