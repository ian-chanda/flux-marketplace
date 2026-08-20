import { useTheme } from "@/hooks/useTheme"
import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity, View } from "react-native"
import { ThemedText } from "./themed-text"

export const CardButtonRow = ({
	icon,
	label,
	onPress,
	right,
	desc,
	destructive,
}: {
	icon?: any
	label: string
	desc?: string
	onPress?: () => void
	right?: React.ReactNode
	destructive?: boolean
}) => {
	const { colors } = useTheme()
	return (
		<TouchableOpacity
			disabled={!onPress}
			onPress={onPress}
			style={{
				flexDirection: "row",
				alignItems: "center",
				padding: 10,
				borderRadius: 15,
				height: 55,
				backgroundColor: colors.surface,
				justifyContent: "space-between",
			}}
		>
			<View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
				{icon && (
					<MaterialIcons
						name={icon}
						size={20}
						color={destructive ? colors.error ?? "red" : colors.text}
					/>
				)}
				<View>
					<ThemedText style={destructive ? { color: colors.error ?? "red" } : undefined}>
						{label}
					</ThemedText>
					{desc &&
						<ThemedText
							type="smallFaded"
							numberOfLines={1}
							ellipsizeMode="tail"
							style={destructive ?
								{ color: colors.error ?? "red" }
								: undefined}
						>
							{desc}
						</ThemedText>
					}
				</View>
			</View>

			{right ?? <MaterialIcons name="chevron-right" size={20} color={colors.accent} />}
		</TouchableOpacity>
	)
}

