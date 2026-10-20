import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/lib/supabase";
import {
  createListing,
  updateListing,
  uploadListingImages,
} from "@/services/listings";
import { ListingForm } from "@/types/listing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { Alert } from "react-native";

export const isRemote = (uri: string) => /^https?:\/\//.test(uri);

const urlToPath = (url: string) =>
  url.split(`/object/public/${"listings"}/`)[1];

const removeImages = async (urls: string[]) => {
  const paths = urls.map(urlToPath).filter(Boolean);
  if (paths.length) await supabase.storage.from("listings").remove(paths);
};

export function useCreateListing() {
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const doCreateListing = useMutation({
    mutationKey: ["listings", user?.id, "create"],
    mutationFn: async ({
      id,
      originalImages,
      images,
      payload,
    }: {
      id: string;
      originalImages: string[];
      images: string[];
      payload: ListingForm;
    }) => {
      //TODO: atomicity is required here hence an rpc function is required
      const fresh = images?.filter((uri) => !isRemote(uri));
      const uploaded = fresh.length
        ? await uploadListingImages(fresh, user?.id as string)
        : [];

      // create a map where the local uri is the key then get the value from the uploaded array
      const uploadedByUri = new Map(fresh.map((uri, i) => [uri, uploaded[i]]));
   const finalImages = images.map((uri) => uploadedByUri.get(uri) ?? uri);
      let listing;
      try {
        listing = id
          ? await updateListing(id, { ...payload, images: finalImages })
          : await createListing({ images: finalImages, ...payload });
      } catch (error) {
        await removeImages(uploaded).catch(() => {});
        throw error;
      }

      const removed = originalImages?.filter(
        (url) => !finalImages.includes(url),
      );
      await removeImages(removed).catch(() => {});

      return listing;
    },
    onSuccess(listing) {
      router.replace(`/product/${listing.id}`);
    },
    onError: (error) =>
      Alert.alert(
        "couldnt publish",
        error instanceof Error
          ? error.message
          : "something went wrong. Try again if you want.",
      ),
    onSettled: (_data, _error, vars) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["listings"] }),
        queryClient.invalidateQueries({ queryKey: ["listings", user?.id] }),
        vars.id
          ? queryClient.invalidateQueries({ queryKey: ["listings", vars.id] })
          : undefined
      ]),
  });

  return {
    doCreateListing,
    isPending: doCreateListing.isPending,
    isError: doCreateListing.isError,
    error: doCreateListing.error,
  };
}
5120
