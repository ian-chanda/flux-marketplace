import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { TopBar } from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";

const flags = [
    {id: 1, sender: "iLoveBolls", subject: "Iphone 23 Pro max", lastmessage: "How much?", date: "25 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 2, sender: "TechGuy92", subject: "Samsung Galaxy S24", lastmessage: "Is this still available?", date: "24 jun", product: require("@/assets/images/mac.jpg"), profile: require("@/assets/images/jake.jpg")},
    {id: 3, sender: "ShopperQueen", subject: "MacBook Pro 14", lastmessage: "Can you deliver today?", date: "23 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 4, sender: "DealsHunter", subject: "Sony WH-1000XM5", lastmessage: "Lowest price?", date: "22 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 5, sender: "BudgetBuyer", subject: "iPad Air 6", lastmessage: "Any discount for bulk?", date: "21 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 6, sender: "CasualShopper", subject: "AirPods Pro Max", lastmessage: "Do you accept installments?", date: "20 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 7, sender: "LocalBuyer", subject: "Dell XPS 15", lastmessage: "Meet up in Lusaka?", date: "19 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 8, sender: "FastShopper", subject: "Nintendo Switch", lastmessage: "Still available?", date: "18 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 9, sender: "TechLover99", subject: "Canon EOS R6", lastmessage: "What's the lowest you can go?", date: "17 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 10, sender: "SmartBuyer", subject: "Dyson V15", lastmessage: "Is warranty included?", date: "16 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 11, sender: "GamingFanatic", subject: "PS5 Console", lastmessage: "Can you hold it for me?", date: "15 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 12, sender: "OnlinePro", subject: "LG OLED TV 65", lastmessage: "Delivery available?", date: "14 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 13, sender: "PriceChecker", subject: "Apple Watch Ultra", lastmessage: "Best offer?", date: "13 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 14, sender: "EntechLover", subject: "DJI Mini 4 Pro", lastmessage: "Still selling?", date: "12 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
    {id: 15, sender: "MobilePro", subject: "Google Pixel 8", lastmessage: "Any trade-in deals?", date: "11 jun", product: require("@/assets/images/ph.jpg"), profile: require("@/assets/images/pfp.jpg")},
]

export default function Messages () {
    const { colors } = useTheme();
    return (
        <ThemedView
        isTabVisible={false}>
            <TopBar 
            title="Messages"
            showSearch={true}
            showBackButton={false}/>
            <FlatList
            data={flags}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
            <Pressable
            onPress={() => router.push(`/messages/${item.id}`)}>
                    <View
                    style={[styles.itemContainer, { borderBottomColor: colors.surface }]}>
                        <View>
                            <Image source={item.product} style={styles.image}/>
                            <Image source={item.profile} style={styles.avatar}/>
                        </View>
                        <View style={styles.info}>
                            <View style={styles.header}>
                                <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.sender}>
                                    {item.sender}
                                </ThemedText>
                                <ThemedText type="smallFaded">{item.date}</ThemedText>
                            </View>
                            <View style={styles.messageRow}>
                                <MaterialIcons name="done-all" size={14} color={colors.accent} />
                                <ThemedText type="smallFaded" numberOfLines={1} style={styles.lastMessage}>
                                    {item.lastmessage}
                                </ThemedText>
                            </View>
                        </View>
                    </View>
                </Pressable>
            )}/>
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 25,
        marginRight: 20,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 50,
        position: "absolute",
        bottom: 0,
        right: 10,
    },
    info: {
        flex: 1,
        gap: 4,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
    },
    sender: {
        flex: 1,
    },
    messageRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    lastMessage: {
        flex: 1,
    },
})
