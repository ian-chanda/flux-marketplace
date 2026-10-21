import { useAuth } from "@/contexts/auth-context";
import { getChannels } from "@/services/channels";
import { useQuery } from "@tanstack/react-query";

export function useChannels() {
  const { user } = useAuth();

  const { data, isLoading, isRefetching } = useQuery({
    queryKey: ["channels"],
    queryFn: async () => {
      const data = await getChannels(user?.id as string);

      const channels = data.map((m) => m.channels);
      return channels;
    },
  });

  return {
    data,
    loading: isLoading,
    refetch: isRefetching,
  };
}
