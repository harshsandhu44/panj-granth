import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Appbar, useTheme, Chip, Divider } from "react-native-paper";
import { useAng } from "@/hooks/useAng";
import { GurbaniLine } from "@/components/GurbaniLine";
import { LoadingAng } from "@/components/LoadingAng";
import { ErrorView } from "@/components/ErrorView";
import { TranslationToggle } from "@/components/TranslationToggle";

export default function AngScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const theme = useTheme();
  const angNumber = parseInt(id || "1", 10);

  const { ang, loading, error, refetch } = useAng(angNumber);

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={`Ang ${angNumber}`} />
        </Appbar.Header>
        <LoadingAng />
      </View>
    );
  }

  if (error || !ang) {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={`Ang ${angNumber}`} />
        </Appbar.Header>
        <ErrorView
          title={`Error loading Ang ${angNumber}`}
          message={error || "Unable to load this Ang"}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`Ang ${angNumber}`} />
        <TranslationToggle />
        <Appbar.Action icon="bookmark-outline" onPress={() => {}} />
        <Appbar.Action icon="share-variant" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Metadata */}
        {(ang.writer || ang.raag) && (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.metaContainer}
            >
              {ang.writer && <Chip icon="account">{ang.writer}</Chip>}
              {ang.raag && <Chip icon="music">{ang.raag}</Chip>}
              <Chip icon="counter">{ang.count} lines</Chip>
            </ScrollView>
            <Divider />
          </>
        )}

        {/* Lines */}
        {ang.lines.map((line, index) => (
          <GurbaniLine key={line.id || index} line={line} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  metaContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
});
