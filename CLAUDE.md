# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Panj Granth is a React Native mobile application built with Expo and TypeScript. The app uses Expo Router for file-based navigation and supports iOS, Android, and web platforms.

**Current Status**: The app has been reset to a blank slate (commit 4b25846). All starter template code has been moved to `app-example/` for reference. The project is ready for fresh development while maintaining full Expo infrastructure.

## Development Commands

### Setup
```bash
npm install
```

### Running the App
```bash
npx expo start              # Start development server
npm run android             # Run on Android emulator
npm run ios                 # Run on iOS simulator
npm run web                 # Run in web browser
```

### Code Quality
```bash
npm run lint                # Run ESLint
```

### Project Reset
```bash
npm run reset-project       # Move starter code to app-example and create blank app directory
```

## Current Application Structure

### Routes
Currently, the app has a minimal structure:
- **Root layout** (`app/_layout.tsx`): Stack navigator wrapped with React Native Paper's PaperProvider for theming
- **Home screen** (`app/index.tsx`): Placeholder screen with simple centered text

### Components
The `components/` directory does not currently exist. Previous template components are available in `app-example/components/` for reference:
- `themed-text.tsx`, `themed-view.tsx` - Theme-aware UI components
- `haptic-tab.tsx` - Tab with haptic feedback
- `parallax-scroll-view.tsx` - Scroll view with parallax effect
- `external-link.tsx` - External navigation links
- `ui/collapsible.tsx` - Collapsible component
- `ui/icon-symbol.tsx` - Platform-specific icon components

**Note**: Use React Native Paper components for UI development. See Theme System section below.

### Constants
- **Theme** (`constants/theme.ts`): Material Design 3 theme configuration with light and dark mode support

## Architecture & Best Practices

### Routing with Expo Router
- Uses **Expo Router** (v6) with file-based routing
- Route files located in the `app/` directory
- Stack navigation configured in root layout
- **Planned patterns** (see `app-example/` for reference):
  - Tab navigation with grouped routes in `app/(tabs)/`
  - Modal screens using `presentation: 'modal'` option

### Theme System (React Native Paper + Material Design 3)
The app uses **React Native Paper** with Material Design 3 for consistent UI components and theming:

**Setup:**
- `PaperProvider` wraps the app in `app/_layout.tsx`
- Automatic light/dark mode switching based on system preferences
- Theme configuration in `constants/theme.ts`

**Available Themes:**
- `lightTheme` - Material Design 3 light theme (extends `MD3LightTheme`)
- `darkTheme` - Material Design 3 dark theme (extends `MD3DarkTheme`)
- Custom color overrides can be added to each theme

**Using the Theme in Components:**
```typescript
import { useTheme } from 'react-native-paper';

function MyComponent() {
  const theme = useTheme();
  // Access colors: theme.colors.primary, theme.colors.background, etc.
}
```

**Available Material Design 3 Components:**
- Layout: `Surface`, `Card`, `Divider`, `List`
- Inputs: `Button`, `TextInput`, `Checkbox`, `RadioButton`, `Switch`, `Chip`
- Navigation: `Appbar`, `BottomNavigation`, `Drawer`, `TabBar`
- Feedback: `Dialog`, `Snackbar`, `Banner`, `ProgressBar`, `ActivityIndicator`
- Display: `Avatar`, `Badge`, `DataTable`, `FAB`, `Icon`, `IconButton`, `Menu`
- Typography: `Text` (with variants like `displayLarge`, `headlineMedium`, `bodySmall`, etc.)

**Best Practices:**
- Use Paper components instead of plain React Native components for consistent theming
- Access theme colors via `useTheme()` hook in custom components
- Customize theme colors in `constants/theme.ts` to match app branding
- Paper components automatically adapt to light/dark mode

### Component Patterns
- **Path aliases**: Use `@/` to import from root (e.g., `@/components/my-component`)
- **Platform-specific files**: Use `.ios.tsx`, `.android.tsx`, `.web.ts` extensions
- **Themed components**: Pattern available in `app-example/` - components accepting `lightColor`/`darkColor` props
- **UI components**: Organize in `components/` and `components/ui/` directories

### TypeScript Configuration
- Strict mode enabled
- Path alias `@/*` maps to root directory
- Extends `expo/tsconfig.base`
- Includes Expo type definitions

### Expo Configuration
- App config in `app.json` under `expo` key
- App name: "panj-granth"
- Scheme: `panjgranth://` (for deep linking)
- New Architecture enabled (`newArchEnabled: true`)
- Typed routes experiment enabled
- React Compiler experiment enabled
- Platform-specific configurations:
  - iOS: Tablet support enabled
  - Android: Edge-to-edge display enabled
  - Web: Static output configured

### Key Dependencies
- **Core**: React 19.1.0, React Native 0.81.5, React DOM 19.1.0
- **UI Library**: React Native Paper (Material Design 3)
- **Expo**: SDK ~54 with multiple packages (router, font, image, haptics, etc.)
- **Navigation**: React Navigation v7, Expo Router ~6
- **Animations**: React Native Reanimated ~4.1.1, Gesture Handler ~2.28.0
- **Platform Support**: react-native-web ~0.21.0, safe-area-context, screens
- **Development**: TypeScript ~5.9.2, ESLint ^9.25.0

## Development Guidelines

### Getting Started with Development
1. Create new routes in the `app/` directory
2. Use React Native Paper components for UI consistency
3. Build custom components in the `components/` directory when needed
4. Add custom hooks to `hooks/` as needed
5. Customize theme colors in `constants/theme.ts` to match branding
6. Reference `app-example/` for component patterns and best practices

### File Organization
- **Routes**: `app/` directory (file-based routing)
- **Components**: `components/` directory (create as needed)
- **Hooks**: `hooks/` directory (create as needed)
- **Constants**: `constants/` directory (theme configuration)
- **Reference**: `app-example/` (previous template code for patterns)

### Code Style
- Use TypeScript strict mode
- Follow Expo and React Native best practices
- Use path aliases (`@/`) for imports
- Prefer React Native Paper components for UI elements
- Use `useTheme()` hook to access theme colors in custom components
- Create platform-specific files when needed (.ios, .android, .web extensions)

### UI Development
- **Primary approach**: Use React Native Paper components (Button, Card, TextInput, etc.)
- **Custom components**: When building custom UI, use `useTheme()` to access theme colors
- **Icons**: Use `@expo/vector-icons` or Paper's Icon component
- **Typography**: Use Paper's Text component with MD3 variants (displayLarge, headlineMedium, bodySmall, etc.)
- **Theming**: All Paper components automatically respect light/dark mode
