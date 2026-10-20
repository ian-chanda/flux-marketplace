import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { CustomButtonField } from "@/components/customInputButton"
import { HeaderImage } from "@/components/header-image"
import { PfpItem } from "@/components/pfp-item"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { UserLocationModal } from "@/components/userLocationModal"
import { useAuth } from "@/contexts/auth-context"
import { useEditProfile } from "@/hooks/use-edit-profile"
import { useImagePicker } from "@/hooks/use-pick-image"
import { useUser } from "@/hooks/use-user"
import { useTheme } from "@/hooks/useTheme"
import { updateProfile, updateProfileImages } from "@/services/users"
import { LocationIQAddress, SelectedAddress } from "@/types/locations"
import { emptyUserForm, UserForm } from "@/types/user"
import { getLocation } from "@/utils/get-current-location"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator } from "react-native"
import { Platform, Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from "react-native"

// Small edit-badge that sits on top of an image (header banner or avatar)
const EditImageBadge = ({ onPress, size = 28 }: { onPress: () => void, size?: number }) => {
	const { colors } = useTheme()
	return (
		<TouchableOpacity
			onPress={onPress}
			style={{
				width: size,
				height: size,
				borderRadius: 100,
				backgroundColor: colors.accent,
				alignItems: "center",
				justifyContent: "center",
				borderWidth: 2,
				borderColor: colors.background,
			}}
			hitSlop={6}
		>
			<MaterialIcons name="camera-alt" size={size * 0.55} color={colors.background} />
		</TouchableOpacity>
	)
}
type ErrorType = {
	firstName?: string;
	lastName?: string,
	bio?: string
	username?: string;
	contact?: string
	location?: string
}

export default function EditProfileScreen() {
	const { colors } = useTheme()

	//TODO: add a search and select modal for the location and remove the manual typing version
	const [locating, setLocating] = useState(false)
	const [openLocationModal, setOpenLocationModal] = useState(false)
	const { user } = useAuth()
	const { pickImage } = useImagePicker()

	const [form, setForm] = useState<UserForm>(emptyUserForm)
	const set = <K extends keyof UserForm>(key: K, value: UserForm[K]) =>
		setForm((f) => ({ ...f, [key]: value }));

	const { data: userData, loading } = useUser()
	const { doUserUpdate, isPending: saving } = useEditProfile()

	const [errors, setErrors] = useState<ErrorType>({})

	const validate = () => {
		const next: typeof errors = {}
		if (form.first_name && form.first_name.trim().length === 0) next.firstName = "Name is required"
		if (form.last_name && form.last_name.trim().length === 0) next.lastName = "Name is required"
		if (form.username && form.username.trim().length === 0) next.username = "Username is required"
		if (form.phone_number && form.phone_number.trim().length > 0 && !/^\+?[0-9\s-]{7,15}$/.test(form.phone_number.trim())) {
			next.contact = "Enter a valid phone number"
		}

		setErrors(next)
		return Object.keys(next).length === 0
	}

	const locationLabel = [form.location_city, form.location_province?.replace("Province", "").trim(), form.location_country].filter(Boolean).join(", ");

	const handlePick = (a: SelectedAddress) => {
		set("location_city", a.city);
		set("location_province", a.province);
		set("location_country", a.country);
	};

	const handleSave = async () => {
		if (!validate()) return
		doUserUpdate.mutate({
			payload:
			{
				first_name: form.first_name,
				last_name: form.last_name,
				bio: form.bio,
				location_city: form.location_city,
				location_province: form.location_province,
				location_country: form.location_country,
				username: form.username,
				phone_number: form.phone_number
			}
			, avatarImage: form.avatar_url, headerImage: form.header_url
		})

		if(doUserUpdate.isError) console.log("errorrrr: ", doUserUpdate.error)
	}

	const handleUseCurrentLocation = async () => {
		setLocating(true);
		const location = await getLocation()

		if (location) {
			handlePick({
				city: location.city ?? "",
				province: location.province ?? "",
				country: location.country ?? ""
			})
		}
		setLocating(false);
	}


	const initialized = useRef(false)
	useEffect(() => {
		if (!userData || initialized.current) return

		initialized.current = true;
		setForm(userData)
	}, [userData])

	if (loading) {
		return (
			<ThemedView isTabVisible={false} >
				<CustomHeader showBack title="Edit Profile" />
				<View style={{ flex: 1, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}
				>
					<ActivityIndicator size={24} />
				</View>
			</ThemedView>
		)
	}

	return (
		<ThemedView isTabVisible={false}>
			<CustomHeader showBack title="Edit Profile" />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>
				<UserLocationModal
					onClose={() => setOpenLocationModal(false)}
					setLocation={handlePick}
					locate={handleUseCurrentLocation}
					locating={locating}
					location={locationLabel}
					visible={openLocationModal}
				/>

				<ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 10, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
					<View style={{ paddingTop: 10, marginBottom: 50 }}>
						{/* header image */}
						<TouchableOpacity
							onPress={() => pickImage((uri) => set("header_url", uri))} activeOpacity={0.85}>
							<HeaderImage source={form.header_url ?? ""} />
							<View
								style={{
									position: "absolute",
									bottom: 10,
									right: 10,
								}}
							>
								<EditImageBadge onPress={() => pickImage((uri) => set("header_url", uri))} />
							</View>
						</TouchableOpacity>

						{/* profile image */}
						<View style={{ position: "absolute", bottom: -30, left: 15 }}>
							<TouchableOpacity onPress={() => pickImage((uri) => set("avatar_url", uri))} activeOpacity={0.85}>
								<PfpItem image={form.avatar_url ?? ""} name={`${form.first_name} ${form.last_name}`} size="medium" />
								<View style={{ position: "absolute", bottom: 4, right: 4 }}>
									<EditImageBadge onPress={() => pickImage((uri) => set("avatar_url", uri))} />
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ gap: 20 }}>
						<CustomInputField
							label="First name"
							value={form.first_name ?? ""}
							onChangeText={(t) => set("first_name", t)}
							placeholder="Jane"
							error={errors.firstName}
							returnKeyType="next"
						/>

						<CustomInputField
							label="Last name"
							value={form.last_name ?? ""}
							onChangeText={(t) => set("last_name", t)}
							placeholder="Bro"
							error={errors.lastName}
							returnKeyType="next"
						/>
						<CustomInputField
							label="Bio"
							value={form.bio ?? ""}
							onChangeText={(t) => set("bio", t)}
							placeholder="im a naughty little elf...hmmm..."
							autoCapitalize="none"
							error={errors.bio}
							maxLength={50}
							returnKeyType="next"
						/>

						<CustomInputField
							label="Username"
							value={form.username ?? ""}
							onChangeText={(t) => set("username", t.replace(/\s/g, "").toLowerCase())}
							placeholder="username"
							icon="alternate-email"
							autoCapitalize="none"
							error={errors.username}
							returnKeyType="next"
						/>

						<CustomButtonField
							label="Location"
							value={locationLabel}
							placeholder="City, Country"
							onPress={() => setOpenLocationModal(true)}

						/>


						<CustomInputField
							label="Contact number"
							value={form.phone_number ?? ""}
							onChangeText={(t) => set("phone_number", t)}
							placeholder="e.g. 0764569576"
							keyboardType="phone-pad"
							error={errors.contact}
							returnKeyType="done"
							onSubmitEditing={handleSave}
						/>
					</View>

					<Button
						title={saving ? "Saving..." : "Save changes"}
						onPress={handleSave}
						disabled={saving}
					/>
				</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>
	)
}
