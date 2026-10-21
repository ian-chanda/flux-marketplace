import { useAuth } from "@/contexts/auth-context";
import { deleteAddress } from "@/services/addresses";
import { deleteListing } from "@/services/listings";
import { Tables } from "@/types/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export function useDeleteListing() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const listingsKey = ["listings", user?.id];

  const doDeleteListing = useMutation({
    mutationKey: ["listings", user?.id, "delete"],
    mutationFn: async ({ listing_id }: { listing_id: string }) => {
      await deleteListing(listing_id);
    },
    // onMutate: async ({ listing_id }) => {
    //   await queryClient.cancelQueries({ queryKey: listingsKey });
    //   const prev = queryClient.getQueryData<Tables<"listings">[]>(listingsKey);
    //   queryClient.setQueryData<Tables<"listings">[]>(listingsKey, (old = []) =>
    //     old?.filter((x) => x.id !== listing_id),
    //   );
    //
    //   return { prev };
    // },
    // onError: (_error, _vars, context) => {
    //   queryClient.setQueryData(listingsKey, context?.prev);
    // },
    onSuccess: (_data, _error) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: listingsKey }),
        queryClient.invalidateQueries({ queryKey: ["listings"] }),
        queryClient.invalidateQueries({ queryKey: ["search"] }),
      ]),
  });

  return {
    doDeleteListing,
    pending: doDeleteListing.isPending,
  };
}
