import { View, type ViewProps } from 'react-native';

import { useTheme } from '@/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  isTabViisble: boolean;
};


export function ThemedView({ style, isTabViisble, ...otherProps }: ThemedViewProps) {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets();

  return <View style={[{ 
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: insets.top,
    paddingBottom: insets.bottom + 20, 
    
  }, style]} {...otherProps} />;
}
