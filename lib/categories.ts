export type Category = {
  name: string;
  pill: string;
  icon: string;
};

export const categories: Category[] = [
  { name: "Phones & Tablets", pill: "phones", icon: "phone-portrait" },
  { name: "Laptops & Computers", pill: "laptops", icon: "laptop" },
  { name: "Gaming", pill: "gaming", icon: "game-controller" },
  { name: "Audio", pill: "audio", icon: "headset" },
  { name: "Wearables", pill: "wearables", icon: "watch" },
  { name: "Cameras & Photography", pill: "cameras", icon: "camera" },
  { name: "TVs & Home Entertainment", pill: "tvs", icon: "tv" },
  { name: "Accessories", pill: "accessories", icon: "bag" },
  { name: "Smart Home", pill: "smart-home", icon: "home" },
  { name: "Other", pill: "other", icon: "ellipsis-horizontal" },
];

export function categoryForPill(pill: string): string | undefined {
  return categories.find((c) => c.pill === pill)?.name;
}