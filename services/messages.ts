import { supabase } from "@/lib/supabase";

export const fetchMessages = async (channelId: string) => {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("channel_id", channelId);

  if (error) throw error;
  return data;
};

export async function searchMessages(m: string) {

  const msg = m.trim().replace(/[,()%]/g, " ");
  if(!msg) return []

  const { data, error } = await supabase
    .from("messages")
    .select(`*`)
    .ilike("content", `%${msg}%`)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) throw error;
  return data;
}
