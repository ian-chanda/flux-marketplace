// import { useContext } from 'react';
// import { ThemeContext } from './appContext';
// import { themes } from './theme';

import { Colors } from "@/constants/theme";
import { ThemeContext } from "@/contexts/theme-context";
import { useContext } from "react";

// export function useTheme() {
//   const { theme, toggleTheme } = useContext(ThemeContext);
//   const colors = themes[theme];
  
//   return {
//     theme,
//     toggleTheme,
//     colors,
//   };
// }

/**returns: colors and toggleTheme */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  const colors = Colors[context?.theme === 'light' ? 'light' : 'dark']; 
  return {
    context,
    colors
  };
}
