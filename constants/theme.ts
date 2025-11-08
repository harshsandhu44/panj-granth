import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';

/**
 * Custom Orange/Warm Theme for Panj Granth
 * Inspired by shadcn/ui with warm orange accent colors
 * Converted from HSL to HEX for React Native Paper compatibility
 */

/**
 * Custom light theme with warm orange accent
 */
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,

    // Primary colors (Vibrant Orange)
    primary: '#FF6B1A',           // hsl(24.6 95% 53.1%) - Vibrant orange
    onPrimary: '#F9F9F8',         // hsl(60 9.1% 97.8%) - Off-white on primary
    primaryContainer: '#FFE8D9',  // Lighter orange container
    onPrimaryContainer: '#0A0706', // Dark brown on primary container

    // Secondary colors (Warm Grays)
    secondary: '#B8B3AF',         // Derived medium warm gray
    onSecondary: '#0A0706',       // Dark brown on secondary
    secondaryContainer: '#F5F5F4', // hsl(60 4.8% 95.9%) - Light warm gray
    onSecondaryContainer: '#1C1917', // Dark on secondary container

    // Tertiary/Accent colors
    tertiary: '#736E6A',          // hsl(25 5.3% 44.7%) - Medium warm gray
    onTertiary: '#FFFFFF',        // White on tertiary
    tertiaryContainer: '#F5F5F4', // Light warm gray container
    onTertiaryContainer: '#0A0706', // Dark brown on tertiary container

    // Error/Destructive colors
    error: '#F04438',             // hsl(0 84.2% 60.2%) - Red
    onError: '#FFFFFF',           // White on error
    errorContainer: '#FECDCA',    // Light red container
    onErrorContainer: '#7F1D1D',  // Dark red on error container

    // Background colors
    background: '#FFFFFF',        // hsl(0 0% 100%) - Pure white
    onBackground: '#0A0706',      // hsl(20 14.3% 4.1%) - Very dark brown

    // Surface colors
    surface: '#FFFFFF',           // White card surfaces
    onSurface: '#0A0706',         // Dark brown text on surfaces
    surfaceVariant: '#F5F5F4',    // Light warm gray surface variant
    onSurfaceVariant: '#736E6A',  // Medium warm gray on surface variant
    surfaceDisabled: '#F5F5F4',   // Disabled surface

    // Outline/Border colors
    outline: '#E7E5E4',           // hsl(20 5.9% 90%) - Light warm border
    outlineVariant: '#F5F5F4',    // Lighter border variant

    // Inverse colors
    inverseSurface: '#0A0706',    // Dark brown inverse surface
    inverseOnSurface: '#F9F9F8',  // Off-white inverse text
    inversePrimary: '#FFE8D9',    // Light orange inverse primary

    // Utility colors
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(10, 7, 6, 0.4)', // Dark brown backdrop

    // Elevation surfaces (warm progression)
    elevation: {
      level0: '#FFFFFF',          // Background level
      level1: '#FFFFFF',          // Card level
      level2: '#FAFAFA',          // Elevated card
      level3: '#F5F5F4',          // More elevated
      level4: '#F0EFED',          // Higher elevation
      level5: '#E7E5E4',          // Highest elevation
    },
  },
};

/**
 * Custom dark theme with warm orange accent
 */
export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,

    // Primary colors (Orange)
    primary: '#E8591C',           // hsl(20.5 90.2% 48.2%) - Orange
    onPrimary: '#F9F9F8',         // Off-white on primary
    primaryContainer: '#B8461A',  // Darker orange container
    onPrimaryContainer: '#FFE8D9', // Light orange on primary container

    // Secondary colors (Dark Warm Grays)
    secondary: '#524C48',         // Medium dark warm gray
    onSecondary: '#F9F9F8',       // Off-white on secondary
    secondaryContainer: '#282422', // hsl(12 6.5% 15.1%) - Dark warm gray
    onSecondaryContainer: '#E7E5E4', // Light warm on secondary container

    // Tertiary/Accent colors
    tertiary: '#A8A29E',          // hsl(24 5.4% 63.9%) - Medium gray
    onTertiary: '#1C1917',        // Very dark on tertiary
    tertiaryContainer: '#282422', // Dark warm gray container
    onTertiaryContainer: '#F5F5F4', // Light warm on tertiary container

    // Error/Destructive colors
    error: '#DC2626',             // hsl(0 72.2% 50.6%) - Dark red
    onError: '#FFFFFF',           // White on error
    errorContainer: '#7F1D1D',    // Very dark red container
    onErrorContainer: '#FECDCA',  // Light red on error container

    // Background colors
    background: '#0A0706',        // hsl(20 14.3% 4.1%) - Very dark brown
    onBackground: '#F9F9F8',      // hsl(60 9.1% 97.8%) - Off-white

    // Surface colors
    surface: '#0A0706',           // Very dark brown surfaces
    onSurface: '#F9F9F8',         // Off-white text on surfaces
    surfaceVariant: '#282422',    // Dark warm gray surface variant
    onSurfaceVariant: '#A8A29E',  // Medium gray on surface variant
    surfaceDisabled: '#282422',   // Disabled surface

    // Outline/Border colors
    outline: '#282422',           // hsl(12 6.5% 15.1%) - Dark warm border
    outlineVariant: '#1C1917',    // Darker border variant

    // Inverse colors
    inverseSurface: '#F9F9F8',    // Off-white inverse surface
    inverseOnSurface: '#0A0706',  // Dark brown inverse text
    inversePrimary: '#B8461A',    // Dark orange inverse primary

    // Utility colors
    shadow: '#000000',
    scrim: '#000000',
    backdrop: 'rgba(10, 7, 6, 0.6)', // Darker backdrop

    // Elevation surfaces (dark warm progression)
    elevation: {
      level0: '#0A0706',          // Background level
      level1: '#0A0706',          // Card level
      level2: '#1C1917',          // Elevated card
      level3: '#282422',          // More elevated
      level4: '#3C3734',          // Higher elevation
      level5: '#524C48',          // Highest elevation
    },
  },
};

/**
 * Type exports for theme usage in components
 */
export type AppTheme = typeof lightTheme;
