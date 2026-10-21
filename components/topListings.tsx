import { useTheme } from "@/hooks/useTheme";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { router } from "expo-router";

type TopListing = { id: string; title: string; views: number; inquiries: number; price: number };


const TopListingRow = ({ item, last }: { item: TopListing; last: boolean }) => {
	const { colors } = useTheme();
	return (
		<>
			<TouchableOpacity
				onPress={() => router.push(`/product/${item.id}`)}
				style={styles.listingRow}
			>
				<View style={{ flex: 1, gap: 2 }}>
					<ThemedText type="defaultBold" numberOfLines={1}>
						{item.title}
					</ThemedText>
					<ThemedText type="smallFaded">
						{item.views.toLocaleString()} views · {item.inquiries} inquiries
					</ThemedText>
				</View>
				<ThemedText type="defaultBold" style={{ color: colors.accent }}>
					K{item.price.toLocaleString()}
				</ThemedText>
			</TouchableOpacity>
			{!last && <View style={[styles.rowDivider, { backgroundColor: colors.background }]} />}
		</>
	);
};

export function TopListings({ listings }: { listings: any[] }) {
	const { colors } = useTheme();
	return (
		<View style={[styles.group, { backgroundColor: colors.surface }]}>
			{listings?.map((item, index) => (
				<TopListingRow key={item.id} item={item} last={index === listings.length - 1} />
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	group: {
		borderRadius: 12,
		overflow: "hidden",
	},
	listingRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: 12,
		padding: 14,
	},
	rowDivider: {
		height: 2,
	},
});
