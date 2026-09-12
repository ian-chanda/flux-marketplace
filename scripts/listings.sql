-- ============================================================
-- Flux - Listings backend
-- Run this in Supabase Dashboard > SQL Editor
-- It is safe to run more than once.
-- ============================================================

-- 1) listings table
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  title text not null,
  description text not null,
  price numeric(10, 2) not null check (price >= 0),
  category text not null,
  condition text,
  images text[] not null default '{}',
  attributes jsonb not null default '{}'::jsonb,
  location text,
  delivery_available boolean not null default false,
  pickup_available boolean not null default false,
  is_available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists listings_user_id_idx on public.listings (user_id);
create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_created_at_idx on public.listings (created_at desc);

-- 2) Row Level Security
alter table public.listings enable row level security;

drop policy if exists "Anyone can view listings" on public.listings;
create policy "Anyone can view listings"
  on public.listings for select using (true);

drop policy if exists "Users can insert their own listings" on public.listings;
create policy "Users can insert their own listings"
  on public.listings for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update their own listings" on public.listings;
create policy "Users can update their own listings"
  on public.listings for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own listings" on public.listings;
create policy "Users can delete their own listings"
  on public.listings for delete using (auth.uid() = user_id);

-- 3) Storage bucket for listing photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listings',
  'listings',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read listing images" on storage.objects;
create policy "Public read listing images"
  on storage.objects for select using (bucket_id = 'listings');

drop policy if exists "Authenticated users can upload listing images" on storage.objects;
create policy "Authenticated users can upload listing images"
  on storage.objects for insert with check (bucket_id = 'listings' and auth.role() = 'authenticated');

drop policy if exists "Users can update their listing images" on storage.objects;
create policy "Users can update their listing images"
  on storage.objects for update using (bucket_id = 'listings' and auth.uid() = owner);

drop policy if exists "Users can delete their listing images" on storage.objects;
create policy "Users can delete their listing images"
  on storage.objects for delete using (bucket_id = 'listings' and auth.uid() = owner);