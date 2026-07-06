-- ============================================================
-- Invite by email reliability fixes
-- ============================================================

alter table public.profiles
  add column if not exists email text;

update public.profiles p
set email = lower(u.email)
from auth.users u
where u.id = p.id
  and (p.email is null or p.email = '');

create unique index if not exists profiles_email_lower_uq
  on public.profiles (lower(email))
  where email is not null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

create or replace function public.resolve_profile_id_by_email(p_email text)
returns uuid language plpgsql security definer set search_path = public, auth as $$
declare
  v_user_id uuid;
  v_email text;
  v_name text;
  v_avatar text;
begin
  select u.id,
         lower(u.email),
         coalesce(u.raw_user_meta_data->>'full_name', u.email),
         u.raw_user_meta_data->>'avatar_url'
    into v_user_id, v_email, v_name, v_avatar
  from auth.users u
  where lower(u.email) = lower(trim(p_email))
  limit 1;

  if v_user_id is null then
    return null;
  end if;

  insert into public.profiles (id, email, display_name, avatar_url)
  values (v_user_id, v_email, v_name, v_avatar)
  on conflict (id) do update
    set email = excluded.email,
        display_name = coalesce(public.profiles.display_name, excluded.display_name),
        avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

  return v_user_id;
end;
$$;

drop policy if exists "Invited user can read their own invite by token" on public.family_invites;
create policy "Invited user can read their own invite by token"
  on public.family_invites for select
  using (
    lower(invited_email) = lower((select email from auth.users where id = auth.uid()))
  );
