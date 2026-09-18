import { supabase } from "@/lib/supabase";

export async function getDeliveryAddresses(userId: string) {
  const { data, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("user_id", userId);

  if (error) throw error;

  console.log("found addies: ", JSON.stringify(data, null, 2));

  return data;
}

export async function getDeliveryAddress(id: string, label: string) {
  console.log("fetching for: ", label.trim());
  const { data, error } = await supabase
    .from("delivery_addresses")
    .select("*")
    .eq("user_id", id)
    .eq("label", label.trim());

  if (error) throw error;

  console.log("found addy: ", JSON.stringify(data, null, 2));

  return data;
}

export async function setAddressPrimary(id: string, label: string) {
  //set it to false first
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
    .eq("label", label);

  if (error) throw error;
}

export async function submitAddress({
  id,
  userId,
  label,
  name,
  country,
  province,
  city,
  streetAddress,
  phoneNumber,
}: {
  id: string | null;
  userId: string;
  label: string;
  name: string;
  country: string;
  province: string;
  city: string;
  streetAddress: string;
  phoneNumber: string;
}) {
  const { error } = await supabase.from("delivery_addresses").upsert({
    id: id ?? undefined,
    user_id: userId,
    label: label,
    recipient_name: name,
    country: country,
    province: province,
    city: city,
    street_address: streetAddress,
    phone_number: phoneNumber,
  });

  if (error) throw error;
}

export async function deleteAddress({ addressId }: { addressId: string; }) {
  const { error } = await supabase
    .from("delivery_addresses")
    .delete()
    .eq("id", addressId);

  if (error) throw error;
}
