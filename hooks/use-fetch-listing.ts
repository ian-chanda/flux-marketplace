import { useAuth } from "@/contexts/auth-context";
import { getCartListingIds } from "@/services/cart";
import { getListingsByUser } from "@/services/listings";
import { getSavedListingIds } from "@/services/savedListings";
import { useQuery } from "@tanstack/react-query";

export function useFetchListings() {
  const { user } = useAuth();

  const { data, isLoading, refetch, isRefetching, error, isError } = useQuery({
    queryKey: ["listings", user?.id],
    queryFn: async () => {
      const listingData = await getListingsByUser(user?.id as string);
      return listingData;
    },
  });

  return {
    listingData: data,
    loading: isLoading,
    refetching: isRefetching,
    refetch,
    error,
    isError,
  };
}
