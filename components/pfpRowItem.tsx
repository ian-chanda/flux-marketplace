import { TouchableOpacity, View } from "react-native"
import { PfpItem } from "./pfp-item"
import { ThemedText } from "./themed-text"
import { VerifiedBadge } from "./verified-badge"
import { MaterialIcons } from "@expo/vector-icons"
import { useTheme } from "@/hooks/useTheme"

export const PfpRowItem = ({
	fName,
	lName,
	username,
	imageUrl,
	isVerified,
	onPress
}: {
	fName: string,
	lName: string,
	username: string,
	onPress: () => void,
	imageUrl: string,
	isVerified: boolean
}) => {


	const { colors } = useTheme()

	return (
		<TouchableOpacity
			onPress={() => onPress()}
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				padding: 10,
				borderRadius: 15,
				backgroundColor: colors.surface,
				justifyContent: 'space-between',
				marginBottom: 15
			}}>
			<View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
				<PfpItem
					image={`${imageUrl}`}
					name={`${fName} ${lName}`}
					size="small"
				/>
				<View style={{}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
						<ThemedText type='largeBold'>
							{fName ?? "unknown"} {lName ?? "unknown"}
						</ThemedText>
						{isVerified &&
							<VerifiedBadge />
						}
					</View>
					<ThemedText type='small'>@{username ?? "unknown123"}</ThemedText>
				</View>
			</View>

			<MaterialIcons name='chevron-right' size={20} color={colors.accent} />
		</TouchableOpacity>

	)
}
