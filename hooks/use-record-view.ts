import { useAuth } from "@/contexts/auth-context";
import { recordView } from "@/services/listing_views";
import { useMutation } from "@tanstack/react-query";

export function useRecordView() {
  const { user } = useAuth();
  const userId = user?.id as string;

  const doRecordView = useMutation({
    mutationKey: ["listing_views", userId, "record"],
    mutationFn: async ({ id }: { id: string }) => {
      await recordView(userId, id);
    },
    onError: (error) => console.error("failed to record view!, ", error),
    onSuccess: () => console.log("view recorded"),
  });

  return {
    doRecordView,
    isPending: doRecordView.isPending,
  };
}
