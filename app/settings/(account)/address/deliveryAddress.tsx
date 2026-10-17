import { CardButtonRow } from "@/components/cardButtonRow";
import { CheckBox } from "@/components/checkbox";
import { CustomHeader } from "@/components/customHeader";
import { IconButton } from "@/components/iconButton";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useAuth } from "@/contexts/auth-context";
import { useFetchAddresses } from "@/hooks/use-fetch-addresses";
import { useMakePrimary } from "@/hooks/use-make-primary";
import { useTheme } from "@/hooks/useTheme";
import { Tables } from "@/types/database.types";
import { useMutationState } from "@tanstack/react-query";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, View } from "react-native";

export default function DelievryAddressScreen() {
	const { colors } = useTheme()
	const { user } = useAuth()
	const { data: addresses, loading: isFetching } = useFetchAddresses()
	const { makePrimaryAddress, isPending } = useMakePrimary()

	const userId = user?.id as string

	const pendingId = useMutationState({
		filters: { mutationKey: ['addresses', user?.id, "primary"], status: "pending" },
		select: (m) => (m.state.variables as { id: string }).id
	}).at(-1)

	console.log("pendingID: ", pendingId)

	const addressData = useMemo(() =>
		(addresses ?? []).map((a) => pendingId ? { ...a, is_primary: a.id === pendingId } : a)

		, [addresses, pendingId])

	// the optimistic setting, just like the way i handle the messages
	const setPrimary = async (id: string) => {
		makePrimaryAddress.mutate({ id: id })
	}

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
				<IconButton
					icon={"add"}
					badgeValue=""
					onPress={() => router.push({
						pathname: '/settings/address/[id]',
						params: { id: "new" }
					})}
				/>
			</CustomHeader>
			{addressData?.length > 0 ?
				<FlatList
					data={addressData}
					style={{ paddingHorizontal: 10 }}
					contentContainerStyle={{ gap: 30 }}
					renderItem={({ item }) => {
						return (
							<View style={{ gap: 5, paddingBottom: 30, borderBottomWidth: 1, borderColor: colors.disabled }}>
								<CardButtonRow
									label={item?.label ?? "unknown"}
									onPress={() => router.push({
										pathname: '/settings/address/[id]',
										params: { id: item?.id ?? "" }
									})}
								/>
								<CheckBox
									label="primary address"
									checked={item?.is_primary ?? false}
									onPress={() => setPrimary(item?.id ?? "")}
								/>
							</View>
						)
					}
					}
					keyExtractor={(item) => item.id.toString()}
				/>
				:
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<ThemedText type="defaultFaded">
						you dont have any addresses
					</ThemedText>
				</View>
			}
		</ThemedView>
	)
}
