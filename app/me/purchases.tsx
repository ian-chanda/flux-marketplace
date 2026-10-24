import { CustomHeader } from "@/components/customHeader";
import { CustomSearchBar } from "@/components/customSearchBar";
import { SmallIconButton } from "@/components/small-iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { categories } from "@/lib/categories";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { getOrders, Order } from "@/services/orders";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

const formatK = (n: number) => `K${Number(n).toLocaleString("en-ZM")}`;

export default function Purchases() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    if (!user) return;

    try {
      setOrders(await getOrders(user.id));
      setError(false);
    } catch {
      setOrders([]);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrders();
  }, [loadOrders]);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const term = searchValue.trim().toLowerCase();

  const filtered = orders
    .map((order) => ({
      order,
      items: order.order_items.filter(
        (item) =>
          (!term || item.title.toLowerCase().includes(term)) &&
          (!category || (item.listings?.category ?? "") === category)
      ),
    }))
    .filter((row) => row.items.length > 0);

  return (
    <ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, paddingBottom: 0 }}>
      <CustomHeader title="Purchases" showBack />
      <CustomSearchBar
        width={"100%"}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={() => {}}
      />

      <ScrollView
        showsHorizontalScrollIndicator={false}
        horizontal
        style={{ flexGrow: 0, paddingVertical: 10 }}
        contentContainerStyle={{ paddingHorizontal: 5, gap: 10 }}
      >
        {categories.map(({ name, icon }) => (
          <SmallIconButton
            key={name}
            icon={icon}
            title={name}
            active={category === name}
            onPress={() => setCategory((prev) => (prev === name ? null : name))}
          />
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText type="defaultFaded">Could not load your purchases</ThemedText>
          <TouchableOpacity onPress={refresh} style={{ marginTop: 10 }}>
            <ThemedText type="defaultBold" style={{ color: colors.accent }}>Try again</ThemedText>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <ThemedText type="defaultFaded">No purchases yet.</ThemedText>
        </View>
      ) : (
        <FlatList
          data={filtered}
          contentContainerStyle={{ gap: 24, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
          }
          renderItem={({ item: { order, items } }) => (
            <View style={{ gap: 10 }}>
              <View style={styles.orderHeader}>
                <View>
                  <ThemedText type="smallFaded">
                    {new Date(order.created_at).toLocaleDateString("en-ZM", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </ThemedText>
                  <ThemedText type="defaultBold">
                    {order.order_items.length} item{order.order_items.length === 1 ? "" : "s"}
                  </ThemedText>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={[styles.statusPill, { backgroundColor: colors.surface }]}>
                    <ThemedText type="defaultSmall" style={{ color: colors.accent }}>
                      {order.status}
                    </ThemedText>
                  </View>
                  <ThemedText type="mediumBold">{formatK(order.total)}</ThemedText>
                </View>
              </View>

              {items.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.itemRow}
                  onPress={() => router.push(`/product/${item.listing_id}`)}
                >
                  <Image
                    source={item.image_url ? { uri: item.image_url } : require("../../assets/images/dino.jpg")}
                    style={styles.image}
                  />
                  <View style={{ flex: 1 }}>
                    <ThemedText type="defaultBold" numberOfLines={1}>
                      {item.title}
                    </ThemedText>
                    <ThemedText type="mediumFaded">
                      {order.payment_method ? `Paid via ${order.payment_method}` : "Payment method unavailable"}
                    </ThemedText>
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color={colors.disabled} />
                </TouchableOpacity>
              ))}
            </View>
          )}
          keyExtractor={(row) => row.order.id}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    gap: 8,
  },
  orderHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
});