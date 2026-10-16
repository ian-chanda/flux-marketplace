import { useAuth } from "@/contexts/auth-context";
import { getUserProfile } from "@/services/users";
import { UserData } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const { user } = useAuth();

  const {data, isLoading: loading, error, refetch} = useQuery({
    queryKey: ['users', user?.id],
    queryFn: async () => {
      const data = await getUserProfile(user?.id as string);
      return data
    },
    enabled: !!user?.id
  })

  return {
    data,
    loading,
    error,
    refetch
  };
}
