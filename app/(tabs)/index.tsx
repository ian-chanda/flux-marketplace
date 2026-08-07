import { BookmarkBadge } from "@/components/bookmark-badge";
import { SearchBarButton } from "@/components/searchBarButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@react-navigation/elements";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { FlatList, Image, Pressable, StatusBar, StyleSheet, TextInput, View } from "react-native";

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
            <MaterialIcons name={icon} size={20} color={colors.accent} />
            <ThemedText>{title}</ThemedText>
        </TouchableOpacity>
    )
}

const products = [
    { id: 1, name: "Product THREEE HUNDRED AND NIGETU", Desc: 'new', image: 'url', price: "K2" },
    { id: 2, name: "Product 2", Desc: 'pre-owned', image: 'url', price: "K3" },
    { id: 3, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4" },
    { id: 4, name: "Product 4", Desc: 'new', image: 'url', price: "K5" },
    { id: 5, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4" },
    { id: 6, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4" },
    { id: 7, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4" },
]

export default function Index() {
    const { colors } = useTheme()
    const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});

    const toggleBookmark = (id: number) => {
        setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <ThemedView isTabViisble={true}>

            <View style={styles.topBar}>
                <SearchBarButton placeholder="search..." width={'85%'} />
                <View style={styles.cart}>
                    <Pressable onPress={() => router.push('/cart')}>
                        <MaterialIcons name="shopping-cart" size={33} color={colors.accent} />
                        {/* badge */}
                        <View style={{
                            position: 'absolute',
                            backgroundColor: colors.accent,
                            top: -10,
                            right: -10,
                            borderRadius: 100,
                            width: 20,
                            height: 20,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ThemedText type="defaultSmall" style={{ color: colors.background }}>3</ThemedText>
                        </View>
                    </Pressable>
                </View>
            </View>


            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal 
                style={{ 
                    flexGrow: 0,
                    paddingVertical: 10
                }} contentContainerStyle={{ gap: 10 }}
            >
                <SmallIconButton icon="favorite-outline" title="saved" />
                <SmallIconButton icon="sell" title="selling" />
                <SmallIconButton icon="sell" title="bitches" />
                <SmallIconButton icon="sell" title="selling" />
                <SmallIconButton icon="sell" title="selling" />
            </ScrollView>


            <View style={{paddingHorizontal: 10, flex: 1}}>
                <FlatList
                    data={products}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                    contentContainerStyle={{ gap: 16 }}
                    renderItem={({ item }) => (
                        <View style={styles.product_card}>

                            <View>
                                <BookmarkBadge
                                    bookmarked={bookmarked[item.id]}
                                    onPress={() => toggleBookmark(item.id)}
                                />
                                <Image
                                    source={require('../../assets/images/dino.jpg')}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            </View>

                            <ThemedText type="small_price_font">{item.Desc}</ThemedText>
                            <ThemedText type="subtitle" numberOfLines={1}>{item.name}</ThemedText>
                            <ThemedText type="price_font" >{item.price}</ThemedText>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
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
        //flex: 1,
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

