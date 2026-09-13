import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { Listing } from "@/types/listing";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  deleteListing,
  getListingsByUser,
  updateListingAvailability,
} from "@/services/listings";

const FALLBACK_IMG = require("../assets/images/ph.jpg");

export default function ViewListings() {
  const { colors } = useTheme();
  const { user } = useAuth();

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      let cancelled = false;

      (async () => {
        setLoading(true);
        try {
          const data = await getListingsByUser(user.id);
          if (!cancelled) setListings(data);
        } catch {
          if (!cancelled) Alert.alert("Error", "Couldn't load your listings.");
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();

      return () => {
        cancelled = true;
      };
    }, [user?.id])
  );

  const handleDelete = (listing: Listing) => {
    Alert.alert(
      "Delete listing",
      `Are you sure you want to delete "${listing.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteListing(listing.id);
              setListings((prev) => prev.filter((l) => l.id !== listing.id));
            } catch {
              Alert.alert("Error", "Failed to delete listing.");
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (listing: Listing) => {
    const next = !listing.is_available;
    // optimistic update
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, is_available: next } : l))
    );
    try {
      await updateListingAvailability(listing.id, next);
    } catch {
      // revert on failure
      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id ? { ...l, is_available: !next } : l
        )
      );
      Alert.alert("Error", "Failed to update listing.");
    }
  };

  if (loading) {
    return (
      <ThemedView isTabVisible={false} style={{ flex: 1 }}>
        <CustomHeader title="Your listings" showBack={true} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView isTabVisible={false} style={{ paddingBottom: 10 }}>
      <CustomHeader title="Your listings" showBack={true} />
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={listings.length === 0 && styles.centered}
        ListEmptyComponent={
          <ThemedText type="defaultFaded" style={{ textAlign: "center" }}>
            You have no listings yet.
          </ThemedText>
        }
        renderItem={({ item }) => {
          const img =
            item.images?.length > 0 ? { uri: item.images[0] } : FALLBACK_IMG;
          const statusLabel = item.is_available ? "Active" : "Unavailable";
          const statusColor = item.is_available ? "#22c55e" : "#999";

          return (
            <View style={[styles.itemContainer, { borderBottomColor: colors.surface }]}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => router.push(`/product/${item.id}`)}
                style={styles.row}
              >
                <Image source={img} style={styles.image} />
                <View style={styles.info}>
                  <ThemedText type="defaultSemiBold" numberOfLines={1}>
                    {item.title}
                  </ThemedText>
                  <ThemedText type="mediumFaded">
                    K{item.price.toLocaleString()} ·{" "}
                    <ThemedText style={{ color: statusColor }}>
                      {statusLabel}
                    </ThemedText>
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <View style={styles.actions}>
                <TouchableOpacity
                  activeOpacity={0.15}
                  onPress={() => handleToggleAvailability(item)}
                  style={[styles.actionBtn, { backgroundColor: colors.accent }]}
                >
                  <ThemedText type="mediumBold" darkColor={colors.background}>
                    {item.is_available ? "Mark as unavailable" : "Mark as available"}
                  </ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.15}
                  onPress={() => handleDelete(item)}
                  style={[styles.actionBtn, { backgroundColor: colors.accent }]}
                >
                  <ThemedText type="mediumBold" darkColor={colors.background}>
                    Delete listing
                  </ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 20,
  },
  info: {
    flex: 1,
    flexDirection: "column",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    paddingBottom: 10,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 10,
  },
});
