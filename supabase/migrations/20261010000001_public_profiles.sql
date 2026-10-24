-- ============================================================
-- 20261010000001_public_profiles
-- Public seller profiles (product page + seller modal).
--
-- BEFORE APPLYING
--   Run the inspection queries in supabase/INSPECTION_QUERIES.sql and confirm
--   that public.users exists with these exact columns. This migration is
--   ADDITIVE: it creates a view and grants SELECT. It does not drop, rename or
--   alter any existing object.
--
-- WHY
--   The app used to run `select("*")` from public.users for OTHER users,
--   leaking email, phone, coordinates and header_url. Cross-user reads now use
--   this view, which exposes only non-sensitive fields.
--
-- NOTE
--   security_invoker = false runs the view as its owner and therefore bypasses
--   the users-table RLS (added in migration ..._rls_users). That is intentional:
--   the view is the ONLY sanctioned cross-user read path and its column list is
--   the whitelist. Never add email/phone/latitude/longitude/header_url here.
-- ============================================================

create or replace view public.public_profiles
  with (security_invoker = false) as
select
  id,
  first_name,
  last_name,
  username,
  avatar_url,
  bio,
  location_city,
  location_province,
  location_country,
  is_verified,
  created_at
from public.users;

comment on view public.public_profiles is
  'Public seller fields only. Excludes email, phone, coordinates, header_url and verification data.';

revoke all on public.public_profiles from public, anon, authenticated;
grant select on public.public_profiles to anon, authenticated;
