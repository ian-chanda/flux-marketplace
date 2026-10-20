import { supabase } from "@/lib/supabase";
import { Listing, ListingForm } from "@/types/listing";
import { uploadImage } from "./storage";
import { Tables } from "@/types/database.types";

export async function fetchSellerData(user_id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, user_id, price, title, is_sold, is_available, sold_at, channels!left(id, created_at, listing_id, last_msg_id), listing_views!left(created_at)",
    )
    .eq("user_id", user_id);

  if (error) throw error;

  return data.map((listing) => ({
    ...listing,
    sold_at: new Date().toISOString(),
    listing_views: listing.listing_views,
    views: listing.listing_views.length,
    inquiries: listing.channels.filter((l) => l.last_msg_id !== null).length
  }));
}

export async function fetchEarnings() {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("is_sold", true);

  if (error) throw error;

  return data;
}

export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("is_available", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Listing[];
}

export async function getListing(id: string): Promise<Listing> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Listing;
}

export async function getListingDetail(id: string) {
  const { data, error } = await supabase
    .from("listings")
    .select(
      "*, seller:users!listings_user_id_fkey(id, username, first_name, last_name, avatar_url, is_verified, updated_at)",
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function getListingsByUser(userId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as Listing[];
}

export type CreateListingInput = {
  userId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string | null;
  images: string[];
  attributes: Record<string, string>;
  location: string | null;
  delivery: boolean;
  pickup: boolean;
};

export async function createListing(
  input: ListingForm,
): Promise<Tables<"listings">> {
  const { data, error } = await supabase
    .from("listings")
    .insert({
      user_id: input.user_id,
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      condition: input.condition,
      images: input.images,
      attributes: input.attributes,
      location: input.location,
      delivery_available: input.delivery_available,
      pickup_available: input.pickup_available,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Listing;
}

export async function deleteListing(id: string): Promise<void> {
  const { error } = await supabase.from("listings").delete().eq("id", id);

  if (error) throw error;
}

export async function updateListingAvailability(
  id: string,
  isAvailable: boolean,
): Promise<Listing> {
  const { data, error } = await supabase
    .from("listings")
    .update({ is_available: isAvailable })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Listing;
}

export async function uploadListingImages(
  uris: string[],
  userId: string,
): Promise<string[]> {
  const urls: string[] = [];

  for (let i = 0; i < uris.length; i++) {
    const url = await uploadImage({
      bucket_name: "listings",
      uri: uris[i],
      id: userId,
      folderName: "listings",
      imageName: `${Date.now()}-${i}`,
    });
    urls.push(url);
  }

  return urls;
}

export async function updateListing(
  id: string,
  updates: Partial<
    Pick<
      Tables<"listings">,
      | "is_available"
      | "title"
      | "description"
      | "price"
      | "condition"
      | "images"
    >
  >,
): Promise<Tables<"listings">> {
  const { data, error } = await supabase
    .from("listings")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export type SearchListingParams = {
  query: string;
};

export async function searchListings(p: SearchListingParams) {
  let q = supabase.from("listings").select(`*`);

  const term = p.query?.trim().replace(/[,()%]/g, " ");
  if (term) {
    q = q.or(
      `title.ilike.%${term}%,description.ilike.%${term}%,category.ilike.%${term}%,location.ilike.%${term}%`,
    );
  }
  const { data, error } = await q;
  if (error) throw error;

  return data;
}
