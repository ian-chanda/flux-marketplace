import { useTheme } from "@/hooks/useTheme"
import { View } from "react-native"
import { Fragment } from "react/jsx-runtime"
import { ThemedText } from "./themed-text"

export const StatsRow = ({ stats }: { stats: any[] }) => {
	const { colors } = useTheme()

	return (
		<View style={{
			width: '100%',
			backgroundColor: colors.surface,
			borderRadius: 12,
			flexDirection: 'row',
		}}>
			{stats?.map((item, index) => (
				<Fragment key={index}>
					{index > 0 && <View style={{ width: 2, height: '100%', backgroundColor: colors.background }} />}
					<View style={{ paddingVertical: 10, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<ThemedText type="subtitle">{item.value}</ThemedText>
						<ThemedText type="smallFaded">{item.label}</ThemedText>
					</View>
				</Fragment>
			))}
		</View>

	)
}

