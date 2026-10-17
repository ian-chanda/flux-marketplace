import { DeliveryAddressType } from "@/hooks/use-submit-address";
import { supabase } from "@/lib/supabase";

export async function getDeliveryAddresses(userId: string) {
  const { data, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("user_id", userId);

  console.log("addys", JSON.stringify(data, null, 2))

  if (error) throw error;

  return data;
}

export async function getDeliveryAddress(id: string, label: string) {
  const { data, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("user_id", id)
    .eq("label", label.trim());

  if (error) throw error;

  return data;
}

export async function setAddressPrimary(
  id: string,
  addr_id: string,
  isPrimary: boolean,
) {
  //set the one that true to false first
  const { error: checkErr } = await supabase
    .from("delivery_addresses")
    .update({
      is_primary: false,
    })
    .eq("user_id", id)
    .eq("is_primary", true);
  if (checkErr) throw checkErr;

  const { error } = await supabase
    .from("delivery_addresses")
    .update({
      is_primary: true,
    })
    .eq("user_id", id)
    .eq("id", addr_id);

  if (error) throw error;
}

export async function submitAddress(address_item: DeliveryAddressType) {
  const { error } = await supabase
    .from("delivery_addresses")
    .upsert(address_item);
  if (error) throw error;
}

export async function deleteAddress({ addressId }: { addressId: string }) {
  const { error } = await supabase
    .from("delivery_addresses")
    .delete()
    .eq("id", addressId);

  if (error) throw error;
}
