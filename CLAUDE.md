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
- **Root layout** (`app/_layout.tsx`): Basic Stack navigator using Expo Router
- **Home screen** (`app/index.tsx`): Placeholder screen with simple centered text

### Components
The `components/` directory does not currently exist. Previous template components are available in `app-example/components/` for reference:
- `themed-text.tsx`, `themed-view.tsx` - Theme-aware UI components
- `haptic-tab.tsx` - Tab with haptic feedback
- `parallax-scroll-view.tsx` - Scroll view with parallax effect
- `external-link.tsx` - External navigation links
- `ui/collapsible.tsx` - Collapsible component
- `ui/icon-symbol.tsx` - Platform-specific icon components

### Hooks & Constants
Not currently implemented. Reference implementations available in `app-example/`:
- **Hooks**: `use-color-scheme.ts`, `use-theme-color.ts` for theming
- **Constants**: `theme.ts` for color schemes and typography

## Architecture & Best Practices

### Routing with Expo Router
- Uses **Expo Router** (v6) with file-based routing
- Route files located in the `app/` directory
- Stack navigation configured in root layout
- **Planned patterns** (see `app-example/` for reference):
  - Tab navigation with grouped routes in `app/(tabs)/`
  - Modal screens using `presentation: 'modal'` option

### Theme System (Not Yet Implemented)
When implementing theming, refer to `app-example/` for patterns:
- Dual light/dark mode support using `@react-navigation/native` themes
- Color schemes and fonts defined in `constants/theme.ts`
- Custom hooks: `use-color-scheme.ts` and `use-theme-color.ts`
- Platform-specific implementations (`.web.ts` extensions)

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
- **Expo**: SDK ~54 with multiple packages (router, font, image, haptics, etc.)
- **Navigation**: React Navigation v7, Expo Router ~6
- **Animations**: React Native Reanimated ~4.1.1, Gesture Handler ~2.28.0
- **Platform Support**: react-native-web ~0.21.0, safe-area-context, screens
- **Development**: TypeScript ~5.9.2, ESLint ^9.25.0

## Development Guidelines

### Getting Started with Development
1. Create new routes in the `app/` directory
2. Build components in the `components/` directory
3. Add custom hooks to `hooks/` as needed
4. Define constants and theme in `constants/`
5. Reference `app-example/` for component patterns and best practices

### File Organization
- **Routes**: `app/` directory (file-based routing)
- **Components**: `components/` directory (create as needed)
- **Hooks**: `hooks/` directory (create as needed)
- **Constants**: `constants/` directory (create as needed)
- **Reference**: `app-example/` (previous template code for patterns)

### Code Style
- Use TypeScript strict mode
- Follow Expo and React Native best practices
- Use path aliases (`@/`) for imports
- Create platform-specific files when needed (.ios, .android, .web extensions)
