import Button from '@/components/Button';
import { CardButtonRow } from '@/components/cardButtonRow';
import { CustomHeader } from '@/components/customHeader';
import { IconButton } from '@/components/iconButton';
import { SettingsSection } from '@/components/settingsSection';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DarkModeToggle } from '@/components/toggleButton';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {

  const { colors, context } = useTheme()
  const isDark = context?.theme === 'dark'


  return (
    <ThemedView isTabVisible style={{}}>
      <CustomHeader title="My Profile">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <IconButton icon={"notifications"} onPress={() => router.push('/notifications')} badgeValue='9+' />
          <IconButton icon={"shopping-cart"} onPress={() => router.push('/cart')} badgeValue='2' />
        </View>
      </CustomHeader>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>

        <TouchableOpacity
          onPress={() => router.push('/me/profile')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderRadius: 15,
            backgroundColor: colors.surface,
            justifyContent: 'space-between',
            marginBottom: 15
          }}>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <Image source={require('@/assets/images/dino.jpg')} style={{
              width: 50,
              height: 50,
              borderRadius: 100
            }} />
            <View style={{}}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <ThemedText type='largeBold'>Admin Admin</ThemedText>
                <MaterialIcons name='verified' color={colors.text} size={15} />
              </View>
              <ThemedText type='small'>@admin9003</ThemedText>
            </View>
          </View>

          <MaterialIcons name='chevron-right' size={20} color={colors.accent} />
        </TouchableOpacity>

        <CardButtonRow
          icon={isDark ? "dark-mode" : "light-mode"}
          label={isDark ? "Dark mode" : "Light mode"}
          right={<DarkModeToggle />}
        />

        <SettingsSection title='Shopping'>
          <CardButtonRow
            icon={"favorite-outline"}
            label='saved'
            onPress={() => router.push("/me/saved")}
          />
          <CardButtonRow
            icon={"money"}
            label='purchases'
            onPress={() => router.push("/me/purchases")}
          />
          <CardButtonRow
            icon={"history"}
            label='recently viewed'
            onPress={() => router.push('/me/recents')}
          />
          <CardButtonRow
            icon={"settings"}
            label='Settings'
            onPress={() => router.push('/me/settings')}
          />
        </SettingsSection>

        <Button title='Logout' onPress={() => { }} />

      </ScrollView>
    </ThemedView>
  );
}
