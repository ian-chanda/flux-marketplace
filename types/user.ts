export type verType = {
  status: "pending" | "approved" | "rejected" | "unsubmitted";
  submitted_at: string | null;
};
export type UserData = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  username: string | null;
  phone_number: string | null;
  location_city: string | null;
  location_province: string | null;
  location_country: string | null;
  avatar_url: string | null;
  header_url: string | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  verification: verType;
};
