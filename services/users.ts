import { supabase } from "@/lib/supabase";
import { uploadImage } from "./storage";

export async function getUserProfile(userId: string) {
  return await supabase.from("users").select("*").eq("id", userId).single();
}

export async function updateProfile({
  userId,
  name,
  username,
  phoneNumber,
}: {
  userId: string;
  name: string;
  username: string;
  phoneNumber: string;
}) {
  const { data, error } = await supabase
    .from("users")
    .update({
      name: name,
      username: username,
      phone_number: phoneNumber,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateProfileImages({
  userId,
  avatarUri,
  headerUri,
}: {
  userId: string;
  avatarUri: string;
  headerUri: string;
}) {
  const avatarUrl = await uploadImage({
    bucket_name: "profile",
    id: userId,
    uri: avatarUri,
    folderName: "profile",
    imageName: "avatar",
  });

  const headerUrl = await uploadImage({
    bucket_name: "profile",
    id: userId,
    uri: headerUri,
    folderName: "profile",
    imageName: "header",
  });

  const { data, error } = await supabase
    .from("users")
    .update({
      avatar_url: avatarUrl,
      header_url: headerUrl,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}
