import { View, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Text, Appbar, useTheme, Chip, Divider } from "react-native-paper";
import { useHukamnama } from "@/hooks/useHukamnama";
import { GurbaniLine } from "@/components/GurbaniLine";
import { LoadingAng } from "@/components/LoadingAng";
import { ErrorView } from "@/components/ErrorView";
import { TranslationToggle } from "@/components/TranslationToggle";

export default function HukamnamaScreen() {
  const router = useRouter();
  const theme = useTheme();
  const { hukamnama, loading, error, refetch } = useHukamnama();

  if (loading) {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Daily Hukamnama" />
        </Appbar.Header>
        <LoadingAng />
      </>
    );
  }

  if (error || !hukamnama) {
    return (
      <>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title="Daily Hukamnama" />
        </Appbar.Header>
        <ErrorView
          title="Error loading Hukamnama"
          message={error || "Unable to load today's Hukamnama"}
          onRetry={refetch}
        />
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Daily Hukamnama" />
        <TranslationToggle />
        <Appbar.Action icon="share-variant" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.content}>
          {/* Date Information */}
          <View style={styles.dateContainer}>
            <Text variant="titleMedium" style={{ fontWeight: "600" }}>
              {hukamnama.date.gregorian}
            </Text>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
              {hukamnama.date.nanakshahi}
            </Text>
          </View>

          {/* Metadata */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.metaContainer}
          >
            <Chip icon="book-open-variant">Ang {hukamnama.pageNumber}</Chip>
            {hukamnama.writer && <Chip icon="account">{hukamnama.writer}</Chip>}
            {hukamnama.raag && <Chip icon="music">{hukamnama.raag}</Chip>}
            <Chip icon="counter">{hukamnama.count} lines</Chip>
          </ScrollView>

          <Divider style={styles.divider} />
        </View>

        {/* Lines */}
        {hukamnama.lines.map((line, index) => (
          <GurbaniLine key={line.id || index} line={line} />
        ))}
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
  dateContainer: {
    marginBottom: 16,
  },
  metaContainer: {
    gap: 8,
    paddingBottom: 4,
  },
  divider: {
    marginTop: 12,
  },
});
