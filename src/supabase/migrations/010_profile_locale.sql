-- Add locale column to profiles table
alter table public.profiles
  add column if not exists locale text default 'en';

-- Update existing profiles to have a default locale
update public.profiles
set locale = 'en'
where locale is null;
