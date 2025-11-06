import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Text, Appbar, useTheme } from "react-native-paper";

export default function BookmarksScreen() {
  const router = useRouter();
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Bookmarks" />
        <Appbar.Action icon="magnify" onPress={() => {}} />
      </Appbar.Header>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.emptyState}>
          <Text variant="headlineSmall" style={styles.emptyTitle}>
            No Bookmarks Yet
          </Text>
          <Text
            variant="bodyMedium"
            style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}
          >
            Start reading and bookmark your favorite Angs to see them here.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyTitle: {
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
  },
});
