import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { PfpRowItem } from "@/components/pfpRowItem";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useCreateChannel } from "@/hooks/use-create-channel";
import { useTheme } from "@/hooks/useTheme";
import { addToCart, getCartListingIds } from "@/services/cart";
import { getListing } from "@/services/listings";
import { getSavedListingIds, saveListing, unsaveListing } from "@/services/savedListings";
import { getUserProfile } from "@/services/users";
import { Listing } from "@/types/listing";
import { UserData } from "@/types/user";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, ScrollView, StyleSheet, TouchableOpacity, View, ViewToken, useWindowDimensions } from "react-native";
import { LoadingScreen } from "../(tabs)/(search)/results";

const attributeLabels: Record<string, string> = {
  brand: "Brand",
  model: "Model",
  ram: "RAM",
  storage: "Storage",
  color: "Color",
};

export default function Product() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saved, setSaved] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [inCart, setInCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const mainListRef = useRef<FlatList | null>(null);
  const { user } = useAuth();
  const { createChannel, isPending } = useCreateChannel()

  useEffect(() => {
    async function load() {
      if (!id) return;
      try {
        const listingData = await getListing(id);
        setListing(listingData);

        try {
          const sellerData = await getUserProfile(listingData.user_id);
          if (sellerData) setSeller(sellerData as UserData);
        } catch {
          // seller is optional — don't block the listing
        }

        if (user) {
          try {
            const savedIds = await getSavedListingIds(user.id);
            setSaved(savedIds.includes(id));
          } catch {
            setSaved(false);
          }
          try {
            const cartIds = await getCartListingIds(user.id);
            setCartCount(cartIds.length);
            setInCart(cartIds.includes(id));
          } catch {
            setCartCount(0);
            setInCart(false);
          }
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  const toggleSave = useCallback(async () => {
    if (!user || !id) return;

    const next = !saved;
    setSaved(next);

    try {
      if (next) {
        await saveListing(user.id, id);
      } else {
        await unsaveListing(user.id, id);
      }
    } catch {
      setSaved(!next);
    }
  }, [user, id, saved]);

  if (loading) {
    return (
      <ThemedView isTabVisible={false}>
        <CustomHeader showBack >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
            <IconButton icon={"shopping-cart"} onPress={() => router.push('/cart')} badgeValue={cartCount ? String(cartCount) : ''} />
          </View>
        </CustomHeader>
        <LoadingScreen />
      </ThemedView>
    );
  }

  if (error || !listing) {
    return (
      <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
        <ThemedText type="defaultFaded">Could not load this listing.</ThemedText>
        <TouchableOpacity onPress={() => router.back()}>
          <ThemedText type="defaultBold" style={{ color: colors.accent }}>Go back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const images = listing.images?.length ? listing.images : [];
  const attributes = Object.entries(listing.attributes ?? {});

  return (
    <ThemedView isTabVisible={false}>

      <CustomHeader
        showBack
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <IconButton icon={saved ? "bookmark" : "bookmark-outline"} badgeValue="" onPress={toggleSave} />
          <IconButton icon={"share"} onPress={() => router.push('/notifications')} badgeValue="" />
          <IconButton icon={"shopping-cart"} onPress={() => router.push('/cart')} badgeValue={cartCount ? String(cartCount) : ''} />
        </View>
      </CustomHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 10,  gap: 10 }}
      >
        {images.length > 0 && (
          <>
            <FlatList
              style={{ flex: 1, paddingVertical: 5 }}
              horizontal
              data={images}
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              ref={mainListRef}
              viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
              onViewableItemsChanged={({ viewableItems }: { viewableItems: ViewToken[] }) => {
                const first = viewableItems[0];
                if (first?.index != null) setActiveImage(first.index);
              }}
              renderItem={({ item }) => (
                <Image source={{ uri: item }} style={[styles.mainImage, { width: width - 20 }]} resizeMode="cover" />
              )}
              keyExtractor={(item, index) => `${item}-${index}`}
            />
            <FlatList
              horizontal
              data={images}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <Pressable
                  onPress={() => mainListRef.current?.scrollToIndex({ index, animated: true })}
                  style={[styles.secondaryImages, { borderColor: index === activeImage ? colors.backdrop : "transparent" }]}>
                  <Image source={{ uri: item }} style={styles.thumbnailImage} resizeMode="cover" />
                </Pressable>
              )}
              keyExtractor={(item, index) => `thumb-${item}-${index}`}
            />
          </>
        )}

        <View>
          <ThemedText type="subtitle">{listing.title}</ThemedText>
          {listing.condition && (
            <ThemedText>Condition: {listing.condition}</ThemedText>
          )}
          <ThemedText type="defaultFaded">{listing.location}</ThemedText>
          <ThemedText type="subtitle">
            K{listing.price}
          </ThemedText>
        </View>

        {attributes.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {attributes.map(([key, value]) => (
              <View
                key={key}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 50,
                  backgroundColor: colors.surface,
                }}>
                <ThemedText type="smallFaded">
                  {attributeLabels[key] ?? key}: {value}
                </ThemedText>
              </View>
            ))}
          </View>
        )}
        <Button
          title="Buy Now"
          onPress={() => router.push({ pathname: "/payment", params: { listingId: id } })}
        />

        <Button
          title="Add to Cart"
          onPress={async () => {
            if (!user) return alert("Please sign in first");
            if (inCart) return alert("This item is already in your cart");
            try {
              await addToCart(user.id, id);
              setInCart(true);
              setCartCount(cartCount + 1);
              alert("Added to cart");
            } catch {
              alert("Could not add to cart");
            }
          }}
        />

        <View>
          <PfpRowItem
            imageUrl={`${seller?.avatar_url}?v=${seller?.updated_at}`}
            fName={seller?.first_name ?? "unknown"}
            lName={seller?.last_name ?? "unknown"}
            username={seller?.username ?? "unknown123"}
            isVerified={seller?.is_verified ?? false}
            onPress={() => router.push({ pathname: "/modals/profile", params: { id: listing.user_id } })}
          />
          <TouchableOpacity
            onPress={() =>
              createChannel.mutate({
                recipient: listing.user_id,
                listing_id: listing.id,
                subject: listing.title,
                // recipient_name: `${seller?.first_name} ${seller?.last_name}`,
                // recipient_avatar: seller?.avatar_url
              })
            }
            style={{
              width: '100%',
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 12,
              borderColor: colors.accent, borderWidth: 1
            }}
          >
            {isPending ?
              <ActivityIndicator size={24} color={colors.accent} />
              :
              <ThemedText>contact seller</ThemedText>
            }
          </TouchableOpacity>
        </View>

        <ThemedText type="default">
          {listing.description}
        </ThemedText>

        {attributes.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/modals/itemInformation", params: { id: listing.id } })}>
            <View style={{ paddingTop: 15, paddingBottom: 20, justifyContent: "center", flexDirection: "column" }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 40, paddingHorizontal: 5 }}>
                <ThemedText type="subtitle">Item Information</ThemedText>
                <Ionicons name="chevron-forward" size={24} />
              </View>
            </View>
          </TouchableOpacity>
        )}

      </ScrollView>
    </ThemedView >
  )
}

const styles = StyleSheet.create({
  mainImage: {
    height: 350,
    borderRadius: 20,
  },
  secondaryImages: {
    width: 70,
    height: 70,
    borderRadius: 20,
    marginRight: 10,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailImage: {
    width: 66,
    height: 66,
    borderRadius: 18,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
})
