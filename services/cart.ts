import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/listing";

export type CartItemRow = {
  id: string;
  listing_id: string;
  quantity: number;
  created_at: string;
  listings: Listing;
};

export async function addToCart(userId: string, listingId: string): Promise<void> {
  const { error } = await supabase
    .from("cart_items")
    .upsert({ user_id: userId, listing_id: listingId, quantity: 1 }, { onConflict: "user_id,listing_id" })
    .maybeSingle();

  if (error) throw error;
}

export async function getCartItems(userId: string): Promise<CartItemRow[]> {
  const { data, error } = await supabase
    .from("cart_items")
    .select("id, listing_id, quantity, created_at, listings(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as unknown as CartItemRow[];
}

export async function removeCartItem(userId: string, listingId: string): Promise<void> {
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId)
    .eq("listing_id", listingId);

  if (error) throw error;
}

export async function clearCart(userId: string): Promise<void> {
  const { error } = await supabase.from("cart_items").delete().eq("user_id", userId);

  if (error) throw error;
}

export async function getCartCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("cart_items")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;

  return count ?? 0;
}

export async function getCartListingIds(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("cart_items")
    .select("listing_id")
    .eq("user_id", userId);

  if (error) throw error;

  return (data ?? []).map((row) => row.listing_id as string);
}

export async function getCartTotal(userId: string): Promise<number> {
  const items = await getCartItems(userId);
  return items.reduce((sum, item) => sum + Number(item.listings.price), 0);
}