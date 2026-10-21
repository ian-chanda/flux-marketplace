import { useAuth } from "@/contexts/auth-context";
import { SearchListingParams, searchListings } from "@/services/listings";
import { searchMessages } from "@/services/messages";
import { useQuery } from "@tanstack/react-query";

export function useSearchMessages(msg: string) {
  const {user} = useAuth()

  const { data, refetch, isLoading, isRefetching } = useQuery({
    queryKey: ["messages", msg],
    queryFn: async () => {
      const data = await searchMessages(msg);
      return data;
    },
  });

  return {
    data,
    refetch,
    loading: isLoading,
    refetching: isRefetching,
  };
}
