import { CustomHeader } from '@/components/customHeader';
import { ProductCardH } from '@/components/productCardH';
import { SearchBarButton } from '@/components/searchBarButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/useTheme';
import { searchListings } from '@/services/listings';
import { Listing } from '@/types/listing';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';

export default function ResultsScreen() {
	const { colors } = useTheme()
	const { query, category } = useLocalSearchParams<{ query?: string; category?: string }>()
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)

	const load = useCallback(async () => {
		setLoading(true)
		setError(false)
		try {
			const results = await searchListings({
				query: query ?? undefined,
				category: category ?? undefined,
			})
			setListings(results)
		} catch {
			setError(true)
			setListings([])
		} finally {
			setLoading(false)
		}
	}, [query, category])

	useFocusEffect(
		useCallback(() => {
			load()
		}, [load])
	)

	return (
		<ThemedView isTabVisible>

			{/* header */}
			<CustomHeader showBack>
				<SearchBarButton
					width={'85%'}
					placeholder={query || category || 'searched item'}
				/>

			</CustomHeader>
			<View style={{ flex: 1, marginTop: 10, paddingHorizontal: 5 }}>
				{loading ? (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<ActivityIndicator size="large" color={colors.accent} />
					</View>
				) : error ? (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 }}>
						<ThemedText type="defaultFaded">Could not load results</ThemedText>
						<TouchableOpacity onPress={load}>
							<ThemedText type="defaultBold" style={{ color: colors.accent }}>Try again</ThemedText>
						</TouchableOpacity>
					</View>
				) : listings.length === 0 ? (
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<ThemedText type="defaultFaded">No results found.</ThemedText>
					</View>
				) : (
					<FlatList
						data={listings}
						contentContainerStyle={{ gap: 16 }}
						renderItem={({ item }) => (
							<ProductCardH
								id={item.id}
								bookmarked={false}
								desc={item.condition ?? item.category}
								name={item.title}
								price={`K${Number(item.price).toLocaleString()}`}
								img={item.images?.[0]}
							/>
						)}
						keyExtractor={(item) => item.id}
					/>
				)}
			</View>
		</ThemedView>
	);
}