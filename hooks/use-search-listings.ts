import { SearchListingParams, searchListings } from "@/services/listings";
import { useQuery } from "@tanstack/react-query";

export function useSearchListings(query: SearchListingParams) {
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["listings", query.query],
    queryFn: async () => {
      const data = await searchListings(query);
      return data;
    },
  });

  return {
    data,
    loading: isLoading,
    refetch: isRefetching,
  };
}
