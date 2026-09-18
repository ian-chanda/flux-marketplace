import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { IconButton } from "@/components/iconButton"
import { ThemedView } from "@/components/themed-view"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/hooks/useTheme"
import { deleteAddress, getDeliveryAddress, submitAddress } from "@/services/addresses"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from "react-native"
import { TouchableOpacity, View } from "react-native"

export default function AddressScreen() {
	const { colors } = useTheme()
	const { user } = useAuth()
	const [submitting, setSubmitting] = useState(false)
	const [isFetching, setIsFetching] = useState(false)
	const [addressId, setAddressId] = useState('');
	const [label, setLabel] = useState('');
	const [name, setName] = useState('');
	const [country, setCountry] = useState('');
	const [streetAddress, setStreetAddress] = useState('');
	const [streetAddress2, setStreetAddress2] = useState('');
	const [city, setCity] = useState('');
	const [stateProvince, setStateProvince] = useState('');
	const [phoneNumber, setPhoneNumber] = useState('');

	const { label_ } = useLocalSearchParams()
	const userId = user?.id as string;

	const handleSubmitAddress = async () => {
		setSubmitting(true)
		try {
			await submitAddress({
				id: label_ ? addressId : null,
				userId: userId,
				label: label,
				name: name,
				city: city,
				country: country,
				phoneNumber: phoneNumber,
				province: stateProvince,
				streetAddress: streetAddress,
			})

			console.log("address set!")
			router.replace("/me")
			router.dismissAll()
		} catch (error: any) {
			console.log("error submitting address: ", error.message)
		} finally {
			setSubmitting(false)

		}
	}

	const handleFetchAddress = async () => {
		try {
			setIsFetching(true);
			const data = await getDeliveryAddress(userId, label_ as string)
			setAddressId(data[0]?.id ?? null)
			setLabel(data[0]?.label ?? "")
			setName(data[0]?.recipient_name ?? "")
			setCountry(data[0]?.country ?? "")
			setStreetAddress(data[0]?.street_address ?? "")
			setCity(data[0]?.city ?? "")
			setStateProvince(data[0]?.province ?? "")
			setPhoneNumber(data[0]?.phone_number ?? "")
		} catch (error: any) {
			console.log("error submitting address: ", error.message)
		} finally {
			setIsFetching(false);
		}
	}

	const handleDeleteAddress = async () => {
		try {
			await deleteAddress({ addressId: addressId })
			console.log("address deleted")
			router.replace("/me")
		} catch (error: any) {
			console.error("failed to delete address: ", error.message)
		}
	}

	useEffect(() => {
		if (!label_) return
		handleFetchAddress()
	}, [])

	if (isFetching) {
		return (
			<ThemedView>
				<CustomHeader showBack title="Edit Address" />
				<View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
					<ActivityIndicator size={30} color={colors.accent} />
				</View>
			</ThemedView>
		)
	}

	return (
		<ThemedView>
			<CustomHeader showBack title="Edit Address">
				{label_ && <IconButton icon={"delete"} badgeValue="" onPress={() => handleDeleteAddress()} />}
			</CustomHeader>
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>

				<ScrollView
					style={{ paddingHorizontal: 10, }}
					contentContainerStyle={{ gap: 10 }}
				>
					<CustomInputField
						label="Address Nickname"
						onChangeText={setLabel}
						value={label}
						placeholder="e.g. Home, Work, Mom's House"
					/>
					<CustomInputField
						label="Name"
						onChangeText={setName}
						value={name}
						placeholder="e.g. John Chimfwemba"
					/>
					<CustomInputField
						label="Country"
						onChangeText={setCountry}
						value={country}
						placeholder="e.g. Zambia"
					/>
					<CustomInputField
						label="Street Address"
						onChangeText={setStreetAddress}
						value={streetAddress}
						placeholder="e.g. Chelstone Last Bus Stop"
					/>
					<CustomInputField
						label="Street Address 2"
						onChangeText={setStreetAddress2}
						value={streetAddress2}
						placeholder="e.g. Off Palm Drive"
					/>
					<CustomInputField
						label="City"
						onChangeText={setCity}
						value={city}
						placeholder="e.g. Lusaka"
					/>
					<CustomInputField
						label="Province"
						onChangeText={setStateProvince}
						value={stateProvince}
						placeholder="e.g. Lusaka"
					/>
					<CustomInputField
						label="Phone Number"
						onChangeText={setPhoneNumber}
						value={phoneNumber}
						placeholder="e.g. 0958801770"
					/>

					<Button title={label_ ? "Update" : "Done"} loading={submitting} onPress={() => handleSubmitAddress()} />

				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView >

	)
}
