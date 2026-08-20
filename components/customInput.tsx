import { ThemedText } from "@/components/themed-text"
import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import {
	KeyboardTypeOptions,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"

type customInputFieldProps = {
	label?: string
	value: string
	onChangeText: (text: string) => void
	placeholder?: string
	error?: string
	helperText?: string

	// type/behavior
	secure?: boolean // masks input + adds show/hide toggle (for passwords)
	keyboardType?: KeyboardTypeOptions // e.g. "email-address", "numeric", "phone-pad"
	autoCapitalize?: "none" | "sentences" | "words" | "characters"
	autoCorrect?: boolean
	multiline?: boolean
	numberOfLines?: number
	maxLength?: number
	editable?: boolean

	// decoration
	icon?: any // MaterialIcons name, shown on the left
	onIconPress?: () => void // if you want the left icon to be actionable too
	rightElement?: React.ReactNode // custom right-side content (overrides secure toggle if provided)

	// misc
	autoFocus?: boolean
	onSubmitEditing?: () => void
	returnKeyType?: "done" | "next" | "go" | "search" | "send"
}

export const CustomInputField = ({
	label,
	value,
	onChangeText,
	placeholder,
	error,
	helperText,
	secure = false,
	keyboardType = "default",
	autoCapitalize = "sentences",
	autoCorrect = true,
	multiline = false,
	numberOfLines,
	maxLength,
	editable = true,
	icon,
	onIconPress,
	rightElement,
	autoFocus,
	onSubmitEditing,
	returnKeyType,
}: customInputFieldProps) => {
	const { colors } = useTheme()
	const [secureVisible, setSecureVisible] = useState(false)

	const IconWrapper = onIconPress ? TouchableOpacity : View

	return (
		<View style={{ gap: 6 }}>
			{label ? <ThemedText type="defaultBold">{label}</ThemedText> : null}

			<View
				style={{
					flexDirection: "row",
					alignItems: multiline ? "flex-start" : "center",
					backgroundColor: colors.surface,
					borderRadius: 15,
					paddingHorizontal: 14,
					paddingVertical: multiline ? 12 : 0,
					minHeight: 50,
					borderWidth: error ? 1 : 0,
					borderColor: error ? (colors.error ?? "red") : "transparent",
					opacity: editable ? 1 : 0.5,
				}}
			>
				{icon ? (
					<IconWrapper
						onPress={onIconPress}
						hitSlop={10}
						style={{ marginRight: 10 }}
					>
						<MaterialIcons name={icon} size={20} color={colors.accent} />
					</IconWrapper>
				) : null}

				<TextInput
					value={value}
					onChangeText={onChangeText}
					placeholder={placeholder}
					placeholderTextColor={colors.disabled}
					secureTextEntry={secure && !secureVisible}
					keyboardType={keyboardType}
					autoCapitalize={secure ? "none" : autoCapitalize}
					autoCorrect={secure ? false : autoCorrect}
					multiline={multiline}
					numberOfLines={numberOfLines}
					maxLength={maxLength}
					editable={editable}
					autoFocus={autoFocus}
					onSubmitEditing={onSubmitEditing}
					returnKeyType={returnKeyType}
					style={{
						flex: 1,
						color: colors.text,
						fontSize: 15,
						height: multiline ? undefined : "100%",
						textAlignVertical: multiline ? "top" : "center",
					}}
				/>

				{rightElement ??
					(secure ? (
						<TouchableOpacity onPress={() => setSecureVisible((v) => !v)} hitSlop={10}>
							<MaterialIcons
								name={secureVisible ? "visibility-off" : "visibility"}
								size={20}
								color={colors.accent}
							/>
						</TouchableOpacity>
					) : null)}
			</View>

			{error ? (
				<ThemedText type="smallFaded" style={{ color: colors.error ?? "red" }}>
					{error}
				</ThemedText>
			) : helperText ? (
				<ThemedText type="smallFaded">{helperText}</ThemedText>
			) : null}
		</View>
	)
}
