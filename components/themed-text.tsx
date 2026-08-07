import { StyleSheet, Text, type TextProps } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useTheme } from '@/hooks/useTheme';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?:
    // size scale
    | 'small'
    | 'medium'
    | 'default'
    | 'large'
    // bold variants
    | 'smallBold'
    | 'mediumBold'
    | 'defaultBold'
    | 'largeBold'
    // low opacity variants
    | 'smallFaded'
    | 'mediumFaded'
    | 'defaultFaded'
    | 'largeFaded'
    // existing / misc
    | 'defaultSmall'
    | 'title'
    | 'defaultSemiBold'
    | 'subtitle'
    | 'link'
    | 'price_font'
    | 'small_price_font'
    | 'ButtonText';
};

export function ThemedText({
  style,
  lightColor = "#F5F5F7",
  darkColor = "#191919",
  type = 'default',
  ...rest
}: ThemedTextProps) {
  // const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  const { colors } = useTheme();
  const color = colors.text;

  return (
    <Text
      style={[
        { color },
        styles[type as keyof typeof styles],
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  // ---- size scale ----
  small: {
    fontSize: 12,
    lineHeight: 18,
  },
  medium: {
    fontSize: 14,
    lineHeight: 21,
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  large: {
    fontSize: 20,
    lineHeight: 28,
  },

  // ---- bold variants ----
  smallBold: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  mediumBold: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
  },
  defaultBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: 'bold',
  },
  largeBold: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: 'bold',
  },

  // ---- low opacity (faded) variants ----
  smallFaded: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.6,
  },
  mediumFaded: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.6,
  },
  defaultFaded: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.6,
  },
  largeFaded: {
    fontSize: 20,
    lineHeight: 28,
    opacity: 0.6,
  },

  // ---- existing / misc ----
  defaultSmall: {
    fontSize: 11,
    lineHeight: 20,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    opacity: 0.6,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
  price_font: {
    fontSize: 17,
    color: "black",
    fontWeight: "bold",
  },
  small_price_font: {
    fontSize: 10,
    color: "gray",
    fontWeight: "bold",
  },
  ButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});
