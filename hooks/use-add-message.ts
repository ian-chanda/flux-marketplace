import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";

//
export function useAddMessage(channel_id: string) {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const addMessage = useMutation({
    mutationKey: ["messages", channel_id],
    mutationFn: async ({
      channelId,
      msg,
    }: {
      channelId: string;
      msg: string;
    }) => {
      const { data } = await supabase
        .from("messages")
        .insert({
          content: msg,
          user_id: user?.id as string,
          channel_id: channelId,
        })
        .throwOnError()
        .select("*")
        .single();

      return data;
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["messages", channel_id] }),
    onSuccess: () => 
      queryClient.invalidateQueries({ queryKey: ["channels"] })

  });


  return {
    addMessage,
    isPending: addMessage.isPending,
  };
}
