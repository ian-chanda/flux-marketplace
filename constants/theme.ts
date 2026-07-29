/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

export const Colors = {
  light: {
    primary: '#95726a',        // mauve-bark 500 - main brand color
    accent: '#e02c1f',         // blood-red 500 - bold pop accent
    secondary: '#be4141',      // blushed-brick 500 - secondary accent
    background: '#f8f3ed',     // almond-cream 50 - soft pale background
    surface: '#f1e7da',        // almond-cream 100 - light tinted surface/cards
    text: '#15100f',           // mauve-bark 950 - deep for readability
    disabled: '#95726a88',     // mauve-bark 500 with opacity
    placeholder: '#be4141aa',  // blushed-brick 500 with opacity
    backdrop: 'rgba(0,0,0,0.3)',
    shadowColor: 'rgba(224, 44, 31, 0.3)', // blood-red glow
    error: '#b42318',          // blood-red 600 - clear error state
    success: '#5c7a3d',        // muted olive green - complements warm palette
  },
  dark: {
    primary: '#aa8e88',        // mauve-bark 400 - main brand color
    accent: '#e7564b',         // blood-red 400 - glowing pop accent
    secondary: '#cb6767',      // blushed-brick 400 - pops on dark
    background: '#15100f',     // mauve-bark 950 - deep dark
    surface: '#1e1715',        // mauve-bark 900 - darker tinted surface
    text: '#f1e7da',           // almond-cream 100 - light cream text
    disabled: '#aa8e8888',     // muted mauve-bark opacity
    placeholder: '#cb6767aa',
    backdrop: 'rgba(0,0,0,0.7)',
    shadowColor: 'rgba(231, 86, 75, 0.4)', // blood-red glow
    error: '#ed8078',          // blood-red 300 - visible on dark bg
    success: '#8fae6b',        // lighter olive green - visible on dark bg
  }
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
