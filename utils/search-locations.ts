import { LocationSearchResult } from "@/types/locations";

export function searchLocations(query: string): LocationSearchResult[] {
  const raw = require("@/data/all-constituency.json")

  query = query.toLowerCase();

  const matched = 
    raw.filter((item: any) => {
      const province = item.ancestors.find((a: any) => a.level === 1);
      const district = item.ancestors.find((a: any) => a.level === 2);
      const searchableNames = [
        item.name.local,
        item.name.en,
        province?.name.local,
        province?.name.en,
        district?.name.local,
        district?.name.en,
      ];
      return searchableNames.some((name) =>
        name?.toLowerCase().includes(query),
      );
    })
    .map((item: any) => {
      const province = item.ancestors.find((a: any) => a.level === 1);
      const district = item.ancestors.find((a: any) => a.level === 2);
      return {
        id: item.id,
        constituency: item.name.local,
        district: district?.name.local,
        province: province?.name.local,
      };
    });

	return matched
}
