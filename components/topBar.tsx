import { useTheme } from '@/hooks/useTheme';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ThemedText } from './themed-text';

export type TopBarProps = {
  title: string;
};

export function TopBar({ title }: TopBarProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.topBar}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <MaterialIcons name="chevron-left" size={33} color={colors.accent} />
      </Pressable>

      <ThemedText type='subtitle'>{title}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    position: "absolute",
    left: 10,
  },
});
