import { ThemedText } from "@/components/themed-text"
import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"

type customButtonFieldProps = {
	label?: string
	value?: string // what's currently selected
	placeholder?: string // shown when there is no value
	onPress: () => void
	error?: string
	helperText?: string
	disabled?: boolean

	// decoration, same as CustomInputField
	icon?: any // MaterialIcons name, shown on the left
	rightElement?: React.ReactNode // replaces the default chevron
	numberOfLines?: number // how many lines of the value to show
}

export const CustomButtonField = ({
	label,
	value,
	placeholder,
	onPress,
	error,
	helperText,
	disabled = false,
	icon,
	rightElement,
	numberOfLines = 1,
}: customButtonFieldProps) => {
	const { colors } = useTheme()

	return (
		<View style={{ gap: 6 }}>
			{label ? <ThemedText type="defaultFaded">{label}</ThemedText> : null}

			<TouchableOpacity
				onPress={onPress}
				disabled={disabled}
				activeOpacity={0.7}
				style={{
					flexDirection: "row",
					alignItems: "center",
					backgroundColor: colors.surface,
					borderRadius: 15,
					paddingHorizontal: 14,
					paddingVertical: 12,
					minHeight: 50,
					borderWidth: error ? 1 : 0,
					borderColor: error ? (colors.error ?? "red") : "transparent",
					opacity: disabled ? 0.5 : 1,
				}}
			>
				{icon ? (
					<MaterialIcons
						name={icon}
						size={20}
						color={colors.accent}
						style={{ marginRight: 10 }}
					/>
				) : null}

				<ThemedText
					numberOfLines={numberOfLines}
					style={{
						flex: 1,
						fontSize: 15,
						// same colours the text input uses for its value and placeholder
						color: value ? colors.text : colors.disabled,
					}}
				>
					{value || placeholder}
				</ThemedText>

				{rightElement ?? (
					<ThemedText style={{ color: colors.placeholder, fontSize: 22, lineHeight: 24 }}>
						›
					</ThemedText>
				)}
			</TouchableOpacity>

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
