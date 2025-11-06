/**
 * SearchResult Component
 * Displays individual search result with metadata
 */

import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Chip, useTheme, Divider } from "react-native-paper";
import { useRouter } from "expo-router";
import { SearchResultWithContext } from "@/types/index";
import { useSettings } from "@/contexts/SettingsContext";

interface SearchResultProps {
  result: SearchResultWithContext;
}

export function SearchResult({ result }: SearchResultProps) {
  const theme = useTheme();
  const router = useRouter();
  const { settings } = useSettings();
  const { matchedLine, contextBefore, contextAfter } = result;

  const handlePress = () => {
    router.push(`/ang/${matchedLine.angNumber}`);
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.container}>
        {/* Context before (if available) */}
        {contextBefore.length > 0 && (
          <View style={styles.contextContainer}>
            {contextBefore.map((line) => (
              <Text
                key={line.id}
                variant="bodySmall"
                style={[styles.contextText, { color: theme.colors.onSurfaceVariant }]}
              >
                {line.gurmukhi}
              </Text>
            ))}
          </View>
        )}

        {/* Matched line - highlighted */}
        <View style={[styles.matchedContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text
            variant="bodyLarge"
            style={[styles.matchedText, { color: theme.colors.onPrimaryContainer }]}
          >
            {matchedLine.gurmukhi}
          </Text>

          {/* English translation */}
          {settings.translation.showEnglishTranslation &&
            matchedLine.translation?.english && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.translationText,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {matchedLine.translation.english}
              </Text>
            )}

          {/* Punjabi translation */}
          {settings.translation.showPunjabiTranslation &&
            matchedLine.translation?.punjabi && (
              <Text
                variant="bodyMedium"
                style={[
                  styles.translationText,
                  { color: theme.colors.onPrimaryContainer },
                ]}
              >
                {matchedLine.translation.punjabi}
              </Text>
            )}

          {/* Transliteration */}
          {settings.translation.showTransliteration && (
            <Text
              variant="bodySmall"
              style={[
                styles.transliterationText,
                { color: theme.colors.onPrimaryContainer },
              ]}
            >
              {settings.translation.transliterationType === "english"
                ? matchedLine.transliteration?.english
                : matchedLine.transliteration?.devanagari}
            </Text>
          )}
        </View>

        {/* Context after (if available) */}
        {contextAfter.length > 0 && (
          <View style={styles.contextContainer}>
            {contextAfter.map((line) => (
              <Text
                key={line.id}
                variant="bodySmall"
                style={[styles.contextText, { color: theme.colors.onSurfaceVariant }]}
              >
                {line.gurmukhi}
              </Text>
            ))}
          </View>
        )}

        {/* Metadata chips */}
        <View style={styles.metadataContainer}>
          <Chip icon="book-open-variant" compact>
            Ang {matchedLine.angNumber}
          </Chip>
          {matchedLine.writer && (
            <Chip icon="account" compact>
              {matchedLine.writer}
            </Chip>
          )}
          {matchedLine.raag && (
            <Chip icon="music" compact>
              {matchedLine.raag}
            </Chip>
          )}
        </View>

        <Divider style={styles.divider} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  contextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  contextText: {
    lineHeight: 20,
    opacity: 0.7,
  },
  matchedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 4,
    borderRadius: 8,
  },
  matchedText: {
    lineHeight: 24,
    fontWeight: "500",
  },
  translationText: {
    marginTop: 8,
    lineHeight: 20,
  },
  transliterationText: {
    marginTop: 4,
    lineHeight: 18,
    fontStyle: "italic",
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  divider: {
    marginTop: 12,
  },
});
