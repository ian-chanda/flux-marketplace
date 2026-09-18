import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { useEffect } from "react";
import { Linking } from "react-native";

export function useAuthDeepLinkHandler() {

  const handleUrl = async (url: string) => {
    const hashMatch = url.match(/#(.*)/);
    if (hashMatch) {
      const hashParams = new URLSearchParams(hashMatch[1]);
      const access_token = hashParams.get('access_token');
      const refresh_token = hashParams.get('refresh_token');
      const type = hashParams.get('type');

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({ access_token, refresh_token });
        if (error) {
          console.log('setSession error', error.message);
          return;
        }
        router.replace('/settings/changePassword');
        return;
      }
    }
  }


  useEffect(() => {
    Linking.getInitialURL().then((url) => { if (url) handleUrl(url) });
    const sub = Linking.addEventListener('url', ({ url }) => handleUrl(url));
    return () => sub.remove();
  }, [])
};
