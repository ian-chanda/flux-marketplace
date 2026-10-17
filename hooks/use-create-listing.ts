import { useAuth } from "@/contexts/auth-context";
import { createListing, uploadListingImages } from "@/services/listings";
import { ListingForm } from "@/types/listing";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";

//
export function useCreateListing() {
  const { user } = useAuth();

  const doCreateListing = useMutation({
    mutationKey: ["listings", user?.id, "create"],
    mutationFn: async ({images, payload}: {images: string[], payload: ListingForm}) => {

      const imageUrls = images.length ? await uploadListingImages(images, user?.id as string) : [];

      const listing = await createListing({images: imageUrls, ...payload});

      return listing
    },
    onSuccess(listing) {
      router.replace(`/product/${listing.id}`);
    },
  });

  return {
    doCreateListing,
    isPending: doCreateListing.isPending,
    isError: doCreateListing.isError,
    error: doCreateListing.error,
  };
}
