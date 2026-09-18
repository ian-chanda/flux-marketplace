import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { RelativePathString, router } from "expo-router"
import { TouchableOpacity, View } from "react-native"
import { ThemedText } from "./themed-text"

type headerTypes = {
	title?: string,
	showBack?: boolean,
	goto?: RelativePathString,
	children?: React.ReactNode
}

export const CustomHeader = ({
	title,
	showBack = false,
	goto,
	children,
}: headerTypes) => {

	const { colors } = useTheme()

	return (
		<View style={{
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			paddingHorizontal: 10,
			height: 60
		}}>
			<View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
				{showBack && (
					<TouchableOpacity
						style={{
							alignItems: 'center',
							justifyContent: 'center',
							borderRadius: 8
						}}
						onPress={() => {
							if (goto) {
								router.replace(goto)
							} else {
								router.back()
							}
						}}>
						<MaterialIcons name="chevron-left" size={32} color={colors.accent} />
					</TouchableOpacity>
				)}
				{title && (
					<ThemedText type="defaultBold">
						{title}
					</ThemedText>
				)}
			</View>
			{children}
		</View>
	)
}
