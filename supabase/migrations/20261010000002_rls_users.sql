-- ============================================================
-- 20261010000002_rls_users
-- Row Level Security for public.users.
--
-- BEFORE APPLYING
--   Confirm with the inspection queries that no client-side code INSERTs into
--   public.users (the app only SELECTs its own row and UPDATEs its own row;
--   the signup row is created by a database trigger). Enabling RLS with
--   owner-only policies is safe whichever way the trigger is defined, because
--   SECURITY DEFINER triggers bypass RLS.
--
-- COMPATIBILITY
--   Cross-user reads no longer touch public.users directly — they use the
--   public_profiles view (20261010000001). Public read does NOT depend on any
--   policy added here, so it keeps working even while RLS is enabled.
--
-- SAFETY
--   Policies are created only if a policy with the SAME name is absent
--   ("if exists" logic, no drops). Any PRE-EXISTING broader policy on this
--   table is left untouched — see the review step at the bottom.
-- ============================================================

alter table public.users enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'users_select_own'
  ) then
    create policy users_select_own on public.users
      for select to authenticated
      using (auth.uid() = id);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'users' and policyname = 'users_update_own'
  ) then
    create policy users_update_own on public.users
      for update to authenticated
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;

-- No INSERT/DELETE policy for authenticated: rows are provisioned by the
-- signup trigger and removal goes through the delete_user Edge Function.

-- ------------------------------------------------------------
-- MANUAL REVIEW (do not run automatically)
-- RLS policies are OR'ed. If public.users already has a permissive policy
-- (e.g. "Public profiles are viewable by everyone"), the owner-only policies
-- above will NOT restrict it. After running the inspection queries, list and
-- remove any conflicting policies yourself, for example:
--
--   select policyname, cmd, roles, qual, with_check
--   from pg_policies where schemaname = 'public' and tablename = 'users';
--
--   drop policy if exists "<conflicting_policy_name>" on public.users;
-- ------------------------------------------------------------
