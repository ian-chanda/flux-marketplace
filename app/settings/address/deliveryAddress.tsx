import { CardButtonRow } from "@/components/cardButtonRow";
import { CheckBox } from "@/components/checkbox";
import { CustomHeader } from "@/components/customHeader";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

type Address = { id: number, name: string, isPrimary: boolean }

const MOCK_ADDYS: Address[] = [
	{ id: 1, name: "lusaka address", isPrimary: false },
	{ id: 2, name: "uk address", isPrimary: false },
	{ id: 3, name: "usa address", isPrimary: false },
	{ id: 4, name: "chelstone address", isPrimary: true },
]

//puts the primary address first
const sortWithPrimaryFirst = (addresses: Address[]) =>
	[...addresses].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))

export default function DelievryAddressScreen() {
	const { colors } = useTheme()
	const [addresses, setAddresses] = useState<Address[]>(sortWithPrimaryFirst(MOCK_ADDYS))

	const setPrimary = (id: number) => {
		setAddresses((prev) =>
			prev.map((addr) => ({ ...addr, isPrimary: addr.id === id }))
		)
	}

	return (
		<ThemedView>
			<CustomHeader showBack title="Addresses" />
			<FlatList
				data={addresses}
				style={{ paddingHorizontal: 10 }}
				contentContainerStyle={{ gap: 20 }}
				renderItem={({ item }) => (
					<View style={{ gap: 5, paddingBottom: 10, borderBottomWidth: 1, borderColor: colors.disabled }}>
						<CardButtonRow
							label={item.name}
							onPress={() => router.push('/settings/address/[id]')}
						/>
						<CheckBox
							label="primary address"
							checked={item.isPrimary}
							onPress={() => setPrimary(item.id)}
						/>
					</View>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>
		</ThemedView>
	)
}
