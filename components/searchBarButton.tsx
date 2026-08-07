import { StyleSheet, TouchableOpacity } from "react-native"
import { ThemedText } from "./themed-text"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { router } from "expo-router"
import { useTheme } from "@/hooks/useTheme"


export const SearchBarButton = ({ placeholder, width }: { placeholder: string, width: any }) => {
	const { colors } = useTheme()
	return (
		<TouchableOpacity
			onPress={() => router.push({
				pathname: '/(tabs)/(search)',
				params: {value: placeholder}
			})}
			style={[
				styles.search_container, {
					width: width,
					backgroundColor: colors.surface
				}]}
		>
			<ThemedText style={{ color: colors.placeholder }}> {placeholder}</ThemedText>

			<MaterialIcons name="search" size={24} color={colors.accent} />
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	search_container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: 'space-between',
		borderRadius: 30,
		paddingHorizontal: 10,
		paddingVertical: 12,
	},

})
