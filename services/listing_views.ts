import { supabase } from "@/lib/supabase";

export async function recordView(userId: string, listing_id: string) {
  const { error } = await supabase
    .from("listing_views")
    .upsert({
      listing_id: listing_id,
      user_id: userId,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("listing_id", listing_id);

  if (error) throw error;
}

// here we're fetching the views of listings that belong to this user
// we can do that by fetching all listing_views records where
// listing_id.user_id == userId
export async function fetchAllViews(userId: string) {
  const { data, error } = await supabase
    .from("listing_views")
    .select("id, listing_id, owner:listings!listing_views_listing_id_fkey!inner(user_id)")
    .eq("owner.user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data 
}

export async function fetchListingViews(listing_id: string) {
  const { data, error } = await supabase
    .from("listing_views")
    .select("*")
    .eq("listing_id", listing_id)
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data 
}
