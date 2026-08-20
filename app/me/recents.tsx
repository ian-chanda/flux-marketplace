import { CustomHeader } from "@/components/customHeader";
import { FormField } from "@/components/formFiled";
import { ProductCardH } from "@/components/productCardH";
import { ProductCardV } from "@/components/productCardV";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/useTheme";
import { useState } from "react";
import { FlatList, Platform, View } from "react-native";
import { ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native";

const items = [
	{ id: 1, name: "Iphone 23 pro max", Desc: "new", price: "K34000" },
	{ id: 2, name: "Samsung Galaxy S24", Desc: "like new", price: "K28500" },
	{ id: 3, name: "MacBook Pro 14", Desc: "used", price: "K45000" },
	{ id: 4, name: "Sony WH-1000XM5", Desc: "new", price: "K8200" },
	{ id: 5, name: "iPad Air 6", Desc: "fair condition", price: "K18000" },
	{ id: 6, name: "AirPods Pro Max", Desc: "new", price: "K24500" },
	{ id: 7, name: "Dell XPS 15", Desc: "used", price: "K22000" },
	{ id: 8, name: "Nintendo Switch", Desc: "like new", price: "K7500" },
	{ id: 9, name: "Canon EOS R6", Desc: "used", price: "K32000" }
]

export default function SavedScreen() {

	const {colors} = useTheme()
	const initialBookmarked = items.reduce((acc, item) => {
		acc[item.id] = true;
		return acc;
	}, {} as Record<number, boolean>);

	const [bookmarked, setBookmarked] = useState(initialBookmarked);
	const toggleBookmark = (id: number) => {
		setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
	};
	return (
		<ThemedView isTabVisible={false} style={{ flexGrow: 1 }}>
			<CustomHeader showBack title="Recently Viewed" />
			<FlatList
				data={items}
				style={{ paddingHorizontal: 10 }}
				contentContainerStyle={{ gap: 10 }}
				renderItem={({ item }) => (
					<View style={{borderBottomWidth: 1, paddingBottom: 10, borderColor: colors.disabled}}>
						<ProductCardH
							bookmarked={bookmarked[item.id]}
							desc={item.Desc}
							name={item.name}
							price={item.price}
							showMore={true}
						/>
					</View>
				)}
				keyExtractor={(item) => item.id.toString()}
			/>

		</ThemedView>
	)
}
