import { useTheme } from "@/hooks/useTheme"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import {
	TouchableOpacity, StyleSheet,
	TextInput, View
} from "react-native"

type searchTypes = {
	width: any,
	searchValue: string;
	setSearchValue: React.Dispatch<React.SetStateAction<string>>;
	onSearch: () => void;
}

export const CustomSearchBar = ({ width, searchValue, setSearchValue, onSearch }: searchTypes) => {
	const { colors } = useTheme()

	return (
		<View
			style={[styles.search_container, {
				width: '100%',
				backgroundColor: colors.surface }]}>
			<TextInput
				style={[styles.input, { color: colors.text, backgroundColor: colors.surface }]}
				onChangeText={setSearchValue}
				value={searchValue}
				placeholderTextColor={colors.placeholder}
				placeholder="Search.."
			/>

			<TouchableOpacity onPress={() => onSearch()}>
				<MaterialIcons name="search" size={24} color={colors.accent} />
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	search_container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: 'center',
		borderRadius: 30,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	search_icon: {
		position: "absolute",
		right: 7,
	},

	input: {
		flex: 1,
		paddingHorizontal: 15,
		paddingVertical: 12,
		alignItems: 'center',
		width: "100%",
		borderRadius: 20,
	}
})
