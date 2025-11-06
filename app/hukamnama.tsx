import { View, ScrollView, StyleSheet } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Text, Appbar, useTheme, Chip } from "react-native-paper";
import { getMockHukamnama } from "@/services/mock-data";

export default function HukamnamaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const hukamnama = getMockHukamnama();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Daily Hukamnama" />
        <Appbar.Action icon="share-variant" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.content}>
          <View style={styles.metaContainer}>
            <Chip icon="calendar" style={styles.chip}>
              {new Date(hukamnama.date).toLocaleDateString()}
            </Chip>
            <Chip icon="music" style={styles.chip}>
              {hukamnama.raag}
            </Chip>
            <Chip icon="account" style={styles.chip}>
              {hukamnama.author}
            </Chip>
          </View>

          <Text
            variant="titleMedium"
            style={[styles.angNumber, { color: theme.colors.primary }]}
          >
            Ang {hukamnama.angNumber}
          </Text>

          <Text variant="labelLarge" style={styles.label}>
            Gurmukhi
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.text, { color: theme.colors.onSurface }]}
          >
            {hukamnama.gurmukhi}
          </Text>

          <Text variant="labelLarge" style={[styles.label, styles.sectionSpace]}>
            Transliteration
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.text, { color: theme.colors.onSurfaceVariant }]}
          >
            {hukamnama.transliteration}
          </Text>

          <Text variant="labelLarge" style={[styles.label, styles.sectionSpace]}>
            Translation
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.text, { color: theme.colors.onSurfaceVariant }]}
          >
            {hukamnama.translation}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    marginRight: 4,
  },
  angNumber: {
    marginBottom: 16,
    fontWeight: "600",
  },
  label: {
    marginBottom: 8,
    fontWeight: "600",
  },
  text: {
    lineHeight: 24,
  },
  sectionSpace: {
    marginTop: 24,
  },
});
