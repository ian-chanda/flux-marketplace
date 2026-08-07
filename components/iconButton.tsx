import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"
import { ThemedText } from "./themed-text"

export const IconButton = ({icon, onPress, badgeValue }: { icon:any, badgeValue: string, onPress: () => void }) => {
	const { colors } = useTheme()
	return (
		<TouchableOpacity>
			<View style={{
				alignItems: "flex-start",
				marginBottom: 2,
			}}>
				<TouchableOpacity onPress={() => onPress()}>

					<MaterialIcons name={icon} size={26} color={colors.accent} />

					{/* badge */}
					{badgeValue &&
						<View style={{
							position: 'absolute',
							backgroundColor: colors.accent,
							top: -10,
							right: -5,
							borderRadius: 100,
							width: 18,
							height: 18,
							alignItems: 'center',
							justifyContent: 'center'
						}}>
							<ThemedText type="defaultSmall" style={{ color: colors.background }}>
								{badgeValue}
							</ThemedText>
						</View>
					}
				</TouchableOpacity>
			</View>
		</TouchableOpacity>
	)
}
