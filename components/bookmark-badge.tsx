import { useTheme } from "@/hooks/useTheme"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { TouchableOpacity } from "react-native"

export const BookmarkBadge = ({
	bookmarked,
	onPress
}: { bookmarked: boolean, onPress: () => void }) => {
	const { colors } = useTheme()
	return (
		<TouchableOpacity
			style={{
				position: 'absolute',
				backgroundColor: colors.accent,
				top: 5,
				right: 5,
				borderRadius: 100,
				width: 30,
				height: 30,
				alignItems: 'center',
				justifyContent: 'center',
				zIndex: 100
			}}
			onPress={() => onPress()}>
			<MaterialIcons
				name={bookmarked ? "bookmark" : "bookmark-outline"}
				size={15} color={colors.background} />
		</TouchableOpacity>

	)
}
