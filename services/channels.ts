import { supabase } from "@/lib/supabase";

// export const getChannels = async (userId: string) => {
//   const { data, error } = await supabase
//     .from("channel_users")
//     .select(
//       `*, channels(*, listings(id, user_id, images), users(id, username, avatar_url, last_msg:messages!channels_last_msg_id_fkey (*))`,
//     )
//     .eq("user_id", userId);
//
//   console.log(JSON.stringify(data, null, 2));
//
//   if (error) throw error;
//   return data;
// };
export const getChannels = async (userId: string) => {
  const { data, error } = await supabase
    .from("channel_users")
    .select(`
      channel_id,
      channels (
        id,
        subject,
        created_at,
        listings (id, title, user_id, images),
        users (id, username, avatar_url),
        last_msg:messages!channels_last_msg_id_fkey (id, content, created_at, user_id)
      )
    `)
    .eq("user_id", userId);

  if (error) throw error;
  return data;
};

export const getSpecificChannel = async (channelId: string) => {
  const { data, error } = await supabase
    .from("channels")
    .select(
      `*, listings(user_id, users!listings_user_id_fkey (id, username, avatar_url)), messages(*)`,
    )
    .eq("id", channelId)
    .single();

  if (error) throw error;
  return data;
};
