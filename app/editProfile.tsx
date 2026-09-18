import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { HeaderImage } from "@/components/header-image"
import { PfpItem } from "@/components/pfp-item"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useAuth } from "@/contexts/auth-context"
import { useImagePicker } from "@/hooks/use-pick-image"
import { useUser } from "@/hooks/use-user"
import { useTheme } from "@/hooks/useTheme"
import { updateProfile, updateProfileImages } from "@/services/users"
import { getLocation } from "@/utils/get-current-location"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useEffect, useState } from "react"
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

	const [headerImage, setHeaderImage] = useState<string | null>(null)
	const [avatarImage, setAvatarImage] = useState<string | null>(null)
	const [firstName, setFirstName] = useState("Admin Admin")
	const [lastName, setLastName] = useState("Admin Admin")
	const [username, setUsername] = useState("admin9003")
	const [bio, setBio] = useState("")
	const [location, setLocation] = useState("Lusaka, Zambia")
	const [locationCity, setLocationCity] = useState("Lusaka, Zambia")
	const [locationProvince, setLocationProvince] = useState("Lusaka, Zambia")
	const [locationCountry, setLocationCountry] = useState("Lusaka, Zambia")
	const [contact, setContact] = useState("0764569576")
	const [saving, setSaving] = useState(false)
	const [currentLocation, setCurrentLocation] = useState("permission required")
	const { user } = useAuth()
	const { pickImage } = useImagePicker()
	const { userData, loading } = useUser()

	const [errors, setErrors] = useState<ErrorType>({})

	const validate = () => {
		const next: typeof errors = {}
		if (firstName.trim().length === 0) next.firstName = "Name is required"
		if (lastName.trim().length === 0) next.lastName = "Name is required"
		if (username.trim().length === 0) next.username = "Username is required"
		if (contact.trim().length > 0 && !/^\+?[0-9\s-]{7,15}$/.test(contact.trim())) {
			next.contact = "Enter a valid phone number"
		}

		setErrors(next)
		return Object.keys(next).length === 0
	}

	const handleSave = async () => {
		if (!validate()) return

		setSaving(true)
		try {

			await updateProfile({
				userId: user?.id as string,
				firstName: firstName,
				lastName: lastName,
				bio: bio,
				locationCity: locationCity,
				locationProvince: locationProvince,
				locationCountry: locationCountry,
				username: username,
				phoneNumber: contact
			})

			if (avatarImage && headerImage) {
				await updateProfileImages({
					userId: user?.id as string,
					avatarUri: avatarImage,
					headerUri: headerImage
				})
			}

			console.log("profile updated!")
			router.back()
		} catch (error: any) {
			console.log("error editing profile: ", error.message)
			if (error.message.includes("unique")) {
				setErrors((prev) => ({ ...prev, username: "username is already taken" }))
			}
		}
		finally {
			setSaving(false)
		}
	}

	const handleUseCurrentLocation = () => {
		// TODO: maybe set a flag that will always use the current location when they opt for it
		setLocation(currentLocation)
	}

	useEffect(() => {
		if (!userData) return
		setFirstName(userData?.first_name ?? "")
		setLastName(userData?.last_name ?? "")
		setBio(userData?.bio ?? "")
		setAvatarImage(userData?.avatar_url ?? "")
		setHeaderImage(userData?.header_url ?? "")
		setUsername(userData?.username ?? "")
		setContact(userData?.phone_number ?? "")
		setLocation(`${userData.location_city}, ${userData.location_country}`)
	}, [userData])

	useEffect(() => {
		let cancelled = false

		const loadLocation = async () => {
			const location = await getLocation()

			if (!cancelled && location) {
				setCurrentLocation(`${location.city}, ${location.country}`)
				setLocationCity(location.city ?? "")
				setLocationProvince(location.province?.split(" ")[0] ?? "")
				setLocationCountry(location.country ?? "")
			}
		}

		loadLocation()

		return () => {
			cancelled = true
		}
	}, [])

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

				<ScrollView contentContainerStyle={{ gap: 20, paddingHorizontal: 10, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
					<View style={{ paddingTop: 10, marginBottom: 50 }}>
						{/* header image */}
						<TouchableOpacity
							onPress={() => pickImage(setHeaderImage)} activeOpacity={0.85}>
							<HeaderImage source={headerImage ?? ""} />
							<View
								style={{
									position: "absolute",
									bottom: 10,
									right: 10,
								}}
							>
								<EditImageBadge onPress={() => pickImage(setHeaderImage)} />
							</View>
						</TouchableOpacity>

						{/* profile image */}
						<View style={{ position: "absolute", bottom: -30, left: 15 }}>
							<TouchableOpacity onPress={() => pickImage(setAvatarImage)} activeOpacity={0.85}>
								<PfpItem image={avatarImage ?? ""} name={`${firstName} ${lastName}`} size="medium" />
								<View style={{ position: "absolute", bottom: 4, right: 4 }}>
									<EditImageBadge onPress={() => pickImage(setAvatarImage)} />
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ gap: 20 }}>
						<CustomInputField
							label="First name"
							value={firstName}
							onChangeText={setFirstName}
							placeholder="Jane"
							error={errors.firstName}
							returnKeyType="next"
						/>

						<CustomInputField
							label="Last name"
							value={lastName}
							onChangeText={setLastName}
							placeholder="Bro"
							error={errors.lastName}
							returnKeyType="next"
						/>
						<CustomInputField
							label="Bio"
							value={bio}
							onChangeText={setBio}
							placeholder="im a naughty little elf...hmmm..."
							autoCapitalize="none"
							error={errors.bio}
							maxLength={50}
							returnKeyType="next"
						/>

						<CustomInputField
							label="Username"
							value={username}
							onChangeText={(text) => setUsername(text.replace(/\s/g, "").toLowerCase())}
							placeholder="username"
							icon="alternate-email"
							autoCapitalize="none"
							error={errors.username}
							returnKeyType="next"
						/>

						<View>

							<CustomInputField
								label="Location"
								value={location}
								onChangeText={setLocation}
								placeholder="City, Country"
								returnKeyType="next"
							/>
							<View
								style={{
									width: '100%',
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}
							>
								<View
									style={{ flexDirection: 'row', alignItems: 'center' }}
								>
									<ThemedText type="smallFaded">current location: </ThemedText>
									<ThemedText type="smallBold">{currentLocation}</ThemedText>
								</View>

								<TouchableOpacity onPress={() => handleUseCurrentLocation()}>
									<ThemedText style={{ color: colors.accent }}>use</ThemedText>

								</TouchableOpacity>

							</View>

						</View>

						<CustomInputField
							label="Contact number"
							value={contact}
							onChangeText={setContact}
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
