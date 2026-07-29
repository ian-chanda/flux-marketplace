import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text } from "@react-navigation/elements";
import { useState } from "react";
import { FlatList, Image, Pressable, StatusBar, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const products = [
    { id: 1, name: "Product 1", Desc: 'new', image: 'url', price: "K2" },
    { id: 2, name: "Product 2", Desc: 'pre-owned', image: 'url', price: "K3" },
    { id: 3, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4" },
    { id: 4, name: "Product 4", Desc: 'new', image: 'url', price: "K5" },
]

export default function Index() {
    const [Number, onChangeNumber] = useState('');
    const { colors } = useTheme()

    return (
        <SafeAreaView
            style={{ backgroundColor: colors.background, flex: 1 }}>
            <View style={styles.topBar}>
                <View style={[styles.search_container, { backgroundColor: colors.surface }]}>
                    <TextInput
                        style={[styles.input, { color: colors.text, backgroundColor: colors.surface}]}
                        onChangeText={onChangeNumber}
                        value={Number}
                        placeholderTextColor={colors.background}
                        placeholder="Search.."
                    />

                    <MaterialIcons name="search" size={24} color={colors.accent} />
                </View>
                <View style={styles.cart}>
                    <Pressable onPress={() => alert("cart pressed!")}>
                        <MaterialIcons name="shopping-cart" size={33} color={colors.accent} />
                    </Pressable>
                </View>
            </View>
            <FlatList
                data={products}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={styles.product_bound}>
                        <Image source={{ uri: item.image }} style={styles.image} />
                        <Text style={styles.name_font}>{item.name}</Text>
                        <Text style={styles.desc_font}>{item.Desc}</Text>
                        <Text style={styles.price_font}>{item.price}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 15,
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    safe_area: {
        flex: 1,
        backgroundColor: "#e91e63",
    },
    search_container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        borderRadius: 30,
        paddingHorizontal: 10,
        paddingVertical: 6,
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
    product_bound: {
        flex: 1,
        margin: 10,
        borderRadius: 8

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
        width: 200,
        height: 150,
    }
})

