import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {



  return (
    <AuthProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
};

function RootNavigator() {
  const { session, isLoading } = useAuth()

  if (isLoading)
    return (
      <ThemedView>
        <ThemedText>hellooo</ThemedText>
      </ThemedView>
    )

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={session == null}>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
          <Stack.Screen name="auth/signup-steps" options={{ headerShown: false }} />
        </Stack.Protected>

        <Stack.Protected guard={session !== null}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modals/location" options={{
            presentation: "modal"
          }} />
          <Stack.Screen name="modals/category" options={{
            presentation: "modal"
          }} />
          <Stack.Screen name="modals/itemInformation" options={{ presentation: "modal" }} />
          <Stack.Screen name="modals/userDescription" options={{ presentation: "modal" }} />
          <Stack.Screen name="modals/profile" options={{ presentation: "modal" }} />
          <Stack.Screen name="me/settings" options={{ headerShown: false }} />
          <Stack.Screen name="me/profile" options={{ headerShown: false }} />
          <Stack.Screen name="me/purchases" options={{ headerShown: false }} />
          <Stack.Screen name="me/saved" options={{ headerShown: false }} />
          <Stack.Screen name="editProfile" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>

    </>

  )
}
