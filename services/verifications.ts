import { supabase } from "@/lib/supabase";
import { createSignedUrl, uploadPrivateFile } from "./storage";

const VERIFICATION_BUCKET = "verification-docs";

export const getVerificationStatus = async (userId: string) => {
  const { data, error: verError } = await supabase
    .from("verifications")
    .select("status, submitted_at, rejection_reason")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (verError) throw verError;

  return { data };
};

export async function submitVerification({
  userId,
  idUri,
  selfieUri,
}: {
  userId: string;
  idUri: string;
  selfieUri: string;
}) {
  // Store object PATHS, not public URLs. The bucket is private and read via
  // short-lived signed URLs (see getVerificationDocumentUrl).
  const idPath = await uploadPrivateFile({
    bucket_name: VERIFICATION_BUCKET,
    id: userId,
    uri: idUri,
    imageName: "id",
  });

  const selfiePath = await uploadPrivateFile({
    bucket_name: VERIFICATION_BUCKET,
    id: userId,
    uri: selfieUri,
    imageName: "selfie",
  });

  const { data, error } = await supabase.from("verifications").insert({
    user_id: userId,
    id_url: idPath,
    selfie_url: selfiePath,
  });

  if (error) throw error;

  return data;
}

// Returns a short-lived URL for the owner (or an admin with read access) to
// view a private verification document. `path` is the stored object path.
export async function getVerificationDocumentUrl(path: string) {
  if (!path || /^https?:\/\//i.test(path)) {
    // Legacy rows may still hold a public URL; return it unchanged so the UI
    // keeps working until the optional normalization migration is applied.
    return path;
  }

  return createSignedUrl(VERIFICATION_BUCKET, path);
}
