import { TablesInsert } from "./database.types";

export type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string | null;
  images: string[];
  attributes: Record<string, string>;
  location: string | null;
  delivery_available: boolean;
  pickup_available: boolean;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type ListingForm = Pick<TablesInsert<"listings">,
|"user_id"
|"title"
|"description"
|"price"
|"category"
|"condition"
|"images"
|"attributes"
|"location"
|"delivery_available"
|"pickup_available">
