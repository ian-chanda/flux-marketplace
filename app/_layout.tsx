import { ThemeProvider } from '@/contexts/theme-context';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login" options={{ headerShown: false }} />
        <Stack.Screen name="auth/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modals/location" options={{
          presentation: "modal"
        }}/>
        <Stack.Screen name="modals/category" options={{
          presentation: "modal"
        }}/>
        <Stack.Screen name="modals/itemInformation" options={{presentation: "modal"}}/>
        <Stack.Screen name="modals/userDescription" options={{ presentation: "modal"}}/>
        <Stack.Screen name = "modals/profile" options = {{ presentation: "modal"}}/>
        <Stack.Screen name="me/settings" options={{ headerShown: false }} />
        <Stack.Screen name="me/profile" options={{ headerShown: false }} />
        <Stack.Screen name="me/purchases" options={{ headerShown: false }} />
        <Stack.Screen name="me/saved" options={{ headerShown: false }} />
        <Stack.Screen name="editProfile" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
    </GestureHandlerRootView>
  );
};
