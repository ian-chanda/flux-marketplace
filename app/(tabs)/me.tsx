import Button from '@/components/Button';
import { CustomHeader } from '@/components/customHeader';
import { IconButton } from '@/components/iconButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DarkModeToggle } from '@/components/toggleButton';
import { useTheme } from '@/hooks/useTheme';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';
import { TouchableOpacity, View } from 'react-native';
import { Image } from 'react-native';
import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CardButton = ({ attrIcon, attribute }: { attrIcon: any, attribute: string }) => {
  const { colors } = useTheme()
  return (
    <TouchableOpacity style={{
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      borderRadius: 15,
      height: 55,
      backgroundColor: colors.surface,
      justifyContent: 'space-between'
    }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MaterialIcons name={attrIcon} size={20} color={colors.text} />
        <ThemedText> {attribute} </ThemedText>
      </View>

      <MaterialIcons name='chevron-right' size={20} color={colors.accent} />
    </TouchableOpacity>
  )
}

export default function ProfileScreen() {

  const { colors, context } = useTheme()
  const isDark = context?.theme === 'dark'


  return (
    <ThemedView isTabVisible style={{}}>
      <CustomHeader title="My Profile">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <IconButton icon={"notifications"} onPress={() => { }} badgeValue='9+' />
          <IconButton icon={"shopping-cart"} onPress={() => { }} badgeValue='2' />
        </View>
      </CustomHeader>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, gap: 16 }}>

        <TouchableOpacity
          onPress={() => router.push('/profile')}
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
              <ThemedText type='largeBold'>Admin Admin</ThemedText>
              <ThemedText type='small'>@admin9003</ThemedText>
            </View>
          </View>

          <MaterialIcons name='chevron-right' size={20} color={colors.accent} />
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderRadius: 15,
          height: 55,
          backgroundColor: colors.surface,
          justifyContent: 'space-between'
        }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <MaterialIcons name={isDark ? 'dark-mode' : 'light-mode'} size={20} color={colors.text} />
            <ThemedText> {isDark ? "Dark mode" : "Light mode"} </ThemedText>
          </View>

          <DarkModeToggle />
        </TouchableOpacity>

        <View style={{ gap: 10, marginBottom: 10 }}>
          <ThemedText type='defaultBold'>Shopping</ThemedText>
          <CardButton attrIcon={"favorite-outline"} attribute='saved' />
          <CardButton attrIcon={"money"} attribute='purchases' />
          <CardButton attrIcon={"history"} attribute='recently viewed' />
          <CardButton attrIcon={"settings"} attribute='Settings' />
        </View>

        <Button title='Logout' onPress={() => { }} />

      </ScrollView>
    </ThemedView>
  );
}
