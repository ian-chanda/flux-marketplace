-- ============================================================
-- 20261010000099_optional_normalize_verification_urls
-- *** OPTIONAL — DO NOT APPLY WITHOUT EXPLICIT APPROVAL ***
--
-- Converts legacy verification rows that stored a full public/signed URL into
-- relative object PATHS, matching what services/verifications.ts now writes.
--
-- This migration only rewrites two text columns in public.verifications. It
-- does NOT delete, move or re-upload any object in the verification-docs
-- bucket. The application already tolerates both formats at runtime:
-- getVerificationDocumentUrl() returns any value starting with http(s) as-is,
-- so this cleanup is purely cosmetic and never required for correctness.
--
-- RUN AGAINST A BACKUP / IN A TRANSACTION. Preview first (read-only):
--
--   select id, user_id, id_url, selfie_url
--   from public.verifications
--   where id_url ~ '/storage/v1/object/'
--      or selfie_url ~ '/storage/v1/object/';
-- ============================================================

begin;

update public.verifications
set id_url = regexp_replace(
      split_part(id_url, '?', 1),
      '^.*/storage/v1/object/(public|sign)/verification-docs/', ''
    )
where id_url ~ '/storage/v1/object/(public|sign)/verification-docs/';

update public.verifications
set selfie_url = regexp_replace(
      split_part(selfie_url, '?', 1),
      '^.*/storage/v1/object/(public|sign)/verification-docs/', ''
    )
where selfie_url ~ '/storage/v1/object/(public|sign)/verification-docs/';

-- Change to ROLLBACK to dry-run without committing:
commit;
