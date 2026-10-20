import { useTheme } from "@/hooks/useTheme"
import { ChartData } from "@/types/seller-types"
import { View } from "react-native"
import { ThemedText } from "./themed-text"

export const Chart = ({ data }: { data: ChartData[] }) => {
	const { colors } = useTheme()

	console.log(JSON.stringify(data, null, 2))

	return (
		<View style={{
			flexDirection: 'row',
			gap: 5,
			justifyContent: 'flex-end',
			paddingVertical: 10,
			borderRadius: 12,
			paddingHorizontal: 10,
			backgroundColor: colors.surface
		}}>

			{data.length <= 0 ?
				<View style={{ flex: 1, height: 120, alignItems: 'center', justifyContent: 'center', }}>
					<ThemedText type="defaultFaded">nothing to see here</ThemedText>
				</View>

				: data?.map((item, index) => {
					const max = Math.max(...data.map((d) => d.value), 1)
					const pct = Math.max((item.value / max) * 100, 3)
					const isLatest = index === data.length - 1

					return (
						<View key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', paddingTop: 10 }}>

							<View key={index} style={{ width: '100%', height: 120, justifyContent: 'flex-end' }}>
								<View style={{ width: '100%', alignItems: 'center' }}>
									{<ThemedText type="smallFaded" style={{ color: isLatest ? colors.text : colors.placeholder }}>{item.value.toLocaleString()}</ThemedText>}
								</View>
								<View style={{
									width: '100%',
									height: `${pct}%`,
									borderRadius: 8,
									backgroundColor: colors.accent,
									opacity: isLatest ? 1 : 0.6
								}}
								/>
							</View>
							<View style={{ alignItems: 'center', gap: 1 }}>
								<ThemedText type="smallFaded" numberOfLines={1} ellipsizeMode="tail">
									{item.label_start}
								</ThemedText>
								{item.label_end &&
									<View style={{ borderTopWidth: 1, borderColor: colors.disabled }}>
										<ThemedText type="smallFaded" numberOfLines={1} ellipsizeMode="tail">
											{item.label_end}
										</ThemedText>
									</View>
								}
							</View>
						</View>
					)
				}
				)}
		</View>

	)

}

