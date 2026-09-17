import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/auth-context";
import { deleteListing, getListingsByUser, updateListing } from "@/services/listings";
import { Listing } from "@/types/listing";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";

const placeholderImage = require("../assets/images/ph.jpg");

export default function ViewListings() {
    const { colors } = useTheme();
    const router = useRouter();
    const { user } = useAuth();

    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadListings = useCallback(async () => {
        if (!user) return;

        try {
            const data = await getListingsByUser(user.id);
            setListings(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load listings");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    const handleRefresh = useCallback(() => {
        setRefreshing(true);
        loadListings();
    }, [loadListings]);

    const handleToggleAvailability = useCallback(async (listing: Listing) => {
        const newValue = !listing.is_available;

        try {
            await updateListing(listing.id, { is_available: newValue });
            setListings((prev) =>
                prev.map((item) => (item.id === listing.id ? { ...item, is_available: newValue } : item))
            );
        } catch (err) {
            Alert.alert("Error", err instanceof Error ? err.message : "Failed to update listing");
        }
    }, []);

    const handleDelete = useCallback((listing: Listing) => {
        Alert.alert(
            "Delete listing",
            `Are you sure you want to delete "${listing.title}"? This cannot be undone.`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteListing(listing.id);
                            setListings((prev) => prev.filter((item) => item.id !== listing.id));
                        } catch (err) {
                            Alert.alert("Error", err instanceof Error ? err.message : "Failed to delete listing");
                        }
                    },
                },
            ]
        );
    }, []);

    const formatPrice = (price: number) => `K${Number(price).toLocaleString()}`;
    const getStatus = (isAvailable: boolean) => (isAvailable ? "Active" : "Sold");

    if (loading) {
        return (
            <ThemedView isTabVisible={false} style={{ paddingBottom: 10 }}>
                <CustomHeader title="Your listings" showBack={true} />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={colors.accent} />
                </View>
            </ThemedView>
        );
    }

    return (
        <ThemedView isTabVisible={false} style={{ paddingBottom: 10 }}>
            <CustomHeader title="Your listings" showBack={true} />
            {error ? (
                <View style={styles.centered}>
                    <ThemedText type="mediumFaded">{error}</ThemedText>
                    <TouchableOpacity onPress={handleRefresh} activeOpacity={0.8}>
                        <ThemedText type="mediumBold" style={{ color: colors.accent, marginTop: 10 }}>
                            Retry
                        </ThemedText>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={listings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const nothingImages = !item.images || item.images.length === 0;
                        const imageSource = nothingImages ? placeholderImage : { uri: item.images[0] };
                        const isAvailable = item.is_available;

                        return (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => router.push(`/product/${item.id}`)}
                            >
                                <View style={{ flexDirection: "column" }}>
                                    <View style={[styles.itemContainer, { borderBottomColor: colors.surface }]}>
                                        <View>
                                            <Image source={imageSource} style={styles.image} />
                                        </View>
                                        <View style={{ flexDirection: "column", flex: 1 }}>
                                            <View style={{ flexDirection: "row" }}>
                                                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                                            </View>
                                            <View style={{ flexDirection: "row", width: "100%" }}>
                                                <ThemedText type="mediumFaded">
                                                    {formatPrice(item.price)} | {getStatus(isAvailable)}
                                                </ThemedText>
                                            </View>
                                            <View style={{ justifyContent: "center", margin: 10 }}>
                                                <View
                                                    style={{
                                                        backgroundColor: colors.accent,
                                                        justifyContent: "center",
                                                        borderRadius: 8,
                                                        padding: 9,
                                                        margin: 10,
                                                        marginBottom: -5,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        activeOpacity={0.15}
                                                        onPress={() => handleToggleAvailability(item)}
                                                    >
                                                        <ThemedText type="mediumBold">
                                                            {isAvailable ? "Mark as unavailable" : "Mark as available"}
                                                        </ThemedText>
                                                    </TouchableOpacity>
                                                </View>
                                                <View
                                                    style={{
                                                        backgroundColor: colors.accent,
                                                        justifyContent: "center",
                                                        borderRadius: 8,
                                                        padding: 9,
                                                        margin: 10,
                                                        paddingLeft: 20,
                                                    }}
                                                >
                                                    <TouchableOpacity
                                                        activeOpacity={0.15}
                                                        onPress={() => handleDelete(item)}
                                                    >
                                                        <ThemedText type="mediumBold">Delete listing</ThemedText>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />}
                    ListEmptyComponent={
                        <View style={styles.centered}>
                            <ThemedText type="mediumFaded">You have no listings yet.</ThemedText>
                        </View>
                    }
                />
            )}
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        paddingTop: 40,
    },
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 25,
        marginRight: 20,
    },
    fabContainer: {
        position: "absolute",
        bottom: 30,
        right: 30,
        marginBottom: 40,
        marginTop: 10,
        borderRadius: 30,
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});