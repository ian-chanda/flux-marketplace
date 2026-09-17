import Button from "@/components/Button";
import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { getListing } from "@/services/listings";
import { getSavedListingIds, saveListing, unsaveListing } from "@/services/savedListings";
import { getUserProfile } from "@/services/users";
import { Listing } from "@/types/listing";
import { UserData } from "@/types/user";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const attributeLabels: Record<string, string> = {
  brand: "Brand",
  model: "Model",
  ram: "RAM",
  storage: "Storage",
  color: "Color",
};

export default function Product() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const [listing, setListing] = useState<Listing | null>(null);
    const [seller, setSeller] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [saved, setSaved] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        async function load() {
            if (!id) return;
            try {
                const listingData = await getListing(id);
                setListing(listingData);

                try {
                    const { data: sellerData } = await getUserProfile(listingData.user_id);
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
            <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color={colors.accent} />
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
        <ThemedView
            style={{
                paddingHorizontal: 10,
                paddingBottom: 60
            }}>
            <CustomHeader
                showBack
            >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <IconButton icon={saved ? "bookmark" : "bookmark-outline"} badgeValue="" onPress={toggleSave} />
                    <IconButton icon={"share"} onPress={() => router.push('/notifications')} badgeValue="" />
                    <IconButton icon={"shopping-cart"} onPress={() => router.push('/cart')} badgeValue='2' />
                </View>
            </CustomHeader>
            <ScrollView showsVerticalScrollIndicator={false}>
                {images.length > 0 && (
                    <>
                        <FlatList
                            horizontal
                            data={images}
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.mainImage} resizeMode="cover" />
                            )}
                            keyExtractor={(item, index) => `${item}-${index}`}
                        />
                        <FlatList
                            horizontal
                            data={images}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <Image source={{ uri: item }} style={styles.secondaryImages} resizeMode="cover" />
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
                    <ThemedText style={{ paddingVertical: 10 }} type="subtitle">
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

                <TouchableOpacity
                    onPress={() => router.push({ pathname: "/modals/profile", params: { id: listing.user_id } })}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 12,
                        borderRadius: 15,
                        backgroundColor: colors.surface,
                        justifyContent: 'space-between',
                        marginVertical: 15
                    }}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <Image
                            source={seller?.avatar_url ? { uri: seller.avatar_url } : require('@/assets/images/dino.jpg')}
                            style={styles.avatar}
                        />
                        <View style={{ gap: 2 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                                <ThemedText type="defaultBold" numberOfLines={1}>
                                    {seller?.name ?? "Seller"}
                                </ThemedText>
                                {seller?.is_verified && (
                                    <MaterialIcons name="verified" size={15} color={colors.accent} />
                                )}
                            </View>
                            <ThemedText type="smallFaded">
                                {seller?.username ? `@${seller.username}` : "Flux seller"}
                            </ThemedText>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#D4D4D4" />
                </TouchableOpacity>

                <ThemedText type="default" style={{ paddingBottom: 15 }}>
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

                <Button
                    title="Buy Now"
                    onPress={() => router.push("/payment")}
                />

                <Button
                    title="Add to Cart"
                    onPress={() => router.push("/payment")}
                />
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    mainImage: {
        width: 360,
        height: 350,
        borderRadius: 20,
        marginRight: 10,
    },
    secondaryImages: {
        width: 70,
        height: 70,
        borderRadius: 20,
        marginRight: 10,
        marginVertical: 10,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
})