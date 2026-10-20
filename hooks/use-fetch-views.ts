
import { useAuth } from "@/contexts/auth-context";
import { fetchAllViews} from "@/services/listing_views";
import { useQuery } from "@tanstack/react-query";


// either fetching for all listings or a single listing
export function useFetchViews() {
  const { user } = useAuth();

  const { data, isLoading, refetch, isRefetching, error, isError } = useQuery({
    queryKey: ["listing_views", user?.id, "fetch"],
    queryFn: async () => {
      const listingViews = await fetchAllViews(user?.id as string);
      return listingViews;
    },
  });

  return {
    listingViews: data,
    loading: isLoading,
    refetching: isRefetching,
    refetch,
    error,
    isError,
  };
}
