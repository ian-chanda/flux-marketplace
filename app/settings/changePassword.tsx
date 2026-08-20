import Button from "@/components/Button"
import { CustomHeader } from "@/components/customHeader"
import { CustomInputField } from "@/components/customInput"
import { ThemedText } from "@/components/themed-text"
import { ThemedView } from "@/components/themed-view"
import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react"
import { TextInput, TouchableOpacity, View } from "react-native"

const PasswordField = ({
	label,
	value,
	onChangeText,
	error,
}: {
	label: string
	value: string
	onChangeText: (text: string) => void
	error?: string
}) => {
	const { colors } = useTheme()
	const [visible, setVisible] = useState(false)

	return (
		<View style={{ gap: 6 }}>
			<ThemedText type="defaultBold">{label}</ThemedText>
			<View
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: colors.surface,
					borderRadius: 15,
					paddingHorizontal: 14,
					height: 50,
					borderWidth: error ? 1 : 0,
					borderColor: error ? (colors.error ?? "red") : "transparent",
				}}
			>
				<TextInput
					value={value}
					onChangeText={onChangeText}
					secureTextEntry={!visible}
					placeholder="••••••••"
					placeholderTextColor={colors.disabled}
					style={{
						flex: 1,
						color: colors.text,
						fontSize: 15,
						height: "100%",
					}}
					autoCapitalize="none"
					autoCorrect={false}
				/>
				<TouchableOpacity onPress={() => setVisible((v) => !v)} hitSlop={10}>
					<MaterialIcons
						name={visible ? "visibility-off" : "visibility"}
						size={20}
						color={colors.accent}
					/>
				</TouchableOpacity>
			</View>
			{error ? (
				<ThemedText type="smallFaded" style={{ color: colors.error ?? "red" }}>
					{error}
				</ThemedText>
			) : null}
		</View>
	)
}

export default function ChangePasswordScreen() {
	const { colors } = useTheme()

	const [currentPassword, setCurrentPassword] = useState("")
	const [newPassword, setNewPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [submitting, setSubmitting] = useState(false)
	const [errors, setErrors] = useState<{ current?: string; confirm?: string }>({})

	const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

	const canSubmit =
		currentPassword.length > 0 && passwordsMatch && !submitting

	const handleSubmit = async () => {
		setErrors({})

		if (newPassword !== confirmPassword) {
			setErrors((e) => ({ ...e, confirm: "Passwords don't match" }))
			return
		}

		setSubmitting(true)
		try {
			router.back()
		} catch (err) {
			setErrors((e) => ({ ...e, current: "Current password is incorrect" }))
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<ThemedView isTabVisible={false} style={{ paddingHorizontal: 10, gap: 10 }}>
			<CustomHeader showBack title="Change Password" />

			<View style={{ gap: 20, paddingTop: 10 }}>
				<CustomInputField
					label="Current password"
					placeholder="******"
					value={currentPassword}
					onChangeText={setCurrentPassword}
					error={errors.current}
					secure
					returnKeyType="next"
				/>

				<CustomInputField
					label="New password"
					placeholder="******"
					value={newPassword}
					onChangeText={setNewPassword}
					secure
					returnKeyType="next"
				/>

				<CustomInputField
					label="Confirm new password"
					placeholder="******"
					value={confirmPassword}
					onChangeText={setConfirmPassword}
					error={errors.confirm}
					secure
					returnKeyType="next"
				/>

				<Button
					title={"Update password"}
					loading={submitting}
					onPress={handleSubmit}
					disabled={!canSubmit}
				/>
			</View>
		</ThemedView>
	)
}
