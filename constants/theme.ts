import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

/**
 * Custom light theme extending Material Design 3
 */
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // You can customize colors here as needed
    // Example:
    // primary: '#6750A4',
    // secondary: '#625B71',
  },
};

/**
 * Custom dark theme extending Material Design 3
 */
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    // You can customize colors here as needed
    // Example:
    // primary: '#D0BCFF',
    // secondary: '#CCC2DC',
  },
};

/**
 * Type exports for theme usage in components
 */
export type AppTheme = typeof lightTheme;
