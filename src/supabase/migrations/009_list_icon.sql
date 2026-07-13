-- Add icon (emoji) column to lists table
alter table public.lists
  add column icon text;

-- Set default icons for existing lists based on name patterns
update public.lists
set icon = case
  when lower(name) like '%bbq%' or lower(name) like '%grill%' then '🔥'
  when lower(name) like '%fruit%' or lower(name) like '%apple%' or lower(name) like '%snack%' then '🍎'
  when lower(name) like '%office%' then '🧑‍💻'
  when lower(name) like '%weekly%' or lower(name) like '%spesa%' or lower(name) like '%groc%' then '🛒'
  when lower(name) like '%party%' or lower(name) like '%festa%' then '🎉'
  else '🧺'
end
where icon is null;
