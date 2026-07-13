-- ============================================================
-- List@ — User-configurable categories with emoji
-- ============================================================

-- Add emoji and owner_id columns
alter table public.categories
  add column emoji text not null default '📦',
  add column owner_id uuid references public.profiles(id) on delete cascade;

-- Update existing categories with default emojis
update public.categories set emoji = '🥦' where name = 'Frutta e verdura';
update public.categories set emoji = '🍞' where name = 'Pane e panificati';
update public.categories set emoji = '🥩' where name = 'Carne';
update public.categories set emoji = '🐟' where name = 'Pesce';
update public.categories set emoji = '🧀' where name = 'Salumi e formaggi';
update public.categories set emoji = '🥛' where name = 'Latticini e uova';
update public.categories set emoji = '🧊' where name = 'Surgelati';
update public.categories set emoji = '🍝' where name = 'Pasta, riso e cereali';
update public.categories set emoji = '🫙' where name = 'Conserve e sughi';
update public.categories set emoji = '🫒' where name = 'Olio, aceto e condimenti';
update public.categories set emoji = '🍪' where name = 'Biscotti e dolci';
update public.categories set emoji = '☕' where name = 'Bevande';
update public.categories set emoji = '🧴' where name = 'Igiene personale';
update public.categories set emoji = '🧹' where name = 'Pulizia casa';
update public.categories set emoji = '📦' where name = 'Varie';

-- Create index for faster lookups
create index idx_categories_owner on public.categories(owner_id);

-- Update RLS policies
drop policy if exists "Anyone can read categories" on public.categories;

-- Users can read global categories (owner_id is null) or their own
create policy "Read own or global categories"
  on public.categories for select
  using (owner_id is null or owner_id = auth.uid());

-- Users can insert their own categories
create policy "Insert own categories"
  on public.categories for insert
  with check (owner_id = auth.uid());

-- Users can update their own categories
create policy "Update own categories"
  on public.categories for update
  using (owner_id = auth.uid());

-- Users can delete their own categories
create policy "Delete own categories"
  on public.categories for delete
  using (owner_id = auth.uid());
