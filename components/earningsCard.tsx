import { useTheme } from "@/hooks/useTheme";
import { ThemedText } from "./themed-text";
import { View } from "react-native";

export const EarningsCard = ({ listings, topText, }: { listings: any[], topText: string }) => {
	const { colors } = useTheme()
	const earnings = listings?.filter((l) => l.is_sold_within_timeframe === true).reduce(
		(sum, listing) => sum + (listing.price ?? 0),
		0
	);
	const sales = listings?.filter((l) => l.is_sold_within_timeframe === true).length;

	return (
		<View style={{ paddingVertical: 15, paddingHorizontal: 10, borderRadius: 12, backgroundColor: colors.surface, gap: 5 }}>
			<ThemedText type="defaultFaded">
				{topText}
			</ThemedText>
			<ThemedText type="title" style={{ color: colors.accent }}>
				K{earnings.toLocaleString()}
			</ThemedText>
			<ThemedText type="smallFaded">from {sales} sales</ThemedText>
		</View>
	)
}
