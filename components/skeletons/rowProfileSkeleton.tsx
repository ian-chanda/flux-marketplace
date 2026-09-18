import { SkeletonBlock } from "./skeletonBlock"
import { MaterialIcons } from "@expo/vector-icons"
import { useTheme } from "@/hooks/useTheme"
import { View } from "react-native"

export const RowProfile = () => {
	const {colors} = useTheme()
	return (
		<View
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
				<SkeletonBlock
					style={{
						width: 50,
						height: 50,
						borderRadius: 100,
					}}
				/>
				<View style={{}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
						<SkeletonBlock style={{ width: 160, height: 20 }} />
					</View>
					<SkeletonBlock style={{ width: 100, height: 15 }} />
				</View>
			</View >

			<MaterialIcons name='chevron-right' size={20} color={colors.accent} />
		</View>

	)
}
