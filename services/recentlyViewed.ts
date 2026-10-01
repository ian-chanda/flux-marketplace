import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/listing";

type RecentViewRow = {
  listing_id: string;
  viewed_at: string;
  listings: Listing;
};

export async function recordRecentView(userId: string, listingId: string): Promise<void> {
  const { error } = await supabase
    .from("recently_viewed")
    .upsert(
      { user_id: userId, listing_id: listingId, viewed_at: new Date().toISOString() },
      { onConflict: "user_id,listing_id" }
    );

  if (error) throw error;
}

export async function getRecentViews(userId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("recently_viewed")
    .select("listing_id, viewed_at, listings(*)")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as RecentViewRow[]).map((row) => row.listings);
}

export async function removeRecentView(userId: string, listingId: string): Promise<void> {
  const { error } = await supabase
    .from("recently_viewed")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);

  if (error) throw error;
}