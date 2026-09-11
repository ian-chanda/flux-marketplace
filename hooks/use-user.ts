import { useAuth } from "@/contexts/auth-context";
import { getUserProfile } from "@/services/users";
import { UserData } from "@/types/user";
import { useEffect, useState } from "react";

export function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>();
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadUser() {
      if (!user) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await getUserProfile(user.id);

      if (error) {
        setError(error);
      } else {
        setUserData(data);
      }

      setIsLoading(false);
    }

    loadUser();
  }, [user]);

  return {
    userData,
    loading,
    error,
  };
}
