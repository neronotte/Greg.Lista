-- ============================================================
-- Add theme preference to profiles
-- ============================================================

alter table public.profiles
  add column theme text not null default 'system'
  check (theme in ('light', 'dark', 'system'));

comment on column public.profiles.theme is 'User theme preference: light, dark, or system (follows OS)';
