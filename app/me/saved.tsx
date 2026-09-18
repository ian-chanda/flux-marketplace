import { CustomHeader } from "@/components/customHeader";
import { CustomSearchBar } from "@/components/customSearchBar";
import { ProductCardV } from "@/components/productCardV";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { getSavedListings, unsaveListing } from "@/services/savedListings";
import { Listing } from "@/types/listing";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Saved() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const loadSaved = useCallback(async () => {
    if (!user) return;

    try {
      const data = await getSavedListings(user.id);
      setListings(data);
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
    await loadSaved();
  }, [loadSaved]);

  useFocusEffect(
    useCallback(() => {
      loadSaved();
    }, [loadSaved])
  );

  const handleUnsave = useCallback(
    async (id: string) => {
      if (!user) return;

      setListings((prev) => prev.filter((item) => item.id !== id));

      try {
        await unsaveListing(user.id, id);
      } catch {
        setLoading(true);
        loadSaved();
      }
    },
    [user, loadSaved]
  );

  const filterSearchItem = listings.filter((item) =>
    item.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <ThemedView
      isTabVisible={false}
      style={{
        paddingHorizontal: 10,
        paddingBottom: 0
      }}>
      <CustomHeader
        title="Saved"
        showBack={true} />
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
          <ThemedText type="defaultFaded">Could not load listings</ThemedText>
          <TouchableOpacity onPress={refresh} style={{ marginTop: 10 }}>
            <ThemedText type="defaultBold" style={{ color: colors.accent }}>Try again</ThemedText>
          </TouchableOpacity>
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.center}>
          <ThemedText type="defaultFaded">No saved items yet.</ThemedText>
        </View>
      ) : (
        <FlatList
        style={{ flex: 1, paddingTop: 20 }}
          data={filterSearchItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', gap: 10 }}
          contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.accent} />
          }
          renderItem={({ item }) => (
            <ProductCardV
              id={item.id}
              bookmarked
              img={item.images?.[0]}
              desc={item.condition ?? item.category}
              name={item.title}
              price={`K${Number(item.price).toLocaleString()}`}
              onBookmark={() => handleUnsave(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
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
});