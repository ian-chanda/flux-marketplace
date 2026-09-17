import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { ProductCardV } from "@/components/productCardV";
import { SearchBarButton } from "@/components/searchBarButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useListings } from "@/hooks/useListings";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/auth-context";
import { getSavedListingIds, saveListing, unsaveListing } from "@/services/savedListings";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";

type buttonTypes = {
    icon: any;
    title: string;
}

const SmallIconButton = ({ icon, title }: buttonTypes) => {
    const { colors } = useTheme()

    return (
        <TouchableOpacity style={{
            flexShrink: 0,
            flexDirection: 'row',
            paddingHorizontal: 10,
            height: 35,
            gap: 3,
            alignItems: 'center',
            backgroundColor: colors.surface,
            borderRadius: 100,
        }}>
            <MaterialIcons name={icon} size={18} color={colors.accent} />
            <ThemedText type="mediumFaded">{title}</ThemedText>
        </TouchableOpacity>
    )
}

export default function Index() {
    const { colors } = useTheme()
    const { listings, loading, refreshing, error, load, refresh } = useListings();
    const { user } = useAuth();
    const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
    const isFirstFocus = useRef(true);

    const loadSaved = useCallback(async () => {
        if (!user) return;
        try {
            const ids = await getSavedListingIds(user.id);
            setBookmarked(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {}));
        } catch {
            setBookmarked({});
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadSaved();
            if (isFirstFocus.current) {
                isFirstFocus.current = false;
                return;
            }
            load(true);
        }, [load, loadSaved])
    );

    const toggleBookmark = useCallback(async (id: string) => {
        if (!user) return;

        const next = !bookmarked[id];
        setBookmarked(prev => ({ ...prev, [id]: next }));

        try {
            if (next) {
                await saveListing(user.id, id);
            } else {
                await unsaveListing(user.id, id);
            }
        } catch {
            setBookmarked(prev => ({ ...prev, [id]: !next }));
        }
    }, [user, bookmarked]);

    return (
        <ThemedView isTabVisible={true}>
            <CustomHeader>
                <SearchBarButton placeholder="search..." width={'85%'} />
                <IconButton icon={"shopping-cart"} badgeValue="3" onPress={() => router.push("/cart")} />
            </CustomHeader>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                style={{
                    flexGrow: 0,
                    paddingVertical: 10,
                }} contentContainerStyle={{
                    paddingHorizontal: 5,
                    gap: 10
                }}
            >
                <SmallIconButton icon="favorite-outline" title="saved" />
                <SmallIconButton icon="sell" title="selling" />
                <SmallIconButton icon="sell" title="phones" />
                <SmallIconButton icon="sell" title="gaming" />
            </ScrollView>

            <View style={{ paddingHorizontal: 10, flex: 1 }}>
                {loading ? (
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={colors.accent} />
                    </View>
                ) : error ? (
                    <View style={styles.center}>
                        <ThemedText type="defaultFaded">Could not load listings</ThemedText>
                        <TouchableOpacity onPress={refresh} style={{ marginTop: 10 }}>
                            <ThemedText type="defaultBold" style={{ color: colors.accent }}>Try again</ThemedText>
                        </TouchableOpacity>
                    </View>
                ) : listings.length === 0 ? (
                    <View style={styles.center}>
                        <ThemedText type="defaultFaded">No listings yet. Be the first to post one!</ThemedText>
                    </View>
                ) : (
                    <FlatList
                        data={listings}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between', gap: 10 }}
                        contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
                        }
                        renderItem={({ item }) => (
                            <ProductCardV
                                id={item.id}
                                bookmarked={bookmarked[item.id]}
                                img={item.images?.[0]}
                                desc={item.condition ?? item.category}
                                name={item.title}
                                price={`K${item.price}`}
                                onBookmark={() => toggleBookmark(item.id)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                )}
            </View>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    safe_area: {
        flex: 1,
        backgroundColor: "#e91e63",
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    search_container: {
        width: '90%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    search_icon: {
        position: "absolute",
        right: 7,
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 12,
        alignItems: 'center',
        width: "100%",
        borderRadius: 20,
    },
    cart: {
        alignItems: "flex-start",
        marginBottom: 2,
    },
    scroll_container: {
        paddingTop: StatusBar.currentHeight,
    },
    product_card: {
        width: '45%',
        borderRadius: 8,
    },
    name_font: {
        fontSize: 20,
        fontWeight: "bold",
    },
    desc_font: {
        fontSize: 10,
        color: "gray",
    },
    price_font: {
        fontSize: 15,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
})