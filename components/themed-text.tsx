import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'defaultSmall' |'defaultBold' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'price_font' | 'small_price_font'| 'ButtonText';
};

export function ThemedText({
  style,
  lightColor = "#F5F5F7",
  darkColor = "#191919",
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'defaultSmall' ? styles.defaultSmall : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultBold' ? styles.defaultBold: undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'price_font' ? styles.price_font : undefined,
        type === 'small_price_font' ? styles.small_price_font: undefined,
        type === 'ButtonText' ? styles.ButtonText: undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSmall: {
    fontSize: 11,
    lineHeight: 20,
    
  },
  defaultBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "bold"
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
    opacity: 0.6
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
