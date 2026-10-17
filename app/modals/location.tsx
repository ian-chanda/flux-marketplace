import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { IconButton } from "@/components/iconButton"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useFetchAddresses } from "@/hooks/use-fetch-addresses"
import { useTheme } from "@/hooks/useTheme"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View } from "react-native"

export default function SelectAddressModal() {
    const { colors } = useTheme()
    const { selected } = useLocalSearchParams<{ selected?: string }>()
    const [selectedAddress, setSelectedAddress] = useState("")
    const { data: addresses, loading } = useFetchAddresses()

    // hand the choice back to the add listing screen, which reads it from its params
    const choose = (addressId: string) => {
        setSelectedAddress(addressId)
        router.dismissTo({ pathname: "/addListings", params: { addressId } })
    }

    useEffect(() => {
        setSelectedAddress(selected as string)
    }, [selected])

    return (
        <ThemedView>
            <CustomHeader title="Select address">
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    <IconButton icon="close" badgeValue="" onPress={() => router.back()} />
                    {/* <IconButton icon="add" badgeValue="" onPress={() => */}
                    {/*     router.push({ pathname: "/address/[id]", params: { id: "new" } }) */}
                    {/* } */}
                    {/* /> */}
                </View>
            </CustomHeader>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="small" color={colors.accent} />
                </View>
            ) : (
                <FlatList
                    data={addresses}
                    keyExtractor={(item) => item.id}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <ThemedText type="defaultFaded">no saved addresses yet</ThemedText>
                        </View>
                    }
                    ListFooterComponent={
                        <Button
                            title="Add new address"
                            onPress={() =>
                                router.dismissTo({ pathname: "/address/[id]", params: { id: "new" } })
                            }
                        />
                    }
                    renderItem={({ item }) => {
                        const isSelected = item.id === selectedAddress
                        return (
                            <View
                                style={[
                                    styles.row,
                                ]}
                            >
                                <TouchableOpacity
                                    onPress={() => choose(item.id)}
                                    hitSlop={20}
                                >
                                    <MaterialIcons
                                        name={isSelected ? "radio-button-checked" : "radio-button-unchecked"}
                                        size={22}
                                        color={isSelected ? colors.accent : colors.placeholder}
                                    />
                                </TouchableOpacity>

                                <View
                                    style={[
                                        {
                                            flex: 1,
                                            gap: 5,
                                            padding: 12,
                                            borderRadius: 12,
                                            borderWidth: 1.5,
                                            backgroundColor: colors.surface,
                                            borderColor: isSelected ? colors.accent : "transparent",
                                        },
                                    ]}
                                >
                                    <View style={styles.labelRow}>
                                        <ThemedText type="defaultSemiBold" numberOfLines={1} style={{ flexShrink: 1 }}>
                                            {item.label}
                                        </ThemedText>
                                        {item.is_primary && (
                                            <ThemedText type="smallFaded">primary</ThemedText>
                                        )}
                                    </View>
                                    <ThemedText type="smallFaded" numberOfLines={1}>
                                        {item.street_address}
                                    </ThemedText>
                                    <ThemedText type="smallFaded" numberOfLines={1}>
                                        {[item.city, item.country].filter(Boolean).join(", ")}
                                    </ThemedText>
                                </View>
                            </View>
                        )
                    }}
                />
            )}
        </ThemedView>
    )
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    list: {
        gap: 8,
        padding: 10,
        paddingBottom: 30,
    },
    empty: {
        alignItems: "center",
        paddingVertical: 40,
    },
    row: {
        width: '100%',
        gap: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    labelRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center",
    },
})
