import { useAuth } from "@/contexts/auth-context";
import { getCartListingIds } from "@/services/cart";
import { getListing, getListingDetail } from "@/services/listings";
import { getSavedListingIds } from "@/services/savedListings";
import { getUserProfile } from "@/services/users";
import { Tables } from "@/types/database.types";
import { useQuery } from "@tanstack/react-query";

export const useSavedIds = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved", user?.id],
    queryFn: () => getSavedListingIds(user!.id),
    enabled: !!user,
  });
};

export const useCartIds = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["cart", user?.id],
    queryFn: () => getCartListingIds(user!.id),
    enabled: !!user,
  });
};

export function useFetchListingDetails(listing_id: string) {
  const { user } = useAuth();

  const { data, isLoading, isRefetching, error, isError } = useQuery({
    queryKey: ["listings", listing_id, user?.id],
    queryFn: async () => {
      if(!listing_id) return {} as Tables<"listings">
      console.log("the listing id: ", listing_id)
      const listingData = await getListingDetail(listing_id);
      return listingData;
    },
  });

  const savedIds = useSavedIds();
  const cartIds = useCartIds();

  return {
    listingData: data,
    seller: data?.seller ?? null,
    isSaved: savedIds.data?.includes(listing_id),
    inCart: cartIds.data?.includes(listing_id),
    cartCount: cartIds.data?.length,
    loading: isLoading,
    refetching: isRefetching,
    error,
    isError,
  };
}
