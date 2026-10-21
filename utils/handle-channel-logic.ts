// i want when you press some sort of "contact seller" it should
// route you to the chat page. if the chat exists it'll load the chat
//...
// just go to the message screen and pass in the user_id
// which'll mean create a chat with this user

import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import { useMutation } from "@tanstack/react-query";

//
export const loadMessage = async () => {
  const { user } = useAuth();

  const createChannel = useMutation({
    mutationFn: async (recipient: any) => {
      const { data: channel } = await supabase
        .from("channels")
        .insert({
          subject: subject as string,
          listing_id: listing_id as string,
        })
        .throwOnError()
        .select("*")
        .single();

      await supabase.from("channel_users").insert({
        channel_id: channel.id,
        user_id: recipient,
      });

      await supabase.from("channel_users").insert({
        channel_id: channel.id,
        user_id: user?.id,
      });
      console.log("doneee");

      return channel;
    },
    onSuccess(newChannel) {},
  });
};
