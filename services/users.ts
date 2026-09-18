import { supabase } from "@/lib/supabase";
import { uploadImage } from "./storage";
import { getVerificationStatus } from "./verifications";

export async function getUserProfile(userId: string) {
  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError) throw profileError;

  const latestRequest = await getVerificationStatus(userId);

  return {
    ...profile,
    verification: latestRequest
      ? {
          status: latestRequest.data?.status,
          submitted_at: latestRequest.data?.submitted_at,
        }
      : {
          status: "unsubmitted",
          submitted_at: null,
        },
  };
}

export async function updateProfile({
  userId,
  firstName,
  lastName,
  locationCity,
  locationProvince,
  locationCountry,
  bio,
  username,
  phoneNumber,
}: {
  userId: string;
  firstName: string;
  lastName: string;
  locationCity: string;
  locationProvince: string;
  locationCountry: string;
  bio: string;
  username: string;
  phoneNumber: string;
}) {
  const { data, error } = await supabase
    .from("users")
    .update({
      first_name: firstName,
      last_name: lastName,
      location_city: locationCity,
      location_province: locationProvince,
      location_country: locationCountry,
      bio: bio,
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

export async function deleteAccount() {
  // const { error } = await supabase.rpc("delete_user");
  const { data, error } = await supabase.functions.invoke("delete_user", {
    body: { name: "Functions" },
  });

  if (error) {
    console.log("FUNCTION ERROR CONTEXT : ", error.context);
    throw error;
  }
}
