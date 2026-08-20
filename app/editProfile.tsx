import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { Platform } from "react-native"
import { Image, KeyboardAvoidingView, ScrollView, TouchableOpacity, View } from "react-native"

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

export default function EditProfileScreen() {
	const { colors } = useTheme()

	const [headerImage, setHeaderImage] = useState<string | null>(null)
	const [avatarImage, setAvatarImage] = useState<string | null>(null)
	const [name, setName] = useState("Admin Admin")
	const [username, setUsername] = useState("admin9003")
	const [bio, setBio] = useState("")
	const [location, setLocation] = useState("Lusaka, Zambia")
	const [contact, setContact] = useState("0764569576")

	const [errors, setErrors] = useState<{ name?: string; username?: string; contact?: string }>({})
	const [saving, setSaving] = useState(false)

	const pickImage = async (onPicked: (uri: string) => void, aspect: [number, number]) => {
	}

	const validate = () => {
		const next: typeof errors = {}
		if (name.trim().length === 0) next.name = "Name is required"
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
			router.back()
		} finally {
			setSaving(false)
		}
	}

	return (
		<ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, gap: 10 }}>
			<CustomHeader showBack title="Edit Profile" />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>

				<ScrollView contentContainerStyle={{ gap: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
					<View style={{ paddingTop: 10, marginBottom: 50 }}>
						{/* header image */}
						<TouchableOpacity onPress={() => pickImage(setHeaderImage, [16, 9])} activeOpacity={0.85}>
							<Image
								source={headerImage ? { uri: headerImage } : require("@/assets/images/dino.jpg")}
								style={{
									width: "100%",
									height: 150,
									objectFit: "cover",
									borderRadius: 12,
								}}
							/>
							<View
								style={{
									position: "absolute",
									bottom: 10,
									right: 10,
								}}
							>
								<EditImageBadge onPress={() => pickImage(setHeaderImage, [16, 9])} />
							</View>
						</TouchableOpacity>

						{/* profile image */}
						<View style={{ position: "absolute", bottom: -30, left: 15 }}>
							<TouchableOpacity onPress={() => pickImage(setAvatarImage, [1, 1])} activeOpacity={0.85}>
								<Image
									source={avatarImage ? { uri: avatarImage } : require("@/assets/images/dino.jpg")}
									style={{
										width: 120,
										height: 120,
										borderRadius: 100,
										borderWidth: 4,
										borderColor: colors.background,
									}}
								/>
								<View style={{ position: "absolute", bottom: 4, right: 4 }}>
									<EditImageBadge onPress={() => pickImage(setAvatarImage, [1, 1])} />
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ gap: 20 }}>
						<CustomInputField
							label="Name"
							value={name}
							onChangeText={setName}
							placeholder="Your full name"
							error={errors.name}
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

						<CustomInputField
							label="Location"
							value={location}
							onChangeText={setLocation}
							placeholder="City, Country"
							returnKeyType="next"
						/>

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
