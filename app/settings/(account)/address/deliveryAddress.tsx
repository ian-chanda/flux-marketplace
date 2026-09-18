import { CardButtonRow } from "@/components/cardButtonRow";
import { CheckBox } from "@/components/checkbox";
import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/hooks/useTheme";
import { getDeliveryAddresses, setAddressPrimary, submitAddress } from "@/services/addresses";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, View } from "react-native";

export default function DelievryAddressScreen() {
	const { colors } = useTheme()
	const { user } = useAuth()
	const [isFetching, setFetching] = useState(false)
	const [isPrimary, setIsPrimary] = useState(false)
	const [addresses, setAddresses] = useState<any[]>([])

	const userId = user?.id as string

	const setPrimary = async (label: string) => {

		const prevAddies = addresses;
		setAddresses((prev) => prev.map(addr => ({ ...addr, is_primary: addr.label === label })))

		try {
			await setAddressPrimary(userId, label)
		} catch (error: any) {
			console.log("error fetching addies: ", error.message)
			setAddresses(prevAddies)
		}
	}

	const fetchAddies = async () => {
		setFetching(true)
		try {
			const data = await getDeliveryAddresses(user?.id as string);
			setAddresses(data)
		} catch (error: any) {
			console.log("error fetching addies: ", error.message)
		} finally {
			setFetching(false)
		}
	}

	useEffect(() => {
		fetchAddies()
	}, [])

	if (isFetching) {
		return (
			<ThemedView>
				<CustomHeader showBack title="Edit Address" />
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<ActivityIndicator size={30} color={colors.accent} />
				</View>
			</ThemedView>
		)
	}

	return (
		<ThemedView>
			<CustomHeader showBack title="Addresses">
				<IconButton icon={"add"} badgeValue="" onPress={() => router.push('/settings/address/[id]')} />
			</CustomHeader>
			{addresses.length > 0 ?
				<FlatList
					data={addresses}
					style={{ paddingHorizontal: 10 }}
					contentContainerStyle={{ gap: 30 }}
					renderItem={({ item }) => {
						return (
							<View style={{ gap: 5, paddingBottom: 30, borderBottomWidth: 1, borderColor: colors.disabled }}>
								<CardButtonRow
									label={item?.label ?? "unknown"}
									onPress={() => router.push({
										pathname: '/settings/address/[id]',
										params: { label_: item?.label ?? "" }
									})}
								/>
								<CheckBox
									label="primary address"
									checked={item?.is_primary ?? false}
									onPress={() => setPrimary(item?.label ?? "unknown")}
								/>
							</View>
						)
					}
					}
					keyExtractor={(item) => item.id.toString()}
				/>
				:
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<ThemedText type="defaultFaded">
						you dont have any addresses
					</ThemedText>
				</View>
			}
		</ThemedView>
	)
}
