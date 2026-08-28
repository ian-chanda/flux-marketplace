import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { TopBar } from '@/components/topBar';
import { useTheme } from "@/hooks/useTheme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

type CartItem = {
  id: number;
  name: string;
  image: any;
  price: number;
  postage: number;
};

const initialItems: CartItem[] = [
  { id: 1, name: "Product 1", image: require("../assets/images/ph.jpg"), price: 200, postage: 100 },
  { id: 2, name: "Product 2", image: require("../assets/images/ph.jpg"), price: 300, postage: 100 },
  { id: 3, name: "Product 3", image: require("../assets/images/ph.jpg"), price: 400, postage: 100 },
  { id: 4, name: "Product 4", image: require("../assets/images/ph.jpg"), price: 500, postage: 100 },
];

const formatK = (n: number) => `K${n.toLocaleString("en-ZM")}`;

export default function CartScreen() {
  const { colors } = useTheme();
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const postage = items.reduce((sum, item) => sum + item.postage, 0);
  const total = subtotal + postage;

  const renderRightActions = (id: number) => (
    <PressableDelete onPress={() => removeItem(id)} colors={colors.accent} />
  );

  const renderItem = ({ item }: { item: CartItem }) => (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={() => renderRightActions(item.id)}
      containerStyle={{ backgroundColor: colors.background }}
    >
      <View style={styles.itemContainer}>
        <Image source={item.image} style={styles.image} />
        <View style={styles.itemInfo}>
          <ThemedText type="default" style={{ fontWeight: "bold" }}>{item.name}</ThemedText>
          <ThemedText type="price_font">{formatK(item.price)}</ThemedText>
          <ThemedText type="small_price_font">Postage: {formatK(item.postage)}</ThemedText>
        </View>
      </View>
    </ReanimatedSwipeable>
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background, flex: 1 }}>
      <TopBar title="Cart" />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
      />
      <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
        <View style={{ flexDirection: "column", gap: 10, marginBottom: 30, marginTop: 10 }}>
          <View style={[styles.summaryRow, { borderBottomColor: colors.surface }]}>
            <ThemedText type="defaultSemiBold">Subtotal</ThemedText>
            <ThemedText type="price_font">{formatK(subtotal)}</ThemedText>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: colors.surface }]}>
            <ThemedText type="defaultSemiBold">Postage</ThemedText>
            <ThemedText type="price_font">{formatK(postage)}</ThemedText>
          </View>
          <View style={[styles.summaryRow, { borderBottomColor: colors.surface}]}>
            <ThemedText type="defaultSemiBold">Total</ThemedText>
            <ThemedText type="price_font">{formatK(total)}</ThemedText>
          </View>
        </View>
        <Button title="Checkout" onPress={() => router.push("/payment")} />
      </View>
    </SafeAreaView>
  );
}

const PressableDelete = ({ onPress, colors }: { onPress: () => void; colors: string }) => (
  <Animated.View style={{ backgroundColor: "#e02c1f", width: 80, justifyContent: "center", alignItems: "center" }}>
    <Pressable onPress={onPress} style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
      <MaterialIcons name="delete" size={28} color="#fff" />
      <ThemedText type="smallFaded" style={{ color: "#fff" }}>Remove</ThemedText>
    </Pressable>
  </Animated.View>
);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "transparent",
  },
  itemInfo: {
    marginLeft: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 20
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
});
