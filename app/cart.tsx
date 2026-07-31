import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
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
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="chevron-left" size={33} color="black" />
        </Pressable>
        <Text style={[styles.font, { fontSize: 18}]}>Your Cart</Text>
      </View>
      {/*Item scrollable*/}
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.itemInfo}>
              <Text style={styles.name_font}>{item.name}</Text>
              <Text style={styles.price_font}>{item.price}</Text>
              <Text style={styles.postage_font}>{item.postage}</Text>
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
              <Text style={[styles.price_font, { fontSize: 16 }]}>Subtotal</Text>
              <Text style={[styles.price_font, { fontSize: 16 }]}>K500</Text>

            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.surface }}>
              <Text style={[styles.price_font, { fontSize: 16 }]}>Postage</Text>
              <Text style={[styles.price_font, { fontSize: 16 }]}>K100</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.surface }}>
              <Text style={[styles.price_font, { fontSize: 16 }]}>Total</Text>
              <Text style={[styles.price_font, { fontSize: 16 }]}>K600</Text>
            </View>
          </View>
          </View>
            <View style={[styles.button, { backgroundColor: colors.accent }]}>
            <Pressable onPress={() => alert('Proceeding to checkout...')}>
            <Text style={[styles.buttonText, { color: colors.background }]}>Checkout</Text>
            </Pressable>
          </View>
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
  price_font: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
  postage_font: {
    fontSize: 10,
    color: "gray",
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
      //Buttom Styles
    button: {
        paddingVertical: 20,
        paddingHorizontal: 100,
        borderRadius: 60,
        alignItems: "center",
        marginTop: 10,
        alignSelf: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
