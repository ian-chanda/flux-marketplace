import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"

export const VerifiedBadge = () => {
	const { colors } = useTheme()
	return (
		<MaterialIcons name='verified' color={colors.link} size={15} />
	)
}
