import { useAuth } from "@/contexts/auth-context";
import { saveListing, unsaveListing } from "@/services/savedListings";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//
export function useSaveListing() {
  const { user } = useAuth();
  const userId = user?.id as string;
  const savedKey = ["saved", user?.id];

  const queryClient = useQueryClient();

  const doSaveListings = useMutation({
    mutationKey: ["saved", userId, "toggle"],
    mutationFn: async ({ id, saved }: { id: string; saved: boolean }) => {
      if(!user) throw new Error("user not signed in!")
      if (saved) {
        await saveListing(userId, id);
      } else await unsaveListing(userId, id);
    },
    onMutate: async ({id, saved}) => {
      await queryClient.cancelQueries({ queryKey: savedKey });
      const prev = queryClient.getQueryData<string[]>(savedKey);
      queryClient.setQueryData<string[]>(savedKey, (old = []) =>
        saved
          ? [...new Set([...old, id])]
          : old.filter((x) => x !== id),
      );

      return {prev};
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(savedKey, context?.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: savedKey }),
  });

  return {
    doSaveListings,
    isPending: doSaveListings.isPending,
  };
}
