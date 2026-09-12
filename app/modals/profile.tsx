import { CustomHeader } from "@/components/customHeader"
import { ProductCardV } from "@/components/productCardV"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { getListingsByUser } from "@/services/listings"
import { getUserProfile } from "@/services/users"
import { Listing } from "@/types/listing"
import { UserData } from "@/types/user"
import { MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, Image, ScrollView, StyleSheet, View } from "react-native"

export default function Profile() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams<{ id?: string }>();

    const [seller, setSeller] = useState<UserData | null>(null);
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            if (!id) return;
            try {
                const { data, error: profileError } = await getUserProfile(id);
                if (profileError) throw profileError;
                setSeller(data as UserData);

                const items = await getListingsByUser(id);
                setListings(items);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color={colors.accent} />
            </ThemedView>
        );
    }

    if (error || !seller) {
        return (
            <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
                <CustomHeader title="Seller Profile" showBack />
                <ThemedText type="defaultFaded">Could not load seller profile.</ThemedText>
            </ThemedView>
        );
    }

    const joinedDate = new Date(seller.created_at).toLocaleDateString("en-GB", {
        month: "long",
        year: "numeric",
    });

    return (
        <ThemedView
            style={{
                paddingHorizontal: 10
            }}>
            <CustomHeader
                title="Seller profile"
                showBack />
            <ScrollView
                showsVerticalScrollIndicator={false}>
                <View>
                    <View style={[styles.container, styles.shadow, { backgroundColor: colors.background }]}>
                        <Image
                            source={seller.avatar_url ? { uri: seller.avatar_url } : require("../../assets/images/dino.jpg")}
                            style={styles.profileImage}
                        />
                        <View style={styles.profileInfo}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                <ThemedText type="defaultBold" numberOfLines={1}>
                                    {seller.name ?? "Seller"}
                                </ThemedText>
                                {seller.is_verified && (
                                    <MaterialIcons name="verified" size={15} color={colors.accent} />
                                )}
                            </View>
                            <ThemedText type="defaultSmall">
                                {seller.username ? `@${seller.username}` : ""}
                            </ThemedText>

                            <View style={styles.statRow}>
                                <MaterialIcons name="check-circle" size={15} color={colors.accent} style={styles.statIcon} />
                                <ThemedText type="defaultSmall">
                                    {listings.length} active listing{listings.length !== 1 ? "s" : ""}
                                </ThemedText>
                            </View>
                            <View style={styles.statRow}>
                                <MaterialIcons name="circle" size={15} color={colors.accent} style={styles.statIcon} />
                                <ThemedText type="defaultSmall">
                                    Joined {joinedDate}
                                </ThemedText>
                            </View>
                        </View>
                    </View>

                    <ThemedText type="subtitle" style={{ paddingHorizontal: 15, paddingVertical: 15 }}>
                        Reviews
                    </ThemedText>
                    <View style={{ paddingHorizontal: 15 }}>
                        <ThemedText type="defaultFaded">No reviews yet.</ThemedText>
                    </View>

                    <ThemedText type="subtitle" style={{ paddingHorizontal: 15, paddingVertical: 15 }}>
                        Other Products by seller
                    </ThemedText>
                    <View style={{ paddingHorizontal: 10 }}>
                        {listings.length === 0 ? (
                            <ThemedText type="defaultFaded" style={{ paddingHorizontal: 5 }}>
                                No listings yet.
                            </ThemedText>
                        ) : (
                            <FlatList
                                data={listings}
                                numColumns={2}
                                columnWrapperStyle={{ justifyContent: 'space-between', gap: 10 }}
                                contentContainerStyle={{ gap: 16, paddingBottom: 10 }}
                                scrollEnabled={false}
                                renderItem={({ item }) => (
                                    <ProductCardV
                                        id={item.id}
                                        bookmarked={false}
                                        img={item.images?.[0]}
                                        desc={item.condition ?? item.category}
                                        name={item.title}
                                        price={`K${item.price}`}
                                    />
                                )}
                                keyExtractor={(item) => item.id}
                            />
                        )}
                    </View>
                </View>
            </ScrollView>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    statRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
    },
    statIcon: {
        marginRight: 6,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    profileInfo: {
        flex: 1,
        justifyContent: "center",
        gap: 2,
    },
    container: {
        padding: 16,
        borderRadius: 8,
        margin: 15,
        flexDirection: "row",
    },
})