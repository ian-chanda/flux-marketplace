import { Json } from "@/types/database.types";

export const attributesToString = (attributes: Json, separator = " ") => {
  if (!attributes || typeof attributes !== "object" || Array.isArray(attributes)) return "";

  return Object.values(attributes)
    .filter((v): v is string | number => typeof v === "string" || typeof v === "number")
    .map(String)
    .filter(Boolean)
    .join(separator);
};
