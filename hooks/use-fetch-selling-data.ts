import { useAuth } from "@/contexts/auth-context";
import { fetchSellerData } from "@/services/listings";
import { useQuery } from "@tanstack/react-query";

export function useFetchSellerData() {
  const { user } = useAuth();

  const { data, isLoading, refetch, isRefetching, error, isError } = useQuery({
    queryKey: ["listing_views", user?.id, "fetch"],
    queryFn: async () => {
      const sellerData = await fetchSellerData(user?.id as string);

      return sellerData;
    },
  });

  return {
    sellerData: data,
    loading: isLoading,
    refetching: isRefetching,
    refetch,
    error,
    isError,
  };
}
