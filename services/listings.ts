import { supabase } from "@/lib/supabase";
import { Listing } from "@/types/listing";
import { uploadImage } from "./storage";

export async function getListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
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

export async function createListing(input: CreateListingInput): Promise<Listing> {
  const { data, error } = await supabase
    .from("listings")
    .insert({
      user_id: input.userId,
      title: input.title,
      description: input.description,
      price: input.price,
      category: input.category,
      condition: input.condition,
      images: input.images,
      attributes: input.attributes,
      location: input.location,
      delivery_available: input.delivery,
      pickup_available: input.pickup,
    })
    .select()
    .single();

  if (error) throw error;

  return data as Listing;
}

export async function uploadListingImages(uris: string[], userId: string): Promise<string[]> {
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