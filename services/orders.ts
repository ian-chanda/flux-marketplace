import { supabase } from "@/lib/supabase";

export type OrderItemInput = {
  listing_id: string;
  price: number;
  title: string;
  image_url: string | null;
};

export async function createOrder({
  userId,
  items,
  total,
  paymentMethod,
  phoneNumber,
}: {
  userId: string;
  items: OrderItemInput[];
  total: number;
  paymentMethod: string;
  phoneNumber?: string;
}): Promise<{ id: string; total: number; status: string }> {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total,
      status: "pending",
      payment_method: paymentMethod,
      phone_number: phoneNumber ?? null,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ order_id: order.id, ...item })));

  if (itemsError) throw itemsError;

  return order;
}