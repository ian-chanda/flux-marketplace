import { ThemeProvider } from '@/contexts/theme-context';
import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function RootLayout() {

  const { colors } = useTheme()

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modals/location" options={{
          presentation: "modal"
        }}/>
        <Stack.Screen name="modals/category" options={{
          presentation: "modal"
        }}/>
      </Stack>
    </ThemeProvider>
  );
};
