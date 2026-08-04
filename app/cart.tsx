import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { TopBar } from '@/components/topBar';
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const items = [
  { id: 1, name: "Product 1", image: require("../assets/images/ph.jpg"), price: "K200", postage: "K100" },
  { id: 2, name: "Product 2", image: require("../assets/images/ph.jpg"), price: "K300", postage: "K100" },
  { id: 3, name: "Product 3", image: require("../assets/images/ph.jpg"), price: "K400", postage: "K100" },
  { id: 4, name: "Product 4", image: require("../assets/images/ph.jpg"), price: "K500", postage: "K100" },
]

export default function CartScreen() {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background, flex: 1 }}>
        {/*Top bar*/}
        <TopBar title="Cart" />
      {/*Item scrollable*/}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.itemInfo}>
              <ThemedText type="default" style={{fontWeight: "bold"}}>{item.name}</ThemedText>
              <ThemedText type="price_font">{item.price}</ThemedText>
              <ThemedText type="small_price_font">Postage: {item.postage}</ThemedText>
            </View>
                <View style={{ paddingLeft: 110}}>
                <Pressable onPress={()=> alert('Item deleted')}>
                <MaterialIcons name="delete" size={25} color={colors.accent}/>
                </Pressable>
              </View>
          </View>
        )}
      />
      <View>
        {/*Summary Section*/}
        <View>
          <View style={{ flexDirection: "column",gap: 10, paddingHorizontal: 20, marginBottom: 30, marginTop: 10}}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.surface }}>
              <ThemedText type="defaultSemiBold">Subtotal</ThemedText>
              <ThemedText type="price_font">K200</ThemedText>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.surface }}>
              <ThemedText type="defaultSemiBold">Postage</ThemedText>
              <ThemedText type="price_font">K400</ThemedText>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.surface }}>
              <ThemedText type="defaultSemiBold">Total</ThemedText>
              <ThemedText type="price_font">K300</ThemedText>
            </View>
          </View>
          </View>
          <Button title="Checkout" onPress={() => router.push("/payment")} />
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    //flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  font: {
    fontSize: 20,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemInfo: {
    marginLeft: 20,
  },
  name_font: {
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    flex: 1,
    position: "absolute",
    left: 10,
  },
  flatlist: {
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
  },
  
});
