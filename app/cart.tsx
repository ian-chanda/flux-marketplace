import Button from "@/components/Button";
import { ThemedText } from "@/components/themed-text";
import { TopBar } from '@/components/topBar';
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { CartItemRow, getCartItems, removeCartItem } from "@/services/cart";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const formatK = (n: number) => `K${n.toLocaleString("en-ZM")}`;

export default function CartScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCart = useCallback(async () => {
    if (!user) return;
    try {
      const rows = await getCartItems(user.id);
      setItems(rows);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [loadCart])
  );

  const removeItem = useCallback(
    async (listingId: string) => {
      if (!user) return;
      setItems(prev => prev.filter(item => item.listing_id !== listingId));
      try {
        await removeCartItem(user.id, listingId);
      } catch {
        loadCart();
      }
    },
    [user, loadCart]
  );

  const subtotal = items.reduce((sum, item) => sum + Number(item.listings.price), 0);

  const renderRightActions = (listingId: string) => (
    <PressableDelete onPress={() => removeItem(listingId)} colors={colors.accent} />
  );

  const renderItem = ({ item }: { item: CartItemRow }) => (
    <ReanimatedSwipeable
      friction={2}
      rightThreshold={40}
      overshootRight={false}
      renderRightActions={() => renderRightActions(item.listing_id)}
      containerStyle={{ backgroundColor: colors.background }}
    >
      <Pressable
        onPress={() => router.push(`/product/${item.listings.id}`)}
        style={styles.itemContainer}
      >
        <Image
          source={item.listings.images?.[0] ? { uri: item.listings.images[0] } : require("../assets/images/ph.jpg")}
          style={styles.image}
        />
        <View style={styles.itemInfo}>
          <ThemedText type="default" style={{ fontWeight: "bold" }}>{item.listings.title}</ThemedText>
          <ThemedText type="price_font">{formatK(Number(item.listings.price))}</ThemedText>
          <ThemedText type="small_price_font">{item.listings.condition ?? "Condition N/A"}</ThemedText>
        </View>
      </Pressable>
    </ReanimatedSwipeable>
  );

  return (
    <SafeAreaView
      style={{ backgroundColor: colors.background, flex: 1 }}>
      <TopBar title="Cart" />
      {loading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : items.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
          <ThemedText type="defaultFaded">Your cart is empty.</ThemedText>
          <Button title="Browse listings" onPress={() => router.push("/")} />
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.listing_id}
            renderItem={renderItem}
            contentContainerStyle={{ flexGrow: 1 }}
          />
          <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
            <View style={{ flexDirection: "column", gap: 10, marginBottom: 30, marginTop: 10 }}>
              <View style={[styles.summaryRow, { borderBottomColor: colors.surface }]}>
                <ThemedText type="defaultSemiBold">Subtotal</ThemedText>
                <ThemedText type="price_font">{formatK(subtotal)}</ThemedText>
              </View>
              <View style={[styles.summaryRow, { borderBottomColor: colors.surface}]}>
                <ThemedText type="defaultSemiBold">Total</ThemedText>
                <ThemedText type="price_font">{formatK(subtotal)}</ThemedText>
              </View>
            </View>
            <Button title="Checkout" onPress={() => router.push("/payment")} />
          </View>
        </>
      )}
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