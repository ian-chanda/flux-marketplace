import { useAuth } from "@/contexts/auth-context";
import { updateListing } from "@/services/listings";
import { Tables } from "@/types/database.types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//
export function useToggleAvailable() {
  const { user } = useAuth();
  const userId = user?.id as string;
  const listingsKey = ["listings", user?.id];

  const queryClient = useQueryClient();

  const doToggleAvailability = useMutation({
    mutationKey: ["listings", userId, "toggle"],
    mutationFn: async ({
      id,
      availability,
    }: {
      id: string;
      availability: boolean;
    }) => {
      await updateListing(id, { is_available: availability });
    },
    onMutate: async ({ id, availability }) => {
      await queryClient.cancelQueries({ queryKey: listingsKey });
      const prev = queryClient.getQueryData<Tables<"listings">[]>(listingsKey);
      queryClient.setQueryData<Tables<"listings">[]>(listingsKey, (old = []) =>
        old?.map((x) =>
          x.id === id ? { ...x, is_available: availability } : x,
        ),
      );

      return { prev };
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(listingsKey, context?.prev);
    },
    onSettled: (_data, _error, { id }) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: listingsKey }),
        queryClient.invalidateQueries({ queryKey: ["listings", id] }),
        queryClient.invalidateQueries({ queryKey: ["listings"] }),
        queryClient.invalidateQueries({ queryKey: ["search"] }),
      ]),
  });

  return {
    doToggleAvailability,
    isPending: doToggleAvailability.isPending,
  };
}
