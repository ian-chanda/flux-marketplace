import { useAuth } from "@/contexts/auth-context";
import { getSpecificChannel } from "@/services/channels";
import { fetchMessages } from "@/services/messages";
import { useQuery } from "@tanstack/react-query";

export function useMessages(id: string) {
  const { data, isLoading, isRefetching, error } = useQuery({
    queryKey: ["messages", id],
    queryFn: async () => {
      const data = await fetchMessages(id);
      return data;
    },
  });

  return {
    data,
    loading: isLoading,
    refetch: isRefetching,
  };
}
