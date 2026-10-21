import { useAuth } from "@/contexts/auth-context";
import { deleteAddress } from "@/services/addresses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export function useDeleteAddress() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const doDeleteAddress = useMutation({
    mutationKey: ["addresses", user?.id, "delete"],
    mutationFn: async ({ id }: { id: string }) => {
      await deleteAddress({ addressId: id });
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["addresses", user?.id] }),
    onSuccess: () => router.back()
  });

  return {
    doDeleteAddress,
    pending: doDeleteAddress.isPending,
  };
}
