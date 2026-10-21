import Button from '@/components/Button';
import { CardButtonRow } from '@/components/cardButtonRow';
import { CustomHeader } from '@/components/customHeader';
import { IconButton } from '@/components/iconButton';
import { PfpRowItem } from '@/components/pfpRowItem';
import { SettingsSection } from '@/components/settingsSection';
import { RowProfile } from '@/components/skeletons/rowProfileSkeleton';
import { ThemedView } from '@/components/themed-view';
import { DarkModeToggle } from '@/components/toggleButton';
import { useAuth } from '@/contexts/auth-context';
import { useCartIds } from '@/hooks/use-fetch-listing-details';
import { useUser } from '@/hooks/use-user';
import { useTheme } from '@/hooks/useTheme';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';

export default function ProfileScreen() {

  const { colors, context } = useTheme()
  const isDark = context?.theme === 'dark'
  const { signOut, user, isLoading } = useAuth()

  const [isFetching, setIsFetching] = useState(false)
  const { data, loading } = useUser()

  const avatar = data?.avatar_url ?? ""

  const { data: cartData } = useCartIds()
  const cartCount = cartData?.length ?? 0;

  return (
    <ThemedView isTabVisible style={{}}>
      <CustomHeader title="My Profile">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <IconButton icon={"notifications"} onPress={() => router.push('/notifications')} badgeValue='9+' />
          <IconButton icon={"shopping-cart"} onPress={() => router.push('/cart')} badgeValue={cartCount ? String(cartCount) : ""} />
        </View>
      </CustomHeader>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 10, gap: 16 }}>

        {loading ?
          <RowProfile />
          :
          <PfpRowItem
            imageUrl={`${avatar}?v=${data?.updated_at}`}
            fName={data?.first_name ?? "unknown"}
            lName={data?.last_name ?? "unknown"}
            username={data?.username ?? "unknown123"}
            isVerified={data?.is_verified ?? false}
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
