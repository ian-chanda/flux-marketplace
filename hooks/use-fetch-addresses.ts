import { useAuth } from "@/contexts/auth-context";
import { getDeliveryAddresses } from "@/services/addresses";
import { useQuery } from "@tanstack/react-query";

export function useFetchAddresses() {
  const { user } = useAuth();
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      const data = await getDeliveryAddresses(user?.id as string);
      return data;
    },
  });

  return {
    data,
    loading: isLoading,
    refetching: isRefetching,
  };
}
