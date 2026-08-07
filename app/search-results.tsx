import { BookmarkBadge } from '@/components/bookmark-badge';
import { CustomSearchBar } from '@/components/customSearchBar';
import { SearchBarButton } from '@/components/searchBarButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/useTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image } from 'react-native';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


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

	const toggleBookmark = (id: number) => {
		setBookmarked(prev => ({ ...prev, [id]: !prev[id] }));
	};

	return (
		<ThemedView isTabViisble={false}>

			{/* header */}
			<View style={{
				flexDirection: 'row',
				height: 60,
				width: '100%',
				justifyContent: 'space-evenly',
				alignItems: 'center'
			}}>
				<TouchableOpacity
					onPress={() => router.back()}
					style={{
						width: 40,
						height: 50,
						borderRadius: 12,
						backgroundColor: colors.surface,
						alignItems: 'center',
						justifyContent: 'center'
					}}
				>
					<MaterialIcons name='chevron-left' color={colors.accent} size={24} />
				</TouchableOpacity>

				<SearchBarButton
					width={'70%'}
					placeholder='searched item'
				/>
			</View>
			<View style={{ flex: 1, marginTop: 10, paddingHorizontal: 5 }}>
				<FlatList
					data={search_results}
					contentContainerStyle={{ gap: 16 }}
					renderItem={({ item }) => (
						<View style={{ flexDirection: 'row', gap: 10 }}>

							<View>

								<BookmarkBadge bookmarked={bookmarked[item.id]} onPress={() => toggleBookmark(item.id)} />
								<Image
									source={require('@/assets/images/dino.jpg')}
									style={{ borderRadius: 12, width: 150, height: 150 }}
								/>
							</View>
							<View style={{ flex: 1 }}>
								<ThemedText type='small_price_font'>{item.Desc}</ThemedText>
								<ThemedText type='defaultBold' ellipsizeMode='tail'>
									{item.name}
								</ThemedText>
								<ThemedText type='subtitle'>{item.price}</ThemedText>
								<ThemedText type='default'>{item.delivery ? item.delivery : "contact for delivery"}</ThemedText>
							</View>
						</View>
					)}
					keyExtractor={(item) => item.id.toString()}
				/>
			</View>
		</ThemedView>
	);
}
