import { ThemedText } from "@/components/themed-text";
import { TopBar } from "@/components/topBar";
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
        <SafeAreaView>
            <TopBar 
            title="Messages"
            showSearch={true}
            showBackButton={false}/>
            <FlatList
            data={flags}
            renderItem={({ item }) => (
            <Pressable
            onPress={() => router.push("/messages/${item.id}")}>
                    <View
                    style={{flexDirection: "column"}}>
                        <View
                        style={[styles.itemContainer, {borderBlockColor: colors.surface}]}>
                            <View>
                                <Image source={item.product} style={styles.image}/>
                                <View>
                                    <Image source={item.profile} style={{width: 30, height: 30, borderRadius: 50, position: "absolute", bottom: 0, right: 10}}/>
                                </View>
                            </View>
                            <View
                            style={{flexDirection: "column"}}>
                                <View
                                style = {{flexDirection: "row"
                                }}>
                                    <View 
                                    style={{flexDirection:"row"}}>
                                        <ThemedText type="defaultSemiBold">{item.sender}</ThemedText>
                                    </View>
                                    <View
                                    style={{position: "absolute", left: 230}}>
                                        <ThemedText type="defaultSemiBold">{item.date}</ThemedText>
                                    </View>
                                </View>
                                <View style={{flexDirection: "row", width: "90%"}}>
                                    {/*Logic for read and delivered...should be herrrrrrr*/}
                                    <MaterialIcons name="done-all" size={13} color={colors.accent} style={{paddingTop: 8, paddingRight: 10}}/>
                                    <ThemedText>{item.lastmessage}</ThemedText>
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
