import { CustomHeader } from '@/components/customHeader';
import { ProductCardH } from '@/components/productCardH';
import { SearchBarButton } from '@/components/searchBarButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/useTheme';
import { searchListings } from '@/services/listings';
import { getSavedListingIds, saveListing, unsaveListing } from '@/services/savedListings';
import { useAuth } from '@/contexts/auth-context';
import { Listing } from '@/types/listing';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, TouchableOpacity, View } from 'react-native';

type SortOption = "newest" | "price_asc" | "price_desc";

export default function ResultsScreen() {
	const { colors } = useTheme()
	const { user } = useAuth()
	const { query, category, minPrice, maxPrice, condition, sort } = useLocalSearchParams<{
		query?: string;
		category?: string;
		minPrice?: string;
		maxPrice?: string;
		condition?: string;
		sort?: SortOption;
	}>()
	const [listings, setListings] = useState<Listing[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(false)
	const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({})

	const load = useCallback(async () => {
		setLoading(true)
		setError(false)
		try {
			const numMin = Number(minPrice)
			const numMax = Number(maxPrice)
			const results = await searchListings({
				query: query ?? undefined,
				category: category ?? undefined,
				minPrice: minPrice && !isNaN(numMin) && numMin > 0 ? numMin : undefined,
				maxPrice: maxPrice && !isNaN(numMax) && numMax > 0 ? numMax : undefined,
				condition: condition?.split(',') ?? undefined,
				sort: sort ?? undefined,
			})
			setListings(results)
		} catch {
			setError(true)
			setListings([])
		} finally {
			setLoading(false)
		}
	}, [query, category, minPrice, maxPrice, condition, sort])

	useFocusEffect(
		useCallback(() => {
			load()
			if (user) {
				getSavedListingIds(user.id).then((ids) => {
					setBookmarked(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {}))
				}).catch(() => setBookmarked({}))
			}
		}, [load, user])
	)

	const toggleBookmark = useCallback(async (id: string) => {
		if (!user) return
		const next = !bookmarked[id]
		setBookmarked((prev) => ({ ...prev, [id]: next }))
		try {
			if (next) {
				await saveListing(user.id, id)
			} else {
				await unsaveListing(user.id, id)
			}
		} catch {
			setBookmarked((prev) => ({ ...prev, [id]: !next }))
		}
	}, [user, bookmarked])

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
								bookmarked={!!bookmarked[item.id]}
								onBookmark={() => toggleBookmark(item.id)}
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