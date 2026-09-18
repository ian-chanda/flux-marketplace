import { supabase } from "@/lib/supabase";
import { uploadImage } from "./storage";
import { verType } from "@/types/user";

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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const idUrl = await uploadImage({
    bucket_name: "verification-docs",
    id: userId,
    uri: idUri,
    imageName: "id",
  });

  const selfieUrl = await uploadImage({
    bucket_name: "verification-docs",
    id: userId,
    uri: selfieUri,
    imageName: "selfie",
  });

  const { data, error } = await supabase.from("verifications").insert({
    user_id: userId,
    id_url: idUrl,
    selfie_url: selfieUrl,
  });

  if (error) throw error;

  return data;
}
