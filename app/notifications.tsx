import { ThemedText } from "@/components/themed-text";
import { TopBar } from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";
import { router } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const notifications = [
    {id: 1, icon: require("../assets/images/pfp.jpg"), header: "Price drop", content: "Take a look at how this looks. Did you know you can list multple items at once"},
    {id: 2, icon: require("../assets/images/pfp.jpg"), header: "New message", content: "TechGuy92 sent you a message about the Samsung Galaxy S24"},
    {id: 3, icon: require("../assets/images/pfp.jpg"), header: "Sale alert", content: "Your MacBook Pro listing is getting lots of views today!"},
    {id: 4, icon: require("../assets/images/pfp.jpg"), header: "Order confirmed", content: "Your payment for K5,000 has been confirmed. Order ID: #12345"},
    {id: 5, icon: require("../assets/images/pfp.jpg"), header: "Listing active", content: "Your Dell XPS 15 listing is now live and visible to buyers"},
    {id: 6, icon: require("../assets/images/pfp.jpg"), header: "New inquiry", content: "ShopperQueen is asking if you can deliver the AirPods Pro Max"},
    {id: 7, icon: require("../assets/images/pfp.jpg"), header: "Payment received", content: "You received K4,800 from LocalBuyer for Dell XPS 15"},
    {id: 8, icon: require("../assets/images/pfp.jpg"), header: "Low inventory", content: "You have only 2 items left in stock for Nintendo Switch"},
    {id: 9, icon: require("../assets/images/pfp.jpg"), header: "Review received", content: "DealsHunter left a 5-star review for your Sony WH-1000XM5"},
    {id: 10, icon: require("../assets/images/pfp.jpg"), header: "Bundle offer", content: "Bundle your items and get 15% discount on shipping"}
]

export default function Notifications () {
    const { colors } = useTheme();
    return (
        <SafeAreaView>
            <TopBar 
            title="Notifications"/>
            <FlatList
            data={notifications}
            renderItem={({ item }) => (
            <Pressable
            onPress={() => router.push("/messages/${item.id}")}>
                    <View
                    style={{flexDirection: "column"}}>
                        <View
                        style={styles.itemContainer}>
                            <View>
                                <Image source={item.icon} style={styles.image}/>
                            </View>
                            <View
                            style={{flexDirection: "column"}}>
                                <View
                                style = {{flexDirection: "row"
                                }}>
                                    <View 
                                    style={{flexDirection:"row"}}>
                                        <ThemedText type="defaultSemiBold">{item.header}</ThemedText>
                                    </View>
                                </View>
                                <View style={{flexDirection: "row", width: "90%"}}>
                                    <ThemedText>{item.content}</ThemedText>
                                </View>
                            </View>
                        </View>
                    </View>
                </Pressable>
            )}/>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 20
  }
})
