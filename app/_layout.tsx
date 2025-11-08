import { useEffect } from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { lightTheme, darkTheme } from "@/constants/theme";
import { SettingsProvider } from "@/contexts/SettingsContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  useEffect(() => {
    async function prepare() {
      try {
        // Keep splash screen visible for minimum 1 second
        // This ensures a smooth startup experience
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // App initialization complete, hide splash screen
        await SplashScreen.hideAsync();
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    }

    prepare();
  }, []);

  return (
    <SettingsProvider>
      <PaperProvider theme={theme}>
        <Stack screenOptions={{ headerShown: false }} />
      </PaperProvider>
    </SettingsProvider>
  );
}
