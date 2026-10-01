import { CustomHeader } from "@/components/customHeader";
import { CustomSearchBar } from "@/components/customSearchBar";
import { ProductCardH } from "@/components/productCardH";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { getSavedListingIds, saveListing, unsaveListing } from "@/services/savedListings";
import { getRecentViews, removeRecentView } from "@/services/recentlyViewed";
import { Listing } from "@/types/listing";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Animated from "react-native-reanimated";

export default function Recents() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const loadRecents = useCallback(async () => {
    if (!user) return;

    try {
      const [rows, savedIds] = await Promise.all([
        getRecentViews(user.id),
        getSavedListingIds(user.id).catch(() => [] as string[]),
      ]);
      setListings(rows.filter((row): row is Listing => Boolean(row?.id)));
      setBookmarked(savedIds.reduce<Record<string, boolean>>((acc, id) => ({ ...acc, [id]: true }), {}));
      setError(false);
    } catch {
      setListings([]);
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecents();
  }, [loadRecents]);

  useFocusEffect(
    useCallback(() => {
      loadRecents();
    }, [loadRecents])
  );

  const handleRemove = useCallback(
    async (id: string) => {
      if (!user) return;

      setListings((prev) => prev.filter((item) => item.id !== id));

      try {
        await removeRecentView(user.id, id);
      } catch {
        loadRecents();
      }
    },
    [user, loadRecents]
  );

  const handleBookmark = useCallback(
    async (id: string) => {
      if (!user) return;

      const next = !bookmarked[id];
      setBookmarked((prev) => ({ ...prev, [id]: next }));

      try {
        if (next) {
          await saveListing(user.id, id);
        } else {
          await unsaveListing(user.id, id);
        }
      } catch {
        setBookmarked((prev) => ({ ...prev, [id]: !next }));
      }
    },
    [user, bookmarked]
  );

  const filteredListings = listings.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, paddingBottom: 0 }}>
      <CustomHeader title="Recently Viewed" showBack />
      <CustomSearchBar
        width={"100%"}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={() => {}}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <ThemedText type="defaultFaded">Could not load recently viewed items</ThemedText>
          <TouchableOpacity onPress={refresh} style={{ marginTop: 10 }}>
            <ThemedText type="defaultBold" style={{ color: colors.accent }}>Try again</ThemedText>
          </TouchableOpacity>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.center}>
          <ThemedText type="defaultFaded">No recently viewed items yet.</ThemedText>
        </View>
      ) : (
        <FlatList
          style={{ flex: 1, paddingTop: 20 }}
          data={filteredListings}
          contentContainerStyle={{ gap: 10, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
          }
          renderItem={({ item }) => (
            <ReanimatedSwipeable
              friction={2}
              rightThreshold={40}
              overshootRight={false}
              renderRightActions={() => <PressableDelete onPress={() => handleRemove(item.id)} />}
              containerStyle={{ backgroundColor: colors.background }}
            >
              <View style={{ borderBottomWidth: 1, paddingBottom: 10, borderColor: colors.disabled }}>
                <ProductCardH
                  id={item.id}
                  bookmarked={!!bookmarked[item.id]}
                  onBookmark={() => handleBookmark(item.id)}
                  desc={item.condition ?? item.category}
                  name={item.title}
                  price={`K${Number(item.price).toLocaleString()}`}
                  img={item.images?.[0]}
                />
              </View>
            </ReanimatedSwipeable>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </ThemedView>
  );
}

const PressableDelete = ({ onPress }: { onPress: () => void }) => (
  <Animated.View style={{ backgroundColor: "#e02c1f", width: 80, justifyContent: "center", alignItems: "center" }}>
    <Pressable onPress={onPress} style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%" }}>
      <MaterialIcons name="delete" size={28} color="#fff" />
      <ThemedText type="smallFaded" style={{ color: "#fff" }}>Remove</ThemedText>
    </Pressable>
  </Animated.View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
    gap: 8,
  },
});
