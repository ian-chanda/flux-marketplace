import { useAuth } from "@/contexts/auth-context";
import { setAddressPrimary } from "@/services/addresses";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//
export function useMakePrimary() {
  const { user } = useAuth();
  const userId = user?.id as string;

  const queryClient = useQueryClient();

  const makePrimaryAddress = useMutation({
    mutationKey: ["addresses", userId, "primary"],
    mutationFn: async ({id} : {id: string}) => {
      const data = await setAddressPrimary(userId, id);
      return data;
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["addresses", userId]}),
  });

  return {
    makePrimaryAddress,
    isPending: makePrimaryAddress.isPending,
  };
}
