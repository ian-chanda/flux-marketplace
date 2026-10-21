import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { IconButton } from "@/components/iconButton"
import { ThemedView } from "@/components/themed-view"
import { useDeleteAddress } from "@/hooks/use-delete-address"
import { useFetchAddresses } from "@/hooks/use-fetch-addresses"
import { useSubmitAddress } from "@/hooks/use-submit-address"
import { useTheme } from "@/hooks/useTheme"
import { deleteAddress } from "@/services/addresses"
import { AddressForm, SubmitAddressVars } from "@/types/addresses"
import { Tables } from "@/types/database.types"
import { PostgrestError } from "@supabase/supabase-js"
import { router, useLocalSearchParams } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native"


type Errors = Partial<Record<keyof AddressForm, string>>

// outside the component
const REQUIRED: { key: keyof AddressForm; message: string }[] = [
	{ key: "label", message: "Give this address a nickname" },
	{ key: "recipient_name", message: "Enter the recipient's name" },
	{ key: "street_address", message: "Enter the street address" },
	{ key: "city", message: "Enter the city" },
	{ key: "phone_number", message: "Enter a phone number" },
]

export default function AddressScreen() {
	const { colors } = useTheme()
	const { id } = useLocalSearchParams()
	const [errors, setErrors] = useState<Errors>({})
	const isNew = id === "new"

	const [form, setForm] = useState<SubmitAddressVars>({})
	const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

	const { doSubmitAddress, isPending: submitting, error, isError } = useSubmitAddress()
	const { doDeleteAddress, pending: isDeleting } = useDeleteAddress()
	const { data, loading: isFetching } = useFetchAddresses()
	const address = data?.filter((a) => a.id === id)[0]

	const uniqueLabelErr =
		isError && (error as PostgrestError | null)?.code === "23505"
			? "An address with this nickname already exists"
			: ""

	const validate = () => {
		const next: Errors = {}

		for (const { key, message } of REQUIRED) {
			if (!form[key]?.trim()) next[key] = message
		}

		const phone = form.phone_number?.replace(/[\s-]/g, "")
		if (phone && !/^\+?\d{9,13}$/.test(phone)) {
			next.phone_number = "Enter a valid phone number"
		}

		setErrors(next)
		return Object.keys(next).length === 0
	}

	const handleSubmitAddress = () => {
		if (!validate()) return
		const payload = {
			label: form.label,
			recipient_name: form.recipient_name,
			city: form.city,
			country: form.country,
			phone_number: form.phone_number,
			province: form.province,
			street_address: form.street_address,
			street_address_2: form.street_address_2,
		}
		doSubmitAddress.mutate(id && !isNew ? { id: id as string, ...payload } : payload)
	}

	const pick = (a: Tables<"delivery_addresses">): AddressForm => {
		return {
			label: a.label ?? "",
			recipient_name: a.recipient_name ?? "",
			city: a.city ?? "",
			country: a.country ?? "",
			phone_number: a.phone_number ?? "",
			province: a.province ?? "",
			street_address: a.street_address ?? "",
			street_address_2: a.street_address_2 ?? ""
		}
	}

	// ill create a hook for this
	const handleDeleteAddress = async () => {
		doDeleteAddress.mutate({ id: id as string })
		console.log("address deleted")
	}

	const initialized = useRef(false)
	useEffect(() => {
		if (!address || initialized.current) return
		initialized.current = true;
		setForm(pick(address as Tables<"delivery_addresses">))
	}, [address])

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
			<CustomHeader showBack title="Edit Address">
				{!isNew && <IconButton icon={"delete"} badgeValue="" onPress={() => handleDeleteAddress()} />}
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
						onChangeText={set("label")}
						value={form.label ?? ""}
						placeholder="e.g. Home, Work, Mom's House"
						error={uniqueLabelErr || errors.label}
					/>
					<CustomInputField
						label="Name"
						onChangeText={set("recipient_name")}
						value={form.recipient_name ?? ""}
						placeholder="e.g. John Chimfwemba"
						error={errors.recipient_name}
					/>
					<CustomInputField
						label="Country"
						onChangeText={set("country")}
						value={form.country ?? ""}
						placeholder="e.g. Zambia"
						error={errors.country}
					/>
					<CustomInputField
						label="Street Address"
						onChangeText={set("street_address")}
						value={form.street_address ?? ""}
						placeholder="e.g. Chelstone Last Bus Stop"
						error={errors.street_address}
					/>
					<CustomInputField
						label="Street Address 2"
						onChangeText={set("street_address_2")}
						value={form.street_address_2 ?? ""}
						placeholder="e.g. Off Palm Drive"
						error={errors.street_address_2}
					/>
					<CustomInputField
						label="City"
						onChangeText={set("city")}
						value={form.city ?? ""}
						placeholder="e.g. Lusaka"
						error={errors.city}
					/>
					<CustomInputField
						label="Province"
						onChangeText={set("province")}
						value={form.province ?? ""}
						placeholder="e.g. Lusaka"
						error={errors.province}
					/>
					<CustomInputField
						label="Phone Number"
						onChangeText={set("phone_number")}
						value={form.phone_number ?? ""}
						placeholder="e.g. 0958801770"
						error={errors.phone_number}
					/>

					<Button title={!isNew ? "Update" : "Done"} loading={submitting} onPress={() => handleSubmitAddress()} />

				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView >

	)
}
