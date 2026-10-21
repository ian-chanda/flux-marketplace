import { useAuth } from "@/contexts/auth-context";
import { addToCart } from "@/services/cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";

//
export function useAddToCart() {
  const { user } = useAuth();
  const userId = user?.id as string;

  const cartKey = ["cart", user?.id]

  const queryClient = useQueryClient();

  const doAddToCart = useMutation({
    mutationKey: ["cart", userId, "add"],
    mutationFn: async ( id: string ) => {
      await addToCart(user?.id as string, id);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: cartKey });
      const prev = queryClient.getQueryData<string[]>(cartKey);
      queryClient.setQueryData<string[]>(cartKey, (old = []) => [...new Set([...old, id])] );
      return {prev};
    },
    onError: (_error, _vars, context) => {
      queryClient.setQueryData(cartKey, context?.prev);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: cartKey }),
  });

  return {
    doAddToCart,
    isPending: doAddToCart.isPending,
  };
}
