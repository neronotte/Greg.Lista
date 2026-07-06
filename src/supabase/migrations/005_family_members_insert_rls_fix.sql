-- ============================================================
-- Fix family_members owner insert check when creating a family
-- ============================================================

create or replace function public.is_family_creator(fid uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1
    from public.families f
    where f.id = fid and f.created_by = auth.uid()
  );
$$;

drop policy if exists "Owner can manage members" on public.family_members;
create policy "Owner can manage members"
  on public.family_members for all
  using (public.is_family_owner(family_id))
  with check (
    public.is_family_owner(family_id)
    or (
      user_id = auth.uid()
      and role = 'owner'
      and public.is_family_creator(family_id)
    )
  );
