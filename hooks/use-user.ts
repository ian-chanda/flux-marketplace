import { useAuth } from "@/contexts/auth-context";
import { getUserProfile } from "@/services/users";
import { UserData } from "@/types/user";
import { useEffect, useState } from "react";

export function useUser() {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>();
  const [loading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!user) {
        setUserData(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      // if theres an error the error will be thrown from the service function
      // then itll be caught whereever you have the try and catch
      const data = await getUserProfile(user.id);

      setUserData(data);
      setIsLoading(false);
    }

    loadUser();
  }, [user]);

  return {
    userData,
    loading,
  };
}
