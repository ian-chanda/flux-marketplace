// src/app/(tabs)/search.tsx
import { CustomSearchBar } from '@/components/customSearchBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/useTheme';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  FlatList, View,
  TouchableOpacity, StyleSheet
} from 'react-native';

const RecentTabData = [
  { id: 1, name: "recent title 1", },
  { id: 2, name: "recent title 2", },
  { id: 3, name: "recent title 3", },
  { id: 4, name: "recent title 4", },
  { id: 5, name: "recent title 5", },
]

const SavedTabData = [
  { id: 1, name: "saved title 1", },
  { id: 2, name: "saved title 2", },
  { id: 3, name: "saved title 3", },
  { id: 4, name: "saved title 4", },
  { id: 5, name: "saved title 5", },
]

export default function SearchScreen() {
  const { colors } = useTheme()
  const [searchValue, setSearchValue] = useState('')
  const [activeTab, setActiveTab] = useState<'recent' | 'saved'>('recent')
  const {value} = useLocalSearchParams()

  useEffect(() => {
    if(value && value !== "search...")
      setSearchValue(value as string)

  }, [value])

  const tabData = activeTab === 'recent' ? RecentTabData : SavedTabData;

  return (
    <ThemedView isTabVisible style={{ paddingHorizontal: 10 }}>

      <CustomSearchBar
        width={'100%'}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        onSearch={() => router.push({
          pathname: '/results',
          params: {query: searchValue}
        })}
      />

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

      <FlatList
        data={tabData}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => router.push({
                pathname: '/results',
                params: { query: item.name}
              })}
            >
              <ThemedText type="defaultFaded" numberOfLines={1}>{item.name}</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialIcons name="close" size={20} color={colors.accent} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />


    </ThemedView>
  );
}

const styles = StyleSheet.create({
  search_container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  search_icon: {
    position: "absolute",
    right: 7,
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
    width: "100%",
    borderRadius: 20,
  },

})
