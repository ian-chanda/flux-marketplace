import { CustomHeader } from "@/components/customHeader"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/hooks/useTheme"
import Button from "@/components/Button"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from "react-native"
import { CustomInputField } from "@/components/customInput"

const categories = [
	"Order or Delivery",
	"Payment",
	"Account",
	"App Bug",
	"Other",
]

export default function ReportProblemScreen() {
	const { colors } = useTheme()
	const { user } = useAuth()

	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [description, setDescription] = useState("")
	const [email, setEmail] = useState(user?.email ?? "")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [submitted, setSubmitted] = useState(false)
	const [error, setError] = useState("")

	const handleSubmit = async () => {
		setError("")

		if (!selectedCategory) {
			setError("Please select a category.")
			return
		}
		if (!description.trim()) {
			setError("Please describe the problem.")
			return
		}

		setIsSubmitting(true)
		try {
			// TODO: replace with your actual submit call, e.g.
			// await submitProblemReport({ userId: user?.id, category: selectedCategory, description, email })
			await new Promise((res) => setTimeout(res, 800))
			setSubmitted(true)
		} catch (err: any) {
			setError(err?.message ?? "Something went wrong. Please try again.")
		} finally {
			setIsSubmitting(false)
		}
	}

	if (submitted) {
		return (
			<ThemedView style={{ paddingHorizontal: 10 }}>
				<CustomHeader showBack title="Report a Problem" />
				<View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, paddingHorizontal: 20 }}>
					<MaterialIcons name="check-circle" size={60} color={colors.accent} />
					<ThemedText type="mediumBold">Thanks for letting us know</ThemedText>
					<ThemedText type="defaultFaded" style={{ textAlign: "center" }}>
						We've received your report and will look into it. You may hear back from us via email if we need more details.
					</ThemedText>
					<Button title="Done" onPress={() => router.back()} />
				</View>
			</ThemedView>
		)
	}

	return (
		<ThemedView >
			<CustomHeader showBack title="Report a Problem" />
			<KeyboardAvoidingView
				style={{ flex: 1 }}
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
			>

			<ScrollView
				contentContainerStyle={{ gap: 20, paddingHorizontal: 10, paddingVertical: 15, paddingBottom: 60 }}
				showsVerticalScrollIndicator={false}
			>
				<ThemedText type="defaultFaded">
					Let us know what went wrong and we'll do our best to help.
				</ThemedText>

				<View style={{ gap: 8 }}>
					<ThemedText type="defaultFaded">Category</ThemedText>
					<View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
						{categories.map((cat) => {
							const isSelected = selectedCategory === cat
							return (
								<TouchableOpacity
									key={cat}
									onPress={() => setSelectedCategory(cat)}
									style={{
										paddingVertical: 8,
										paddingHorizontal: 14,
										borderRadius: 20,
										backgroundColor: isSelected ? colors.accent : colors.surface,
									}}
								>
									<ThemedText
										type="small"
										style={{ color: isSelected ? colors.background : colors.text }}
									>
										{cat}
									</ThemedText>
								</TouchableOpacity>
							)
						})}
					</View>
				</View>

				<CustomInputField
					label="Describe the problem"
					value={description}
					onChangeText={setDescription}
					placeholder="e.g. My order arrived damaged, my payment didn't go through..."
					multiline
					numberOfLines={5}
				/>

				<CustomInputField
					label="Your email (optional)"
					value={email}
					onChangeText={setEmail}
					placeholder="e.g. you@example.com"
					keyboardType="email-address"
					autoCapitalize="none"
				/>

				{error ? (
					<ThemedText type="smallFaded" style={{ color: colors.error ?? "red" }}>
						{error}
					</ThemedText>
				) : null}

				<Button title="Submit Report" loading={isSubmitting} onPress={handleSubmit} />
			</ScrollView>
			</KeyboardAvoidingView>
		</ThemedView>
	)
}
