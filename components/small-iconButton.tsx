import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react';
import { TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';

export type SmallIconButtonProps = {
  icon?: ComponentProps<typeof Ionicons>['name'];
  title: string;
  isSelected?: boolean;
  onPress?: () => void;
};

export function SmallIconButton({ icon, title, isSelected, onPress }: SmallIconButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={{
        flexShrink: 0,
        flexDirection: 'row',
        paddingHorizontal: 10,
        minWidth: 50,
        height: 35,
        gap: 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isSelected ? colors.secondary : colors.surface,
        borderRadius: 100,
      }}>
      {icon && <Ionicons name={icon} size={18} color={colors.accent} />}
      <ThemedText type="mediumFaded" style={{color: isSelected ? colors.background : colors.text}}>{title}</ThemedText>
    </TouchableOpacity>
  );
}
