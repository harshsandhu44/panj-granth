import { View, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Text, Appbar, useTheme } from "react-native-paper";
import { getMockAngData } from "@/services/mock-data";

export default function AngScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const angNumber = parseInt(id || "1", 10);
  const angData = getMockAngData(angNumber);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Appbar.Header>
        <Appbar.BackAction onPress={() => {}} />
        <Appbar.Content title={`Ang ${angNumber}`} />
        <Appbar.Action icon="bookmark-outline" onPress={() => {}} />
        <Appbar.Action icon="share-variant" onPress={() => {}} />
      </Appbar.Header>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.content}>
          <Text variant="labelLarge" style={styles.label}>
            Gurmukhi
          </Text>
          <Text
            variant="bodyLarge"
            style={[styles.text, { color: theme.colors.onSurface }]}
          >
            {angData.gurmukhi}
          </Text>

          <Text variant="labelLarge" style={[styles.label, styles.sectionSpace]}>
            Transliteration
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.text, { color: theme.colors.onSurfaceVariant }]}
          >
            {angData.transliteration}
          </Text>

          <Text variant="labelLarge" style={[styles.label, styles.sectionSpace]}>
            Translation
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.text, { color: theme.colors.onSurfaceVariant }]}
          >
            {angData.translation}
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
