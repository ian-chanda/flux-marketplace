import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { getListing } from "@/services/listings";
import { Listing } from "@/types/listing";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";

const attributeLabels: Record<string, string> = {
    brand: "Brand",
    model: "Model",
    ram: "RAM",
    storage: "Storage Capacity",
    color: "Color",
};

const displayOrder = ["brand", "model", "ram", "storage", "color"];

type SpecRow = { id: string; name: string; value: string };

export default function ItemInformation() {
    const { colors } = useTheme();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function load() {
            if (!id) return;
            try {
                const data = await getListing(id);
                setListing(data);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    let specs: SpecRow[] = [];
    if (listing) {
        if (listing.condition) {
            specs.push({ id: "condition", name: "Condition", value: listing.condition });
        }
        displayOrder.forEach((key) => {
            const value = listing.attributes?.[key];
            if (value) specs.push({ id: key, name: attributeLabels[key] ?? key, value });
        });
    }

    if (loading) {
        return (
            <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <ActivityIndicator size="large" color={colors.accent} />
            </ThemedView>
        );
    }

    if (error || !listing || specs.length === 0) {
        return (
            <ThemedView style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
                <ThemedText type="defaultFaded">No item information for this listing.</ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                    <ThemedText type="defaultBold" style={{ color: colors.accent }}>Go back</ThemedText>
                </TouchableOpacity>
            </ThemedView>
        );
    }

    return (
        <ThemedView
            style={{
                paddingHorizontal: 5,
            }}>
            <CustomHeader
                title="Item Information"
                showBack />
            <FlatList
                style={{
                    paddingTop: 30
                }}
                data={specs}
                renderItem={({ item }) => (
                    <View
                        style={{
                            padding: 10,
                            paddingHorizontal: 16,
                            borderBottomColor: colors.surface,
                            borderBottomWidth: 1,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}>
                        <ThemedText>{item.name}</ThemedText>
                        <ThemedText type="defaultBold" style={{ textAlign: "right", flex: 1, marginLeft: 16 }}>
                            {item.value}
                        </ThemedText>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
        </ThemedView>
    )
}