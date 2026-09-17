import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/listing";

export async function saveListing(userId: string, listingId: string): Promise<void> {
  const { error } = await supabase
    .from("saved_listings")
    .insert({ user_id: userId, listing_id: listingId })
    .maybeSingle();

  if (error) throw error;
}

export async function unsaveListing(userId: string, listingId: string): Promise<void> {
  const { error } = await supabase
    .from("saved_listings")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);

  if (error) throw error;
}

export async function getSavedListingIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("saved_listings")
    .select("listing_id")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map((row) => row.listing_id as string);
}

type SavedListingRow = {
  listing_id: string;
  created_at: string;
  listings: Listing;
};

export async function getSavedListings(userId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("saved_listings")
    .select("listing_id, created_at, listings(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as unknown as SavedListingRow[]).map((row) => row.listings);
}