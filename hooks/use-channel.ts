import { useAuth } from "@/contexts/auth-context";
import { getSpecificChannel } from "@/services/channels";
import { useQuery } from "@tanstack/react-query";

export function useChannel(id: string) {
  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["channels", id],
    queryFn: async () => {
      const data = await getSpecificChannel(id);
      return data;
    },
  });

  return {
    data,
    loading: isLoading,
    refetch: isRefetching,
  };
}
