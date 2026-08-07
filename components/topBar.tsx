import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from './themed-text';

export type TopBarProps = {
  title: string;
  showSearch?: boolean;
};

export function TopBar({ title, showSearch = false }: TopBarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { colors } = useTheme();

  return (
    <View style={styles.topBar}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={30} color={colors.accent} />
      </Pressable>

      {showSearch && isSearchOpen ? (
        <TextInput
          placeholder="Search..."
          placeholderTextColor="#999"
          onChangeText={setSearchText}
          value={searchText}
          autoFocus
          style={[styles.expandedSearch, { color: colors.text, backgroundColor: colors.surface }]}
        />
      ) : (
        <ThemedText type='subtitle'>{title}</ThemedText>
      )}

      {showSearch && (
        <Pressable 
          onPress={() => {
            setIsSearchOpen(!isSearchOpen);
            if (isSearchOpen) setSearchText('');
          }}
          style={[styles.searchButton, { backgroundColor: colors.surface }]}
        >
          <Ionicons name={isSearchOpen ? "close" : "search"} size={24} color={colors.accent} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingBottom: 20
  },
  backButton: {
    flex: 1,
    position: "absolute",
    left: 10,
  },
  expandedSearch: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 10,
  },
  searchButton: {
    position: "absolute",
    right: 10,
    padding: 8,
    borderRadius: 50,
  },
});