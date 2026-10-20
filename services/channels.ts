import { supabase } from "@/lib/supabase";

// one user can not have more than one channel open for the same listing_id
export const fetchListingInquiries = async (userId: string) => {
  // fetch all rows that belong to a seller
  // where they are in a channel
  // and the listing_id is not null
  // and the last_msg id is also not null
  const { count, error } = await supabase
    .from("channel_users")
    .select(
      `
      channel_id,
      channels!inner ( id, last_msg_id, listing_id)
      `,
      { count: "exact", head: true },
    )
    .not("channels.last_msg_id", "is", null)
    .not("channels.listing_id", "is", null)
    .eq("user_id", userId);

  if (error) throw error;

  return count;
};

export const getChannels = async (userId: string) => {
  const { data, error } = await supabase
    .from("channel_users")
    .select(
      `
      channel_id,
      channels (
        id,
        subject,
        created_at,
        listings (id, title, user_id, images),
        users (id, username, avatar_url),
        last_msg:messages!channels_last_msg_id_fkey (id, content, created_at, user_id)
      )
    `,
    )
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
