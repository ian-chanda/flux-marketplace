import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import { ThemedText } from "./themed-text"
import { useTheme } from "@/hooks/useTheme"

export const CheckBox = ({ label, checked, onPress }: { label: string, checked: boolean, onPress: () => void }) => {
	const { colors } = useTheme()
	return (
		<TouchableOpacity style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }} onPress={onPress} hitSlop={10}>
			<MaterialIcons name={checked ? "check-box" : "check-box-outline-blank"} size={20} color={colors.accent} />
			<ThemedText>{label}</ThemedText>
		</TouchableOpacity>
	)
}
