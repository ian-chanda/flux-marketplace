import Button from '@/components/Button';
import { CardButtonRow } from '@/components/cardButtonRow';
import { CustomHeader } from '@/components/customHeader';
import { IconButton } from '@/components/iconButton';
import { PfpItem } from '@/components/pfp-item';
import { PfpRowItem } from '@/components/pfpRowItem';
import { SettingsSection } from '@/components/settingsSection';
import { RowProfile } from '@/components/skeletons/rowProfileSkeleton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DarkModeToggle } from '@/components/toggleButton';
import { VerifiedBadge } from '@/components/verified-badge';
import { useAuth } from '@/contexts/auth-context';
import { useUser } from '@/hooks/use-user';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {

  const { colors, context } = useTheme()
  const isDark = context?.theme === 'dark'
  const { signOut, user, isLoading } = useAuth()

  const [isFetching, setIsFetching] = useState(false)
  const { userData, loading } = useUser()

  const avatar = userData?.avatar_url ?? ""

  return (
    <ThemedView isTabVisible style={{}}>
      <CustomHeader title="My Profile">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <IconButton icon={"notifications"} onPress={() => router.push('/notifications')} badgeValue='9+' />
          <IconButton icon={"shopping-cart"} onPress={() => router.push('/cart')} badgeValue='2' />
        </View>
      </CustomHeader>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>

        {loading ?
          <RowProfile />
          :
          <PfpRowItem 
            imageUrl={`${avatar}?v=${userData?.updated_at}`}
            fName={userData?.first_name ?? "unknown"}
            lName={userData?.last_name ?? "unknown"}
            username={userData?.username ?? "unknown123"}
            isVerified={userData?.is_verified ?? false}
            onPress={() => router.push('/me/profile')}
          />
        }

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

        <Button title='Logout' loading={isLoading} onPress={() => signOut()} />

      </ScrollView>
    </ThemedView>
  );
}
