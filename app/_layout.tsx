import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { useColorScheme } from "react-native";
import { lightTheme, darkTheme } from "@/constants/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === "dark" ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <Stack />
    </PaperProvider>
  );
}
