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
  const [addingToCart, setAddingToCart] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const mainListRef = useRef<FlatList | null>(null);
  const { user } = useAuth();
  const { createChannel, isPending } = useCreateChannel();

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

  const handleCart = async () => {
    if (inCart) return router.push("/cart");
    if (!user) return alert("Please sign in first");

    setAddingToCart(true);
    try {
      await addToCart(user.id, id);
      setInCart(true);
      setCartCount((c) => c + 1);
    } catch {
      alert("Could not add to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <ThemedView isTabVisible={false}>
        <CustomHeader showBack>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <IconButton icon={"shopping-cart"} onPress={() => router.push("/cart")} badgeValue={cartCount ? String(cartCount) : ""} />
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
  const isOwner = user?.id === listing.user_id;

  return (
    <ThemedView isTabVisible={false}>
      <CustomHeader showBack>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
          <IconButton icon={saved ? "bookmark" : "bookmark-outline"} badgeValue="" onPress={toggleSave} />
          <IconButton icon={"share"} onPress={() => router.push("/notifications")} badgeValue="" />
          <IconButton icon={"shopping-cart"} onPress={() => router.push("/cart")} badgeValue={cartCount ? String(cartCount) : ""} />
        </View>
      </CustomHeader>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        {/* gallery */}
        {images.length > 0 && (
          <View>
            <FlatList
              horizontal
              data={images}
              pagingEnabled
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
            {images.length > 1 && (
              <FlatList
                horizontal
                data={images}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingTop: 10 }}
                renderItem={({ item, index }) => (
                  <Pressable
                    onPress={() => mainListRef.current?.scrollToIndex({ index, animated: true })}
                    style={[styles.secondaryImages, { borderColor: index === activeImage ? colors.accent : "transparent" }]}
                  >
                    <Image source={{ uri: item }} style={styles.thumbnailImage} resizeMode="cover" />
                  </Pressable>
                )}
                keyExtractor={(item, index) => `thumb-${item}-${index}`}
              />
            )}
          </View>
        )}

        {/* title block */}
        <View style={{ gap: 4 }}>
          <ThemedText type="subtitle" style={{ color: colors.accent }}>
            K{listing.price.toLocaleString()}
          </ThemedText>
          <ThemedText type="subtitle">{listing.title}</ThemedText>

          <View style={styles.metaRow}>
            {listing.location && (
              <View style={styles.metaItem}>
                <MaterialIcons name="place" size={16} color={colors.placeholder} />
                <ThemedText type="defaultFaded">{listing.location}</ThemedText>
              </View>
            )}
            {listing.condition && (
              <View style={[styles.pill, { backgroundColor: colors.surface }]}>
                <ThemedText type="smallFaded">{listing.condition}</ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* specs */}
        {attributes.length > 0 && (
          <View style={styles.pills}>
            {attributes.map(([key, value]) => (
              <View key={key} style={[styles.pill, { backgroundColor: colors.surface }]}>
                <ThemedText type="smallFaded">
                  {attributeLabels[key] ?? key}: {String(value)}
                </ThemedText>
              </View>
            ))}
          </View>
        )}

        {/* description */}
        <View style={{ gap: 6 }}>
          <ThemedText type="defaultBold">Description</ThemedText>
          <ThemedText type="default">{listing.description}</ThemedText>
        </View>

        {/* seller */}
        <View style={[styles.sellerCard, { backgroundColor: colors.surface }]}>
          <PfpRowItem
            imageUrl={seller?.avatar_url ? `${seller.avatar_url}?v=${seller.updated_at}` : ""}
            fName={seller?.first_name ?? "unknown"}
            lName={seller?.last_name ?? "unknown"}
            username={seller?.username ?? "unknown123"}
            isVerified={seller?.is_verified ?? false}
            onPress={() => router.push({ pathname: "/modals/profile", params: { id: listing.user_id } })}
          />
          {!isOwner && (
            <TouchableOpacity
              disabled={isPending}
              onPress={() =>
                createChannel.mutate({
                  recipient: listing.user_id,
                  listing_id: listing.id,
                  subject: listing.title,
                })
              }
              style={[styles.contactButton, { borderColor: colors.accent }]}
            >
              {isPending ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <>
                  <MaterialIcons name="chat-bubble-outline" size={18} color={colors.accent} />
                  <ThemedText type="defaultBold" style={{ color: colors.accent }}>
                    Message seller
                  </ThemedText>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* more info */}
        {attributes.length > 0 && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/modals/itemInformation", params: { id: listing.id } })}
            style={[styles.infoRow, { backgroundColor: colors.surface }]}
          >
            <ThemedText type="defaultBold">Item information</ThemedText>
            <Ionicons name="chevron-forward" size={20} color={colors.placeholder} />
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* buying actions stay in reach while scrolling */}
      {!isOwner && (
        <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.surface }]}>
          <TouchableOpacity
            onPress={handleCart}
            disabled={addingToCart}
            style={[styles.cartButton, { borderColor: colors.accent }]}
          >
            {addingToCart ? (
              <ActivityIndicator size="small" color={colors.accent} />
            ) : (
              <ThemedText type="defaultBold" style={{ color: colors.accent }}>
                {inCart ? "View cart" : "Add to cart"}
              </ThemedText>
            )}
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Button
              title="Buy now"
              onPress={() => router.push({ pathname: "/payment", params: { listingId: id } })}
            />
          </View>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 10,
    paddingBottom: 24,
    gap: 18,
  },
  mainImage: {
    height: 350,
    borderRadius: 20,
  },
  secondaryImages: {
    width: 70,
    height: 70,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbnailImage: {
    width: 62,
    height: 62,
    borderRadius: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 2,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  pills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  sellerCard: {
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  cartButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
});
