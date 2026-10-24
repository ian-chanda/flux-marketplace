import { supabase } from "@/lib/supabase";

// The client only sends listing ids. Prices/titles/images are snapshotted
// server-side by the create_order RPC, so a tampered client cannot set prices.
export type OrderItemInput = {
  listing_id: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  listing_id: string;
  price: number;
  title: string;
  image_url: string | null;
  listings: { category: string | null } | null;
};

export type Order = {
  id: string;
  user_id: string;
  total: number;
  status: string;
  payment_method: string | null;
  phone_number: string | null;
  created_at: string;
  order_items: OrderItem[];
};

// Server-side order creation. Totals, item snapshots, ownership and cart
// clearing all happen inside the security-definer `create_order` RPC.
// `idempotencyKey` makes a retried/double-submitted request return the
// existing order instead of charging twice.
export async function createOrder({
  items,
  paymentMethod,
  phoneNumber,
  clearCart = false,
  idempotencyKey,
}: {
  items: OrderItemInput[];
  paymentMethod: string;
  phoneNumber?: string;
  clearCart?: boolean;
  idempotencyKey?: string;
}): Promise<{ id: string; total: number; status: string }> {
  const { data, error } = await supabase.rpc("create_order", {
    p_items: items.map((item) => ({ listing_id: item.listing_id })),
    p_payment_method: paymentMethod,
    p_phone: phoneNumber ?? null,
    p_clear_cart: clearCart,
    p_idempotency_key: idempotencyKey ?? null,
  });

  if (error) throw error;

  return data as { id: string; total: number; status: string };
}

export function newIdempotencyKey() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function getOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, user_id, total, status, payment_method, phone_number, created_at, order_items(*, listings(category))"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as unknown as Order[];
}

export async function getOrderCount(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) throw error;

  return count ?? 0;
}