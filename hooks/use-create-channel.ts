import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

//
export function useCreateChannel() {
  const { user } = useAuth();

  const createChannel = useMutation({
    mutationFn: async ({
      recipient,
      listing_id,
      subject,
    }: {
      recipient: any;
      listing_id: string;
      subject: string;
    }) => {
      const { data: channelId, error } = await supabase.rpc(
        "get_or_create_channel",
        {
          p_listing_id: listing_id as string,
          p_subject: subject as string,
        },
      );
      if (error) throw error;
      return channelId; // navigate to /messages/[channelId]
    },
    onSuccess(channelId) {
      router.push({
        pathname: "/messages/[id]",
        params: { id: channelId},
      });
    },
  });

  return {
    createChannel,
    isPending: createChannel.isPending,
  };
}
