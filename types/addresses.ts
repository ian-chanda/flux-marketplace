import { TablesInsert } from "./database.types";

export type AddressForm = Pick<
  TablesInsert<"delivery_addresses">,
  | "label"
  | "recipient_name"
  | "country"
  | "street_address"
  | "street_address_2"
  | "city"
  | "phone_number"
  | "province"
>;

export type SubmitAddressVars = AddressForm & { id?: string };

