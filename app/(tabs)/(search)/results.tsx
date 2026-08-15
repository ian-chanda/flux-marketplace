import { BookmarkBadge } from '@/components/bookmark-badge';
import { CustomHeader } from '@/components/customHeader';
import { SearchBarButton } from '@/components/searchBarButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';

const search_results = [
	{ id: 1, name: "Product THREEE HUNDRED AND NIGETU", Desc: 'new', image: 'url', price: "K2", delivery: "" },
	{ id: 2, name: "Product 2", Desc: 'pre-owned', image: 'url', price: "K3", delivery: 'free delivery' },
	{ id: 3, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: "k50 delivery" },
	{ id: 4, name: "Product 4", Desc: 'new', image: 'url', price: "K5", delivery: "k150 delivery" },
	{ id: 5, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: 'free delivery' },
	{ id: 6, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: 'free delivery' },
	{ id: 7, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: 'free delivery' },
]

export default function ProfileScreen() {
	const { colors } = useTheme()
	const [bookmarked, setBookmarked] = useState<Record<number, boolean>>({});
	const { query } = useLocalSearchParams()

	const toggleBookmark = (id: number) => {
		setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<ThemedView isTabVisible>

			{/* header */}
			<CustomHeader showBack>
				<SearchBarButton
					width={'85%'}
					placeholder={query ? query as string : 'searched item'}
				/>

			</CustomHeader>
			<View style={{ flex: 1, marginTop: 10, paddingHorizontal: 5 }}>
				<FlatList
					data={search_results}
					contentContainerStyle={{ gap: 16 }}
					renderItem={({ item }) => (
						<TouchableOpacity style={{ flexDirection: 'row', gap: 10 }}>

							<View>

								<BookmarkBadge bookmarked={bookmarked[item.id]} onPress={() => toggleBookmark(item.id)} />
								<Image
									source={require('@/assets/images/dino.jpg')}
									style={{ borderRadius: 12, width: 150, height: 150 }}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<ThemedText type='smallFaded'>{item.Desc}</ThemedText>
								<ThemedText type='mediumBold' ellipsizeMode='tail'>
									{item.name}
								</ThemedText>
								<ThemedText type='defaultBold'>{item.price}</ThemedText>
								<ThemedText type='mediumFaded'>{item.delivery ? item.delivery : "contact for delivery"}</ThemedText>
							</View>
						</TouchableOpacity>
					)}
					keyExtractor={(item) => item.id.toString()}
				/>
			</View>
		</ThemedView>
	);
}
