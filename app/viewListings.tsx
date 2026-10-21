import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { SmallIconButton } from "@/components/small-iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useDeleteListing } from "@/hooks/use-delete-listing";
import { useFetchListings } from "@/hooks/use-fetch-listing";
import { useToggleAvailable } from "@/hooks/use-toggle-available";
import { useTheme } from "@/hooks/useTheme";
import { deleteListing, getListingsByUser, updateListing } from "@/services/listings";
import { Listing } from "@/types/listing";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";

const placeholderImage = require("../assets/images/ph.jpg");

export default function ViewListings() {
    const { colors } = useTheme();
    const router = useRouter();
    const { user } = useAuth();

    // const [listings, setListings] = useState<Listing[]>([]);
    // const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showHidden, setShowHidden] = useState(false);
    const { listingData: listings, loading, refetch, refetching: refreshing } = useFetchListings()
    const { doToggleAvailability } = useToggleAvailable()
    const { doDeleteListing, pending: deleting } = useDeleteListing()

    const handleRefresh = useCallback(() => {
        refetch();
    }, [refetch]);

    const handleGoEdit = (id: string) => {
        console.log("pushing: ",  id)

        router.push({
            pathname: "/addListings",
            params: { listingId: id }
        })
    }

    const getStatus = (isAvailable: boolean) => (isAvailable ? "Active" : "Sold");

    const visibleListings = listings?.filter((item) =>
        showHidden ? !item.is_available : item.is_available
    );
    const hiddenCount = listings?.filter((item) => !item.is_available).length;
    const activeCount = listings?.filter((item) => item.is_available).length;

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

            {!error && (
                <View style={styles.tabs}>
                    <SmallIconButton
                        title={`Active${activeCount && activeCount > 0 ? ` (${activeCount})` : ""}`}
                        isSelected={!showHidden}
                        onPress={() => setShowHidden(false)}
                    />
                    <SmallIconButton
                        title={`Hidden${hiddenCount && hiddenCount > 0 ? ` (${hiddenCount})` : ""}`}
                        isSelected={showHidden}
                        onPress={() => setShowHidden(true)}
                    />
                </View>
            )}

            {error ? (
                <View style={styles.centered}>
                    <MaterialIcons name="error-outline" size={40} color={colors.placeholder} />
                    <ThemedText type="mediumFaded" style={{ textAlign: "center" }}>{error}</ThemedText>
                    <TouchableOpacity
                        onPress={handleRefresh}
                        activeOpacity={0.8}
                        style={[styles.outlineButton, { borderColor: colors.accent, paddingHorizontal: 24 }]}
                    >
                        <ThemedText type="smallBold" style={{ color: colors.accent }}>Retry</ThemedText>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={visibleListings}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        const noImage = !item.images || item.images.length === 0;
                        const imageSource = noImage ? placeholderImage : { uri: item.images[0] };
                        const isAvailable = item.is_available;
                        const isDeleting = doDeleteListing.isPending && doDeleteListing.variables.listing_id === item.id

                        return (
                            <TouchableOpacity
                                disabled={isDeleting}
                                activeOpacity={0.9}
                                onPress={() => router.push(`/product/${item.id}`)}
                                style={[styles.card, { backgroundColor: isDeleting ? colors.disabled : colors.surface }, isDeleting && { opacity: 0.5 }]}
                            >
                                <Image
                                    source={imageSource}
                                    style={[styles.image, !isAvailable && { opacity: 0.5 }]}
                                />

                                <View style={styles.info}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <ThemedText type="defaultSemiBold" numberOfLines={2}>
                                            {item.title}
                                        </ThemedText>
                                        <View style={styles.statusRow}>
                                            <View
                                                style={[
                                                    styles.dot,
                                                    { backgroundColor: isAvailable ? colors.success : colors.placeholder },
                                                ]}
                                            />
                                            <ThemedText type="smallFaded">{getStatus(isAvailable)}</ThemedText>
                                        </View>
                                    </View>


                                    <ThemedText type="defaultBold" style={{ color: colors.accent }}>
                                        K{item.price.toLocaleString()}
                                    </ThemedText>

                                    <View style={styles.actions} pointerEvents={isDeleting ? "none" : "auto"}>
                                        <TouchableOpacity
                                            disabled={isDeleting}
                                            activeOpacity={0.6}
                                            onPress={() => doToggleAvailability.mutate({ id: item.id, availability: !item.is_available })}
                                            style={[styles.outlineButton, { borderColor: colors.accent, flex: 1 }]}
                                        >
                                            <ThemedText
                                                type="smallBold"
                                                numberOfLines={1}
                                                style={{ color: colors.accent }}
                                            >
                                                {isDeleting ? "deleting..." : isAvailable ? "Mark as unavailable" : "Mark as available"}
                                            </ThemedText>
                                        </TouchableOpacity>

                                        <IconButton
                                            icon="edit"
                                            onPress={() => handleGoEdit(item.id)}
                                            badgeValue=""
                                        />
                                        <IconButton
                                            icon="delete-outline"
                                            onPress={() => doDeleteListing.mutate({ listing_id: item.id })}
                                            badgeValue=""
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.accent} />
                    }
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <MaterialIcons name="inventory-2" size={40} color={colors.placeholder} />
                            <ThemedText type="mediumFaded">
                                {showHidden ? "No hidden listings." : "You have no active listings yet."}
                            </ThemedText>
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
        gap: 12,
        padding: 20,
    },
    tabs: {
        flexDirection: "row",
        gap: 10,
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    list: {
        gap: 10,
        padding: 10,
        paddingBottom: 30,
        flexGrow: 1,
    },
    empty: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingTop: 60,
    },
    card: {
        flexDirection: "row",
        gap: 12,
        padding: 10,
        borderRadius: 16,
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 12,
    },
    info: {
        flex: 1,
        gap: 3,
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginTop: "auto",
        paddingTop: 8,
    },
    outlineButton: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 10,
        borderWidth: 1,
    },
    deleteButton: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        borderWidth: 1,
    },
});
