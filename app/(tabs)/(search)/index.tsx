// src/app/(tabs)/search.tsx
import { CustomSearchBar } from '@/components/customSearchBar';
import { ProductCardH } from '@/components/productCardH';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/contexts/auth-context';
import { searchListings } from '@/services/listings';
import { getRecentViews, removeRecentView } from '@/services/recentlyViewed';
import { getSavedListingIds, getSavedListings, saveListing, unsaveListing } from '@/services/savedListings';
import { Listing } from '@/types/listing';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList, View,
  TouchableOpacity, ActivityIndicator
} from 'react-native';

export default function SearchScreen() {
  const { colors } = useTheme()
  const { user } = useAuth()
  const { value } = useLocalSearchParams()
  const [searchValue, setSearchValue] = useState(() =>
    typeof value === 'string' && value !== 'search...' ? value : ''
  )
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent')
  const [recents, setRecents] = useState<Listing[]>([])
  const [saved, setSaved] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Listing[]>([])
  const [searching, setSearching] = useState(false)
  const [bookmarked, setBookmarked] = useState<Record<string, boolean>>({})
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const hasQuery = searchValue.trim().length > 0

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const [r, s, ids] = await Promise.all([
      getRecentViews(user.id).catch(() => []),
      getSavedListings(user.id).catch(() => []),
      getSavedListingIds(user.id).catch(() => []),
    ])
    setRecents(r)
    setSaved(s)
    setBookmarked(ids.reduce((acc, id) => ({ ...acc, [id]: true }), {}))
    setLoading(false)
  }, [user])

  useFocusEffect(
    useCallback(() => {
      load()
    }, [load])
  )

  useEffect(() => {
    return () => clearTimeout(searchTimeout.current)
  }, [])

  const runSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    try {
      const found = await searchListings({ query: term })
      setResults(found)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleChangeText = useCallback((text: string) => {
    clearTimeout(searchTimeout.current)
    setSearchValue(text)
    searchTimeout.current = setTimeout(() => runSearch(text), 300)
  }, [runSearch])

  const openResults = useCallback(() => {
    if (!searchValue.trim()) return
    clearTimeout(searchTimeout.current)
    runSearch(searchValue)
    router.push({ pathname: '/results', params: { query: searchValue } })
  }, [searchValue, runSearch])

  const toggleBookmark = useCallback(async (id: string) => {
    if (!user) return
    const next = !bookmarked[id]
    const optimistic = (prev: Record<string, boolean>) => ({ ...prev, [id]: next })
    setBookmarked(optimistic)
    try {
      if (next) {
        await saveListing(user.id, id)
      } else {
        await unsaveListing(user.id, id)
      }
    } catch {
      setBookmarked(prev => ({ ...prev, [id]: !next }))
    }
  }, [user, bookmarked])

  const removeItem = useCallback(async (listingId: string) => {
    if (!user) return
    if (activeTab === 'recent') {
      setRecents(prev => prev.filter((l) => l.id !== listingId))
      try { await removeRecentView(user.id, listingId) } catch { }
    } else {
      setSaved(prev => prev.filter((l) => l.id !== listingId))
      try { await unsaveListing(user.id, listingId) } catch { }
    }
  }, [user, activeTab])

  const listData = activeTab === 'recent' ? recents : saved

  return (
    <ThemedView isTabVisible style={{ paddingHorizontal: 10 }}>

      <CustomSearchBar
        width={'100%'}
        searchValue={searchValue}
        setSearchValue={handleChangeText}
        onSearch={openResults}
      />

      {hasQuery ? (
        <View style={{ flex: 1, marginTop: 15 }}>
          {searching ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : results.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ThemedText type="defaultFaded">No results for “{searchValue.trim()}”.</ThemedText>
            </View>
          ) : (
            <FlatList
              data={results}
              contentContainerStyle={{ gap: 16, paddingBottom: 20 }}
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
      ) : (
        <>
          {/* TABS */}
          <View>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 20, marginBottom: 20 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  borderBottomWidth: activeTab === 'recent' ? 2 : 0,
                  borderColor: colors.accent
                }}
                onPress={() => setActiveTab('recent')}
              >
                <ThemedText>Recent</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 5,
                  borderBottomWidth: activeTab === 'saved' ? 2 : 0,
                  borderColor: colors.accent
                }}
                onPress={() => setActiveTab('saved')}
              >
                <ThemedText>Saved</ThemedText>
              </TouchableOpacity>

            </View>
          </View>
          {/* TABS END */}

          {loading ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : listData.length === 0 ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ThemedText type="defaultFaded">
                {activeTab === 'recent' ? 'No recently viewed items yet.' : 'No saved items yet.'}
              </ThemedText>
            </View>
          ) : (
            <FlatList
              data={listData}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <TouchableOpacity
                    style={{ flex: 1, paddingRight: 10 }}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <ThemedText type="defaultFaded" numberOfLines={1}>{item.title}</ThemedText>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <MaterialIcons name="close" size={20} color={colors.accent} />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
        </>
      )}

    </ThemedView>
  );
}