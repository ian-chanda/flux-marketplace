import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';

export type SmallIconButtonProps = {
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  onPress?: () => void;
};

export function SmallIconButton({ icon, title, onPress }: SmallIconButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        flexShrink: 0,
        flexDirection: 'row',
        paddingHorizontal: 10,
        height: 35,
        gap: 3,
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 100,
      }}>
      <Ionicons name={icon} size={18} color={colors.accent} />
      <ThemedText type="mediumFaded">{title}</ThemedText>
    </TouchableOpacity>
  );
}