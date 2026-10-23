-- ============================================================
-- 20261010000005_storage_profile_and_verification
-- Storage policies for the `profile` bucket (public avatars/headers) and the
-- `verification-docs` bucket (PRIVATE identity documents).
--
-- BEFORE APPLYING
--   Inspect storage.buckets and storage.objects policies (inspection queries).
--   Confirm the app's path convention: services/storage.ts writes
--     `{auth.uid()}/{folder?}/{name}.{ext}`
--   so ownership is proven by `(storage.foldername(name))[1] = auth.uid()::text`.
--
-- COMPATIBILITY
--   * `profile` is a public-read bucket; the app renders avatar_url/header_url
--     directly, so public read is preserved.
--   * `verification-docs` becomes private. services/verifications.ts now stores
--     object PATHS and reads them via createSignedUrl(), which requires the
--     owner SELECT policy below. Existing objects are NOT moved or deleted.
--
-- SAFETY
--   Guarded, name-checked policy creation. No existing policy is dropped here;
--   the tightening drops are listed under MANUAL REVIEW.
-- ============================================================

-- ---------- profile bucket ----------
insert into storage.buckets (id, name, public)
values ('profile', 'profile', true)
on conflict (id) do update set public = true;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'profile_public_read') then
    create policy profile_public_read on storage.objects
      for select using (bucket_id = 'profile');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'profile_owner_insert') then
    create policy profile_owner_insert on storage.objects
      for insert to authenticated
      with check (bucket_id = 'profile' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'profile_owner_update') then
    create policy profile_owner_update on storage.objects
      for update to authenticated
      using (bucket_id = 'profile' and owner = auth.uid())
      with check (bucket_id = 'profile' and owner = auth.uid());
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'profile_owner_delete') then
    create policy profile_owner_delete on storage.objects
      for delete to authenticated
      using (bucket_id = 'profile' and owner = auth.uid());
  end if;
end $$;

-- ---------- verification-docs bucket (private) ----------
insert into storage.buckets (id, name, public)
values ('verification-docs', 'verification-docs', false)
on conflict (id) do update set public = false;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'verification_docs_owner_select') then
    create policy verification_docs_owner_select on storage.objects
      for select to authenticated
      using (bucket_id = 'verification-docs' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'verification_docs_owner_insert') then
    create policy verification_docs_owner_insert on storage.objects
      for insert to authenticated
      with check (bucket_id = 'verification-docs' and (storage.foldername(name))[1] = auth.uid()::text);
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'verification_docs_owner_update') then
    create policy verification_docs_owner_update on storage.objects
      for update to authenticated
      using (bucket_id = 'verification-docs' and owner = auth.uid())
      with check (bucket_id = 'verification-docs' and owner = auth.uid());
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'verification_docs_owner_delete') then
    create policy verification_docs_owner_delete on storage.objects
      for delete to authenticated
      using (bucket_id = 'verification-docs' and owner = auth.uid());
  end if;
end $$;

-- ------------------------------------------------------------
-- MANUAL REVIEW (do not run automatically)
-- Making the bucket private only blocks NEW public reads. If a broad SELECT
-- policy for  verification-docs  already exists, identity documents remain
-- publicly listable/readable. Find it and drop it yourself after review:
--
--   select policyname, cmd, roles, qual, with_check
--   from pg_policies
--   where schemaname = 'storage' and tablename = 'objects'
--     and (coalesce(qual, '') like '%verification-docs%'
--          or coalesce(with_check, '') like '%verification-docs%');
--
--   -- example only:
--   -- drop policy if exists "<broad_policy_name>" on storage.objects;
--
-- Same caution applies to the listings bucket: its insert policy currently
-- allows ANY authenticated user to upload into ANY path. To scope it to the
-- owner, the broad policy must be dropped (not added to):
--   -- drop policy if exists "Authenticated users can upload listing images" on storage.objects;
--   -- create policy listings_owner_insert on storage.objects for insert to authenticated
--   --   with check (bucket_id = 'listings' and (storage.foldername(name))[1] = auth.uid()::text);
-- ------------------------------------------------------------
