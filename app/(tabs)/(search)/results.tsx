import { BookmarkBadge } from '@/components/bookmark-badge';
import { CustomHeader } from '@/components/customHeader';
import { ProductCardH } from '@/components/productCardH';
import { SearchBarButton } from '@/components/searchBarButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSearchListings } from '@/hooks/use-search-listings';
import { useTheme } from '@/hooks/useTheme';
import { attributesToString } from '@/utils/misc';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, TouchableOpacity, View } from 'react-native';

const search_results = [
	{ id: 1, name: "Product THREEE HUNDRED AND NIGETU", Desc: 'new', image: 'url', price: "K2", delivery: "" },
	{ id: 2, name: "Product 2", Desc: 'pre-owned', image: 'url', price: "K3", delivery: 'free delivery' },
	{ id: 3, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: "k50 delivery" },
	{ id: 4, name: "Product 4", Desc: 'new', image: 'url', price: "K5", delivery: "k150 delivery" },
	{ id: 5, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: 'free delivery' },
	{ id: 6, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: 'free delivery' },
	{ id: 7, name: "Product 3", Desc: 'used-like new', image: 'url', price: "K4", delivery: 'free delivery' },
]

export const LoadingScreen = () => {
	const { colors } = useTheme()
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<ActivityIndicator size={"large"} color={colors.accent} />
		</View>
	)
}

export default function ProfileScreen() {
	const { colors } = useTheme()
	const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({});
	const { query } = useLocalSearchParams()
	const { data, loading, refetch } = useSearchListings({ query: query as string })

	return (
		<ThemedView isTabVisible>
			<CustomHeader showBack>
				<SearchBarButton
					width={'85%'}
					placeholder={query ? query as string : 'searched item'}
				/>

			</CustomHeader>
			{loading ?
				<LoadingScreen />
				:
				< View style={{ flex: 1, marginTop: 10, paddingHorizontal: 5 }}>
					<FlatList
						data={data}
						contentContainerStyle={{ gap: 16 }}
						renderItem={({ item }) => {
							return (
								<ProductCardH
									id={item.id}
									img={item.images?.[0]}
									desc={item.title}
									condition={item.condition ?? undefined}
									price={item.price}
									bookmarked={bookmarked[item?.id]}
									location={item.location}
									postedAt={item.created_at}
									specs={attributesToString(item.attributes)}
									deliveryAvailable={item.delivery_available}
									pickupAvailable={item.pickup_available}
									available={item.is_available}
								/>

							)
						}}
						keyExtractor={(item) => item.id.toString()}
					/>
				</View>
			}
		</ThemedView >
	);
}
