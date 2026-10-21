import { useAuth } from "@/contexts/auth-context";
import { setAddressPrimary } from "@/services/addresses";
import { updateProfile, updateProfileImages } from "@/services/users";
import { UserUpdateForm } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { isRemote } from "./use-create-listing";

//
export function useEditProfile() {
  const { user } = useAuth();
  const userId = user?.id as string;

  const queryClient = useQueryClient();

  const doUserUpdate = useMutation({
    mutationKey: ["users", userId, "edit"],
    mutationFn: async ({
      payload,
      avatarImage,
      headerImage,
    }: {
      payload: UserUpdateForm;
      avatarImage: string | null;
      headerImage: string | null;
    }) => {
      await updateProfile({ payload, userId });

      await updateProfileImages({
        userId: user?.id as string,
        avatarUri: avatarImage && !isRemote(avatarImage) ? avatarImage : null,
        headerUri: headerImage && !isRemote(headerImage) ? headerImage : null,
      });

    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["users", userId] }),
    onSuccess: () => {
      router.back();
    },
  });

  return {
    doUserUpdate,
    isPending: doUserUpdate.isPending,
  };
}
