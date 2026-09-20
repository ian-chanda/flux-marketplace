import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { ProductCardV } from "@/components/productCardV";
import { SearchBarButton } from "@/components/searchBarButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useListings } from "@/hooks/useListings";
import { useTheme } from "@/hooks/useTheme";
import { useAuth } from "@/contexts/auth-context";
import { getCartCount } from "@/services/cart";
import { getSavedListingIds, saveListing, unsaveListing } from "@/services/savedListings";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from "react-native";
import { categories } from "@/lib/categories";

type buttonTypes = {
    icon: any;
    title: string;
    active?: boolean;
    onPress?: () => void;
}

const SmallIconButton = ({ icon, title, active, onPress }: buttonTypes) => {
    const { colors } = useTheme()

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexShrink: 0,
                flexDirection: 'row',
                paddingHorizontal: 10,
                height: 35,
                gap: 3,
                alignItems: 'center',
                backgroundColor: colors.surface,
                borderRadius: 100,
                borderWidth: active ? 1.5 : 0,
                borderColor: active ? colors.accent : "transparent",
            }}>
            <Ionicons name={icon} size={18} color={active ? colors.accent : colors.placeholder} />
            <ThemedText type="mediumFaded" style={active ? { color: colors.accent } : undefined}>{title}</ThemedText>
        </TouchableOpacity>
    )
}

export default function Index() {
    const { colors } = useTheme()
    const { listings, loading, refreshing, error, load, refresh } = useListings();
    const { user } = useAuth();
const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
const [cartCount, setCartCount] = useState(0);
const [activeFilter, setActiveFilter] = useState<string | null>(null);
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

    const loadCartCount = useCallback(async () => {
        if (!user) return;
        try {
            setCartCount(await getCartCount(user.id));
        } catch {
            setCartCount(0);
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
            loadSaved();
            loadCartCount();
            if (isFirstFocus.current) {
                isFirstFocus.current = false;
                return;
            }
            load(true);
        }, [load, loadSaved, loadCartCount])
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

    const toggleFilter = useCallback((filter: string | null) => {
        setActiveFilter(prev => (prev === filter ? null : filter));
    }, []);

    const filteredListings = activeFilter
        ? listings.filter((item) => {
            if (activeFilter === "saved") return !!bookmarked[item.id];
            if (activeFilter === "selling") return item.user_id === user?.id;
            return item.category === activeFilter;
        })
        : listings;

    return (
        <ThemedView isTabVisible={true}>
            <CustomHeader>
                <SearchBarButton placeholder="search..." width={'85%'} />
                <IconButton icon={"shopping-cart"} badgeValue={cartCount ? String(cartCount) : ""} onPress={() => router.push("/cart")} />
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
                <SmallIconButton icon="bookmark-outline" title="saved" active={activeFilter === "saved"} onPress={() => toggleFilter("saved")} />
                <SmallIconButton icon="pricetag-outline" title="selling" active={activeFilter === "selling"} onPress={() => toggleFilter("selling")} />
                {categories.map((category) => (
                    <SmallIconButton
                        key={category.name}
                        icon={category.icon as any}
                        title={category.pill}
                        active={activeFilter === category.name}
                        onPress={() => toggleFilter(category.name)}
                    />
                ))}
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
                ) : filteredListings.length === 0 ? (
                    <View style={styles.center}>
                        <ThemedText type="defaultFaded">No {activeFilter} listings found.</ThemedText>
                    </View>
                ) : (
                    <FlatList
                        data={filteredListings}
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