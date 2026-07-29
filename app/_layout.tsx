import { ThemeProvider } from '@/contexts/theme-context';
import { useTheme } from '@/hooks/useTheme';
import { Stack } from 'expo-router';

export default function RootLayout() {


  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
};
