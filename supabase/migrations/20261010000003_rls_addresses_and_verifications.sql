-- ============================================================
-- 20261010000003_rls_addresses_and_verifications
-- Row Level Security for delivery_addresses and verifications.
--
-- BEFORE APPLYING
--   Confirm both tables exist with a user_id column (inspection queries).
--   services/addresses.ts and services/verifications.ts only ever touch the
--   caller's own rows, so owner-only policies are compatible with the app.
--
-- SAFETY
--   Guarded, name-checked creation; no DROP of existing policies.
-- ============================================================

-- ---------- delivery_addresses ----------
alter table public.delivery_addresses enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'delivery_addresses' and policyname = 'delivery_addresses_select_own') then
    create policy delivery_addresses_select_own on public.delivery_addresses
      for select to authenticated using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'delivery_addresses' and policyname = 'delivery_addresses_insert_own') then
    create policy delivery_addresses_insert_own on public.delivery_addresses
      for insert to authenticated with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'delivery_addresses' and policyname = 'delivery_addresses_update_own') then
    create policy delivery_addresses_update_own on public.delivery_addresses
      for update to authenticated
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'delivery_addresses' and policyname = 'delivery_addresses_delete_own') then
    create policy delivery_addresses_delete_own on public.delivery_addresses
      for delete to authenticated using (auth.uid() = user_id);
  end if;
end $$;

-- ---------- verifications ----------
alter table public.verifications enable row level security;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'verifications' and policyname = 'verifications_select_own') then
    create policy verifications_select_own on public.verifications
      for select to authenticated using (auth.uid() = user_id);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and tablename = 'verifications' and policyname = 'verifications_insert_own') then
    create policy verifications_insert_own on public.verifications
      for insert to authenticated with check (auth.uid() = user_id);
  end if;
end $$;

-- Intentionally no UPDATE/DELETE for authenticated: a user must not be able to
-- edit status, rejection_reason or the stored document paths after submitting.
-- Reviewers act through the service role / dashboard.

-- ------------------------------------------------------------
-- MANUAL REVIEW
-- List existing policies first and remove any conflicting permissive ones:
--   select schemaname, tablename, policyname, cmd, roles, qual, with_check
--   from pg_policies
--   where schemaname = 'public' and tablename in ('delivery_addresses','verifications')
--   order by tablename, policyname;
-- ------------------------------------------------------------
