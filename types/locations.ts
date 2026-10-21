type LocationName = {
  local: string;
  en: string;
  slug?: string;
};

type LocationAncestor = {
  id: string;
  level: number;
  name: LocationName;
};

type LocationRecord = {
  id: string;
  level: number;
  name: LocationName;
  ancestors: LocationAncestor[];
};

export type LocationSearchResult = {
  id: string;
  constituency: string;
  district: string;
  province: string;
};

// ---------- raw LocationIQ autocomplete response ----------

// which of these keys appear depends on the place, so almost all of them are optional
export type LocationIQAddress = {
  name?: string;
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  village?: string;
  county?: string;
  state_district?: string;
  state?: string;
  postcode?: string;
  country?: string;
  country_code?: string;
};

export type LocationIQResult = {
  place_id: string;
  osm_id: string;
  osm_type: string; // "node" | "way" | "relation"
  licence: string;
  lat: string; // coordinates come back as strings
  lon: string;
  boundingbox: [string, string, string, string];
  class: string;
  type: string;
  display_name: string;
  display_place?: string;
  display_address?: string;
  address: LocationIQAddress;
};

// ---------- what the app keeps after the user picks a result ----------

export type SelectedAddress = {
  placeId?: string;
  name?: string; // "Kabulonga", or "Empire State Building"
  area?: string; // safe to show publicly, e.g. "Kabulonga, Lusaka"
  street?: string; // private: "350 5th Avenue", empty if there isn't one
  city: string;
  province: string; // LocationIQ calls this "state"
  country: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
};

const unique = (parts: (string | undefined)[]) => [...new Set(parts.filter(Boolean))] as string[];

export function toSelectedAddress(r: LocationIQResult): SelectedAddress {
  const a = r.address;
  const city = a.city ?? a.town ?? a.village ?? a.county ?? "";
  const neighbourhood = a.suburb ?? a.neighbourhood;

  return {
    placeId: r.place_id,
    name: a.name ?? r.display_place ?? city,
    area: unique([neighbourhood, city]).join(", "),
    street: unique([a.house_number, a.road]).join(" "),
    city,
    province: a.state ?? a.state_district ?? "",
    country: a.country ?? "",
    postcode: a.postcode,
    latitude: parseFloat(r.lat),
    longitude: parseFloat(r.lon),
  };
}

// -> columns of delivery_addresses (its latitude and longitude columns are text)
export const toAddressFields = (s: SelectedAddress) => ({
  street_address: s.street,
  city: s.city,
  province: s.province,
  country: s.country,
  latitude: String(s.latitude),
  longitude: String(s.longitude),
});
