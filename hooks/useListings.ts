import { useAuth } from "@/contexts/auth-context";
import { getListings } from "@/services/listings";
import { Listing } from "@/types/listing";
import { useQuery } from "@tanstack/react-query";

export function useListings() {
  const { user } = useAuth();

  const { data, isLoading, isFetching, error, isRefetching, refetch } = useQuery({
    queryKey: ["listings"],
    queryFn: async () => {
      const data = await getListings();
      return data;
    },
  });

  return {
    listings: data,
    loading: isLoading,
    fetching: isFetching,
    refreshing: isRefetching,
    error,
    refresh: refetch,
  };
}

