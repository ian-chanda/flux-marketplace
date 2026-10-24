-- ============================================================
-- Flux — READ-ONLY pre-migration inspection queries
-- Run in Supabase Dashboard > SQL Editor (or `psql`). None of these modify
-- data or schema. Paste the output back before we authorize any migration.
-- ============================================================

-- 1) Do the tables we plan to touch exist?
select schemaname, tablename
from pg_tables
where schemaname in ('public', 'storage')
  and tablename in (
    'users', 'public_profiles', 'listings', 'saved_listings',
    'delivery_addresses', 'verifications', 'orders', 'order_items',
    'cart_items', 'recently_viewed', 'objects', 'buckets'
  )
order by schemaname, tablename;

-- 2) Exact column definitions (verify the columns the migrations/app assume)
select table_schema, table_name, ordinal_position, column_name, data_type,
       is_nullable, column_default
from information_schema.columns
where table_schema in ('public', 'storage')
  and table_name in (
    'users', 'listings', 'delivery_addresses', 'verifications',
    'orders', 'order_items', 'cart_items', 'saved_listings'
  )
order by table_schema, table_name, ordinal_position;

-- 3) Does orders already have an idempotency_key / any unique index?
select indexname, indexdef
from pg_indexes
where schemaname = 'public'
  and tablename in ('orders', 'order_items')
order by tablename, indexname;

-- 4) Existing RLS status per table
select c.relname as table_name, c.relrowsecurity as rls_enabled,
       c.relforcerowsecurity as rls_forced
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relname in (
    'users', 'listings', 'delivery_addresses', 'verifications',
    'orders', 'order_items', 'cart_items', 'saved_listings', 'recently_viewed'
  )
order by c.relname;

-- 5) Every existing policy (public + storage) — the critical one to avoid
--    leaving a permissive policy in place
select schemaname, tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;

-- 6) Storage buckets and their public/private flag
select id, name, public, file_size_limit, allowed_mime_types, created_at
from storage.buckets
order by id;

-- 7) Storage object policies, expanded so a bucket can be searched in `qual`
select policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
order by policyname;

-- 8) Existing functions that could collide with create_order
select n.nspname as schema, p.proname as function_name,
       pg_get_function_identity_arguments(p.oid) as args
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where p.proname in ('create_order', 'enforce_order_server_insert')
order by n.nspname, p.proname;

-- 9) Triggers already defined on orders / order_items
select event_object_table as table_name, trigger_name, event_manipulation
from information_schema.triggers
where event_object_schema = 'public'
  and event_object_table in ('orders', 'order_items')
order by table_name, trigger_name;

-- 10) Verifications rows still storing full URLs (for the optional cleanup)
select id, user_id,
       (id_url ~ '^https?://') as id_url_is_url,
       (selfie_url ~ '^https?://') as selfie_url_is_url
from public.verifications
where id_url ~ '^https?://' or selfie_url ~ '^https?://';

-- 11) Sanity: a view with the same name as the one we create?
select table_schema, table_name
from information_schema.views
where table_schema = 'public' and table_name = 'public_profiles';
