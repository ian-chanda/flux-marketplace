import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { SubmitAddressVars } from "@/types/addresses";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

export function useSubmitAddress() {
  const { user } = useAuth();
  const userId = user?.id as string;

  const queryClient = useQueryClient();

  const doSubmitAddress = useMutation({
    mutationKey: ["addresses", userId, "submit"],
    mutationFn: async ({ id, ...form }: SubmitAddressVars) => {
      console.log("submitting this payload: ", JSON.stringify(form, null, 2));

      if (id) {
        console.log("the id is: ", id);
        await supabase
          .from("delivery_addresses")
          .update(form)
          .eq("id", id)
          .throwOnError();
      } else {
        await supabase
          .from("delivery_addresses")
          .insert({ ...form, user_id: userId })
          .throwOnError();
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["addresses", userId] }),
    onSuccess: () => router.back(),
  });

  return {
    doSubmitAddress,
    isPending: doSubmitAddress.isPending,
    error: doSubmitAddress.error,
    isError: doSubmitAddress.isError,
  };
}
